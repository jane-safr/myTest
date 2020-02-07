
const port = 7000;
const HOST = 'localhost';
const WebSocket = require("ws");
let http = require('http');
let fs = require('fs');
let path = require('path');
let app = require('./myExpress');
let ejs = require('ejs');
let serverDB = require("./serverDB");

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
      // if (request.session){console.log('request.session')}
     // request.user = user;
     //s = request.Session();
        if(usersOnline.findIndex(x => x.id==user.id) ===-1)
        {usersOnline.push(user);}
       // console.log('request.user!!!!!!!!!!!!!!!',request.user);
         response.redirect("/");
      //   console.log('request.user---!!!!!!!!!!!!!!!',request.user);
        
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
///WebSocket
let serverClass = require("./serverClass");
let usersOnline=[];
// const session = require("express-session");
// let sessionParser = session({
//   secret: "mysecret",
//   store: new FileStore(),
//   cookie: {
//     path: "/",
//     httpOnly: true,
//     maxAge: 60 * 60 * 1000
//   },
//   resave: true,
//   saveUninitialized: true
// });
const server = new WebSocket.Server({
  port,
  // verifyClient: (info, done) => {
  //   sessionParser(info.req, {}, () => {
  //     done(info.req.session);
  //   });
  // },
  noServer: false
});
let _idChat = 0;

server.on("connection", function(ws, request) {
console.log("server.on(connection)");
  let commands = {};
  //добавление/изменение пользователей в чате
  commands.insertUserInChat=  serverClass.insertUserInChat;
  //выбор пользователей в чате
  commands.checkUsersInChat=  serverClass.checkUsersInChat;
  //история чата
  commands.History=  serverClass.History;
  //фильтр пользователей
  commands.getFilterUsers=  serverClass.getFilterUsers;
  //сохранение сообщений
  commands.saveMessage=  serverClass.saveMessage;

   ws.on("message", message => {

     message = JSON.parse(message);
     console.log('messageServer',message);
     //закрытие сокета с клиента вводом строки exit
     if (message.value === "exit") {
       ws.close();
       console.log("Exit " + server);
      } 
     else   
    //обработка действий клиента
    console.log('message.sys1',message.sys);
     if (message.sys === "Yes") 
     {
     // console.log('message.sys',message.sys);
      commands[message.act](function(err, idChat,wsSend) {
      //  console.log('^^^^^^^^^^^^^^',message.act,err);
       if(err){console.log('err',message.act,err);}
        if(idChat) { _idChat = idChat;} else {_idChat=0;}
        if(wsSend) 
         {
          if (message.act == 'getFilterUsers')
               {
                wsSend = JSON.parse(wsSend); 
                 wsSend.usersOnline = usersOnline; 
                 wsSend.idChat= _idChat;
                 wsSend = JSON.stringify(wsSend); 
               }
               ws.send(wsSend);
        }
      },message, _idChat,ws.user.id);
    } 
    //рассылка сообщений пользователям
    else 
    {
         server.clients.forEach(client => {
         if (client.readyState === WebSocket.OPEN) {
            if ( message.online || client.user.id == ws.user.id || message.usersSend.split(',').findIndex(x => x==client.user.id)  !=-1) 
                {  
                  console.log('рассылка', client.user.id);
                client.send(
                  JSON.stringify({
                    cell: "form",
                    message
                  })
                );
                }
         }
       });
       //сохранение сообщений 
       if(!message.online )
       {
       //console.log('Я тут saveMessage!!');
       commands['saveMessage'](function(err,all)
       {
          //console.log('saveMessage!!!!!!!!!!!!!!!!!!!!!!!!!');
         if(err){
                 console.log('err',err);
                 return;
               }
              },message,ws.user.id);
       }

     }
    console.log('server.clients.size',server.clients.size);
 
   });
   //закрытие сокета
   ws.on("close", function() {
    if(ws.user)
    {
      try
      {
       usersOnline.splice( usersOnline.findIndex(x => x.id==ws.user.id), 1 );
       request.logout();
       ws.user = null;
      }
      catch
      {}
    }
   });

  // if (request.session.passport && ws.user != request.session.passport.user)
  console.log('request.user',request.user)
  if(request.user)
   {
      ws.user =request.user ; }

    //пользователь зашел
    if (ws.user)
    {
     // ws.user = _user;
      console.log('sendUser!',ws.user);
      ws.send(
        JSON.stringify({
          cell: "user",
          user: ws.user
        }));
        //добавление пользователя в usersOnline, если его там нет
        if(usersOnline.findIndex(x => x.id==ws.user.id) ===-1)
        {usersOnline.push(ws.user);}
    }
    //заполнение таблицы пользователей
    commands['getFilterUsers'](function(err, idChat,wsSend) {
      if(err){return;}
        if(idChat)  _idChat = idChat;
        if(wsSend) 
        {
                wsSend = JSON.parse(wsSend); 
                wsSend.usersOnline = usersOnline; 
                wsSend.idChat= _idChat;
                wsSend = JSON.stringify(wsSend); 
              ws.send(wsSend);
        }
      },null, _idChat,(ws.user?ws.user.id:0));

 });


const serverHttp = require("http").createServer(onRequest);

serverHttp.listen(8125, function() {
  console.log(`Listening on http://${HOST}:8125`);
});
//console.log('Server running at http://127.0.0.1:8125/');