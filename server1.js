const port = 8000;
const HOST = 'localhost';
let http = require('http');
let fs = require('fs');
let path = require('path');
let app = require('./myExpress');
let ejs = require('ejs');
let serverDB = require("./serverDB");
let usersOnline=[];

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

//  app.get("/login", function(req, res) {
//   console.log('app.get("/login/req.user',req.user);
//   res.render("login.ejs", { user: req.user, message: ' ' , SelForm: 'formlogin', notUser: undefined});
// });
// Request handler for /greet end point.
const handleGreetRequest = (request, response) => {
  request.logIn = function(user){
    if(user)
    {  
        if(usersOnline.findIndex(x => x.id==user.id) ===-1)
        {usersOnline.push(user);}
        console.log("local");
         response.redirect("/")
    }
    };
  
let filePath = '.' + request.url;
 //let extname = String(path.extname(filePath)).toLowerCase();

    filePath = app.dispatch(request.url,'');
 
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
    //console.log('request.method',request.method );
    if (request.method === 'POST') {
    app.postForm(request, function(err,body){
      if(err){console.log(err);return;}
      console.log(body, body.email);
      serverDB.login(body.email,body.password,function(err,user){
        //console.log(user);
        if (err) {
          console.log(err);
          return;
        }
        if (!user) {
         // app.ejsRender(response,filePath,fs,ejs,content,contentType);
          // res.render("login.ejs", { user: undefined, message: "Укажите правильный email или пароль!", SelForm: 'formlogin', notUser: undefined});
          // req.logout();
          // return;
          content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: undefined, message: "Укажите правильный email или пароль!", SelForm: 'formlogin', notUser: undefined});
          console.log('content',contentType);
          app.Render(response,content,contentType);
          //console.log('Я тут!POST');
          //request.logout();
          return;
        }
        request.logIn(user);
      })
    })
  }
  else
    // if(filePath == './views/login' )
    //   {console.log('Я тут!!!');}
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
        else 
        {
          //app.ejsRender(response,filePath,fs,ejs,content,contentType);
             // response.writeHead(200, { 'Content-Type': contentType });
             if(filePath.includes('ejs'))
              {   
                 content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: undefined, message: ' ' , SelForm: 'formlogin', notUser: undefined});
             }
             //response.end(content, 'utf-8');
               app.Render(response,content,contentType);
              // console.log('Я тут!!!!GET');
        }
    });
}
const onRequest = (req, res) => {
  if (req.url.startsWith('/') || req.url.startsWith('/login') ) {
    res.redirect = function(location)
        {   
          res.writeHead(302,  {Location: location})
          res.end();
        }
    handleGreetRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Страница не найдена.');
  }
};
const serverHttp = require("http").createServer(onRequest);
// http.createServer(function (request, response) {
 

// }).listen(8125);

serverHttp.listen(8125, function() {
  console.log(`Listening on http://${HOST}:8125`);
});
//console.log('Server running at http://127.0.0.1:8125/');