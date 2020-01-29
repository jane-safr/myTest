let http = require('http');
let fs = require('fs');
let path = require('path');
let app = require('./myExpress');
let ejs = require('ejs');

app.init();
app.engine('ejs', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(new Error(err));
    // this is an extremely simple template engine
    var rendered = content.toString().replace('#title#', ''+ options.title +'')
    .replace('#message#', ''+ options.message +'');
    return callback(null, rendered);
  });
});

 app.setApp("views", __dirname + "/views");
 app.setApp("img", __dirname + "/img");
 app.setApp('view engine','ejs');

http.createServer(function (request, response) {
    console.log('request ', request.url);



    //app.set('view engine','ejs1');


    let filePath = '.' + request.url;

    console.log('filePath',filePath,'app.dispatch',app.dispatch(request.url));
 // let extname = String(path.extname(request.url)).toLowerCase();
    filePath = app.dispatch(request.url,'');

    // if (filePath == './') {
    //         // // запускаем главную страницу
    //         filePath = app.dispatch(filePath);
    //         console.log('filePath',filePath);
    // }
    // else
    // {    
    //   filePath = app.dispatch(request.url);
    //   console.log('filePath',filePath,'app.dispatch',app.dispatch(request.url));
    // }
    // if (filePath == './login') {
    //   filename = './views/login.ejs';
    //     console.log(filePath );
    // }
    //console.log('app',app);
            // инициализируем роутер

       


    let extname = String(path.extname(filePath)).toLowerCase();
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

            if(filePath == './views/login.ejs' || './views/login.css')
              {   
              //   console.log('contentType',contentType);
              // response.writeHead(200, { 'Content-Type': contentType });
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