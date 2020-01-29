const WebSocket = require("ws");
let ejs = require('ejs');
let fs = require('fs');
// Importing http module to create a server.
//const http = require('http');
const url = require('url');
var path = require('path');

// Host for our server.
const HOST = 'localhost';

// Port at which our server will run/listen.
const port = 4000;

// // Creating a server with handler.
// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello Stranger!!');
// });

// Request handler for /greet end point.
const handleGreetRequest = (req, res) => {

///////////////////////
const mimetypes = {
  'html': 'text/html',
  'css': 'text/css',
  'js': 'text/javascript',
  'png': 'image/png',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpg',
  'ejs': 'text/html'
};

var myuri = url.parse(req.url).pathname;
var filename = path.join(process.cwd(), unescape(myuri));

console.log('req.url',req.url);
var filePath = '.' + req.url;
if (filePath == './login') {
  filename = './views/login.ejs';
    console.log(filePath );
}
console.log('File you are looking for is:' + filename);
var loadFile;

try {
  console.log('Log1');
    loadFile = fs.lstatSync(filename);
} catch (error) {
  console.log(error);
    res.writeHead(404, {
        "Content-Type": 'text/plain'
    });
    res.write('404 Internal Error1');
    res.end();
    return;
}
//console.log(loadFile);
//return;
///////////////////////

  const { method, url: reqUrl } = req;
  console.log({ method, url: reqUrl },req.method,req.url);
  const urlParts = url.parse(reqUrl, true);
  if (method === 'POST') {
    let body = [];
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body);
        res.end(body);
      });
    // const { query: queryParams } = urlParts;
    // res.end(`Hello ${queryParams.name || 'Stranger'}!!!`);
  } else 
  if (method === 'GET') {
    console.log('GET:' + filename);
    // const { query: queryParams } = urlParts;
    // res.end(`Hello ${queryParams.name || 'Stranger'}!!!`);
   // res.render(__dirname +"login.ejs", { user: req.user, message: ' ' , SelForm: 'formlogin', notUser: undefined});

  //let htmlContent = fs.readFileSync(__dirname + '/views/login.ejs', 'utf8');

// let htmlRenderized = ejs.render(htmlContent, {filename: 'login.ejs',  user: undefined, message: ' ' , SelForm: 'formlogin', notUser: undefined});

// console.log('req.url',req.url);
// var filePath = '.' + req.url;
// if (filePath == './login') {
//     filePath = './views/logon/ejs';
// }
let htmlContent = fs.readFileSync(filename, 'utf8');

let htmlRenderized = ejs.render(htmlContent, {filename: 'login',  user: undefined, message: ' ' , SelForm: 'formlogin', notUser: undefined});

//let htmlContentCSS = fs.readFileSync(__dirname + '/views/login.css', 'utf8');

//let htmlRenderizedCSS = ejs.render(htmlContentCSS, {filename: 'login.css'});
res.end(htmlRenderized);


//res.end(htmlRenderizedCSS);
//console.log(htmlRenderizedCSS);
  } else {
    res.statusCode = 404;
    res.end('Not found1.');
  }
};

// Generic request handler.
const onRequest = (req, res) => {
  if (req.url.startsWith('/greet') || req.url.startsWith('/echo') || req.url.startsWith('/login')  || req.url.startsWith('/views')) {
    handleGreetRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not found2.');
  }
};

// Creating a server with handler.
//const server = http.createServer(onRequest);

//const serverHttp = require("http").createServer(server);
const serverHttp = require("http").createServer(onRequest);


// // Setup server at PORT.
// server.listen(PORT, HOST, () => {
//   console.log(`Server is running at http://${HOST}:${PORT}`);
// });

// serverHttp.on("upgrade", function(request, socket, head) {
//   console.log("Parsing session from request...");

//   sessionParser(request, {}, () => {
//     if (!request.session.passport.user) {
//       socket.destroy();
//       return;
//     }

//     console.log("Session is parsed!");

//     server.handleUpgrade(request, socket, head, function(ws) {
//       server.emit("connection", ws, request);
//     });
//   });
// });
const server = new WebSocket.Server({
  port,
  verifyClient: (info, done) => {
    sessionParser(info.req, {}, () => {
      done(info.req.session);
    });
  },
  noServer: false
});

serverHttp.listen(8100, function() {
  console.log(`Listening on http://${HOST}:8100`);
});

//  serverHttp.listen(8090, function() {
//   console.log("Listening on http://localhost:8090");
// });