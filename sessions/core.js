let http = require('http');
let sessions =  require('./session');

exports.session = function( request, response, callback ){
 
 
  let session; 
   
    // проверяем текущий запрос и определяем, есть ли для него сеанс
    // сеансы определяются путем поиска request.headers ["Set-Cookie"] по хешу наших сеансов
   session = sessions.lookupOrCreate(request,{
     lifetime:604800
   });
// реализуем базовую историю для каждого сеанса, помните об этом, так как это может поглотить память при высокой загрузке

   if(!session.data.history) { session.data.history = []; }
   // if(session.data.history.findIndex(x => x.url==request.url) ===-1)
   session.data.history.push(request.url);

// как правило, мы установим для всех неопознанных пользователей значение «Гость»
  //  if(typeof session.data.user == 'undefined' || session.data.user == ""){
  //   session.data.user = "Guest";
  // }
// устанавливаем заголовок ответа, чтобы установить cookie для текущего сеанса
   // это сделано для того, чтобы клиент мог передавать информацию cookie для последующих запросов
  response.setHeader('Set-Cookie', session.getSetCookieHeaderValue());
// в дополнение к настройке объекта ответа, мы также установим новый
   // свойство по запросу "session", это сделано для того, чтобы мы могли легко
   // ссылаемся на объект сеанса в других местах
  request.session = session;
 
 // запускаем обратный вызов для продолжения цепочки обработки запроса / ответа
  callback( request, response );
  }

  exports.magicSession = function(){

    http.createServer = function (requestListener) {
  
      // Create a new instance of a node HttpServer
      var orig = new http.Server(function(request, response){
  
        exports.session(request, response, function(request, response){
          requestListener(request, response);
        });
      });
  
      // Monkey punch the http server
      let server = Object.create(orig);
 
      server.listen = function (port) { 
        orig.listen(Number(port)); 
      };
  
      return server;
    };  
  
  };