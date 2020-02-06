let http = require('http');
let fs = require('fs');
let path = require('path');
let app = require('./myExpress');
let ejs = require('ejs');

app.init();
// app.engine('ejs', function (filePath, options, callback) { // define the template engine
//   fs.readFile(filePath, function (err, content) {
//     if (err) return callback(new Error(err));
//     // this is an extremely simple template engine
//     var rendered = content.toString().replace('#title#', ''+ options.title +'')
//     .replace('#message#', ''+ options.message +'');
//     return callback(null, rendered);
//   });
// });

 app.set("views", __dirname + "/views");
 app.set("img", __dirname + "/img");
 app.set('view engine','ejs');

 app.get("/login", function(req, res) {
  console.log('app.get("/login/req.user',req.user);
  res.render("login.ejs", { user: req.user, message: ' ' , SelForm: 'formlogin', notUser: undefined});
});


http.createServer(function (request, response) {

app.postForm(request, function(err,body){
  console.log(body);
})


let filePath = '.' + request.url;
 let extname = String(path.extname(filePath)).toLowerCase();

    filePath = app.dispatch(request.url,extname);
 
   extname = String(path.extname(filePath)).toLowerCase();
  //  console.log('extname',extname)
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
        ,'.ejs': 'text/html; charset=utf-8'
    };
    //console.log('mimeTypes[extname]',extname,mimeTypes[extname]);
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    // if(filePath == './views/login' )
    // {  
    //   app.render("login.ejs", { user: 'req.user', message: ' ' , SelForm: 'formlogin', notUser: undefined});
    //     console.log('filePathLogin',filePath);
    //     return;

    // }
    //console.log('Я тут!!!',filePath);
    if(filePath == './views/login' )
      {console.log('Я тут!!!');}
    fs.readFile(filePath, function(error, content) {
    // console.log(content);
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
          response.writeHead(200, { 'Content-Type': contentType });
            if(filePath.includes('./views'))
           //if(filePath == './views/login.ejs' ||  './login')
              {   
               //  console.log('Я тут!!!');
               response.writeHead(200, { 'Content-Type': contentType });
                let filename =  filePath;       
                 let htmlContent = fs.readFileSync(filename, 'utf8');
                let htmlRenderized = ejs.render(htmlContent, {filename: 'login',  user: undefined, message: ' ' , SelForm: 'formlogin', notUser: undefined});
                content =htmlRenderized;
             // response.end(htmlRenderized, 'utf-8');
            }
              response.end(content, 'utf-8');
      // else
      // {
      //   // response.writeHead(200, { 'Content-Type': contentType });
      //   response.end(content, 'utf-8');
      // }
        }
    });

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');