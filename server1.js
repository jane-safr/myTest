const port = 7000;
const HOST = 'localhost';
const WebSocket = require("ws");
//let http = require('http');
let fs = require('fs');
let path = require('path');
let app = require('./myExpress');
let ejs = require('ejs');
let serverDB = require("./serverDB");
let serverClass = require("./serverClass");
let  session = require('./sessions/core').magicSession();


// process.env.ACCESS_TOKEN_SECRET ='a93c47d0633a030fd8c911c66c72d3c6cb296257b7983b7ef43cbe7e145afe9848053db936e7d59df54ab130b330267acf2ad1a5fb1ef8130ad074a2dc299162';
// process.env.REFRESH_TOKEN_SECRET ='b11a211eb190f326d28985e3e846ebefa6dcdcd0957dac02cd3aeacbb0f1c6b9f8091b57a157d0016a2fc340dd4aebab679f20f88b5c7a0e4392187c302146ad';
// //сессии
// let sessions = require("client-sessions");
// var requestSessionHandler = sessions({
//   cookieName: 'mySession', // cookie name dictates the key name added to the request object
//   secret: 'blargadeeblargblarg', // should be a large unguessable string
//   duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
//   activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
// });

// app.engine('ejs', function (filePath, options, callback) { // define the template engine
//   fs.readFile(filePath, function (err, content) {
//     if (err) return callback(new Error(err));
//     // this is an extremely simple template engine
//     var rendered = content.toString().replace('#title#', ''+ options.title +'')
//     .replace('#message#', ''+ options.message +'');
//     return callback(null, rendered);
//   });
// });

//инициализация и настройки
//app.init();
//  app.set("views", __dirname + "/views");
//  app.set("img", __dirname + "/img");
//  app.set('view engine','ejs');

let mySession;
let _user;
let usersOnline=[];

const handleGreetRequest = (request, response) => {
  //сессия
  mySession = request.session;
  console.log('mySession',mySession.id);
 // if(mySession)
  serverDB.loginFromSession(mySession.id,function(err, all) {
    if (err) {
     console.log("err loginFromSession",err);
     cb(err,null);
    }
    if(all)
    {    _user =
      {
        id:     all.id,
        email:  all.email,
        login:  all.login,
        fio:   all.fio
        };
        if(mySession) {console.log("Сессия найдена",_user,mySession.id);}
      }
      else 
      {
        console.log("Сессия не найдена",_user);
       if(mySession) {console.log("Сессия не найдена",mySession.id);}
      _user = null;
      }

        // _user = all?wsSend:null;
    })
    console.log('request.logIn',_user);
    request.logIn(_user);
    console.log('loginFromSession_user',_user)
  //инициализация и настройки
  app.init() ;
  app.set("views", __dirname + "/views");
  app.set("img", __dirname + "/img");
  app.set('view engine','ejs');
 

  //разборка/определение url
let filePath = '.' + request.url;
 let extname = String(path.extname(request.url)).toLowerCase();
//console.log('request.getSession()',request.getSession());


 //выход
 if(filePath.includes('logout')) 
 { mySession = null; 
   request.logout();
   if(_user)
      {          serverClass.login(function(err,user){
              if (err) {
                console.log(err);
                return;
              }
            // response.redirect("/");
            },_user.email,null,null)}
  //request.headers.cookie = null;
  // = null;
  console.log('logout', request.session.data.user,_user);
  //filePath = './index.html';
   }
  filePath = app.dispatch(request.url,extname);
// console.log('filePathLog',filePath);
//let session1 = require('./sessions/core').session;
//mySession = request.session;

if(request.session.data.user)
{
     _user = JSON.parse(request.session.data.user);
     console.log('request.session.data.user',request.session.data.user,'_user' ,_user );
  // _user =request.session.data.user;
  // console.log ('dispatch',_user);
  }
 
   extname = String(path.extname(filePath)).toLowerCase();
   let contentType = app.mimeTypes[extname] || 'text/html; charset=utf-8';

//POST login
    if (request.method === 'POST') {
     // console.log('POST url',request.url)
     if(request.url == "/login")
        { //console.log('mySession.id',mySession.id)   ;
          app.postForm(request, function(err,body){
              if(err){console.log(err);return;}
              serverClass.login(function(err,user){
                if (err) {
                  console.log(err);
                  return;
                }
               // console.log('u',user,!user);
                if (!user) {
                  content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: undefined, message: "Укажите правильный email или пароль!", SelForm: 'formlogin', notUser: undefined});
               //   console.log('content',contentType);
                  app.Render(response,content,contentType);

                  return;
                }
                else
                _user = user;
                 request.logIn(user);
                
                //mySession = request.session;
                console.log('login', mySession.data.user, mySession.id);

                if(usersOnline.findIndex(x => x.id==user.id) ===-1)
                {usersOnline.push(JSON.parse(user));}
                console.log('usersOnlinePush',usersOnline)
                //_user= JSON.parse(user) ;
                response.redirect("/");
              },body.email,body.password,mySession.id)
          })
        } else
    if(request.url == "/change")
    {
      app.postForm(request, function(err,body)
      {
        if(err){console.log(err);return;}
      
        serverDB.change(function(err,user,msg){
          //console.log('serverClass.login',user);
          if (err) {
            console.log(err);
            return;
          }

          if (!user) {
              content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: undefined, message: msg, SelForm: 'formchange', notUser: body});
            console.log('content',contentType);
            app.Render(response,content,contentType);
              return;
          }
          else
          {
              content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: user, message: msg, SelForm: 'formchange', notUser: undefined});
            console.log('content',contentType);
            app.Render(response,content,contentType);

          }
        },body.email,body.password,body.password1,body.password2,)

      })
        } else
    if(request.url == "/register")
    {
      app.postForm(request, function(err,body)
      {
        if(err){console.log(err);return;}
      
        serverDB.register(function(err,user,msg){
          //console.log('serverClass.login',user);
          if (err) {
            console.log(err);
            return;
          }

          if (!user) {
              content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: undefined, message: msg, SelForm: 'formregister', notUser: body});
            console.log('content',contentType);
            app.Render(response,content,contentType);
              return;
          }
          else
          {
            console.log('formregisterRender');
              content = ejs.render(fs.readFileSync(filePath, 'utf8'), {filename: 'login',  user: user, message: msg, SelForm: 'formregister', notUser: body});
            console.log('content',contentType);
            app.Render(response,content,contentType);

          }
        },body.email,body.login,body.username,body.password1,body.password2)

      })
        }
  }
  else
 { 

  // const sessionID = app.getCookie('session-id',request.headers.cookie);
  // const cookieToken =  app.getCookie('csrf-token',request.headers.cookie);

//   if (sessionID && cookieToken) 
//   {
//    console.log("GET Сессия и токен найдены !" + filePath );
//  //  res.sendFile('views/form.html', {root: __dirname});
 
//    } else {

 //   if(!filePath.includes('css')) filePath = './views/login.ejs';
         //  console.log("GET Сессия и токен не найдены!" + filePath);
 //  }
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

          //   app.Render(response,content,contentType);
            // console.log('Я тут!!!!GET');
      }
  });
}
}
const onRequest = (req, res) => {
  if (req.url.startsWith('/') || req.url.startsWith('/login') ) {
    res.redirect = function(location)
        {   
          res.writeHead(302,  {Location: location})
          res.end();
        }
        if(!req.cookies)
        {req.cookies = [];}
        //console.log('req.session', req.session);
    handleGreetRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Страница не найдена.');
  }
};
///WebSocket

let cookie_date = new Date().toGMTString(); 
const server =  new WebSocket.Server({
  port,
    verifyClient: (info, done) => {

    done(mySession);

  },

  noServer: false
});

let _idChat = 0;

server.on("connection", function(ws, request) {
//console.log("server.on(connection)");
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
    //console.log('message.sys1',message.sys);
     if (message.sys === "Yes") 
     {
      commands[message.act](function(err, idChat,wsSend) {
      //  console.log('^^^^^^^^^^^^^^',message.act,err);
     // console.log('message.sys',message.act,message, _idChat,ws.user.id);
       if(err){console.log('err',message.act,err);}
        if(idChat) { _idChat = idChat;} else {_idChat=0;}
        if(wsSend) 
         {
          console.log('usersOnlineSend',usersOnline)
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
          console.log('рассылка сообщений пользователям',message, client.user,server.clients.size);
            if ( client.user && (message.online || client.user.id == ws.user.id || message.usersSend.split(',').findIndex(x => x==client.user.id)  !=-1)) 
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
   ///console.log("закрытие сокета!!!!!!!!");
   ws.on("close", function() {
     console.log("закрытие сокета!!!!!!!!!");
    if(ws.user)
    {
      try
      {
        console.log(  'usersOnlineBefore',usersOnline);
       usersOnline.splice( usersOnline.findIndex(x => x.id==ws.user.id), 1 );
       console.log(  'usersOnlineAfter',usersOnline);
       console.log('request.logout()')
      //  serverClass.login(function(err,user){
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //  // response.redirect("/");
      // },ws.user.email,null,null)
       request.logout();
       mySession = null; 
       ws.user = null;
       _user = null;
      }
      catch
      {}
    }
   });

  // if (request.session.passport && ws.user != request.session.passport.user)
console.log('if(_user)ws.user =_user',_user, ws.user)
  if(_user)ws.user =_user ;
    //пользователь зашел
    if (ws.user)
    {
     // ws.user = _user;
     // console.log('sendUser!',ws.user);
      ws.send(
        JSON.stringify({
          cell: "user",
          user: ws.user
        }));
        //добавление пользователя в usersOnline, если его там нет
        if(usersOnline.findIndex(x => x.id==ws.user.id) ===-1)
        {usersOnline.push(ws.user);
          console.log('usersOnlinePushWS',usersOnline)}
    }
    //заполнение таблицы пользователей
    //console.log('ws.user',ws.user);
   // console.log('ws.user.id',ws.user.id);
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