let fs = require("fs");
let pathR = require('path');
let http = require('http');

let resolve = pathR.resolve;
let methods = getBasicNodeMethods();
//let View = require('./src/view');
const { parse } = require('querystring');

let res = Object.create(http.ServerResponse.prototype)



let app={
  paths:
  {  
    "./": "index",
    "./views": "/"
  },
  // settings:
  // {
  
  // },
  // engines: []
  // ,
  init: function() {
    this.cache = {};
    this.engines = {};
    this.settings = {};

    this.defaultConfiguration();
    //this.set('views', resolve('views'));
  
    //this.defaultConfiguration();
    // this._paths=[];
    // for( let path in this.paths ) {
   
    //   let method = this.paths[path];
    //   this._paths.push({
    //     pattern: new RegExp('^' + path.replace(/:\w+/g,'(\\w+)') + '$'),
    //     callback: this[method]
    //   })
    // }
  },
  defaultConfiguration: function defaultConfiguration() {
  //  this.set('view', View);
    console.log('views', resolve('views'), resolve('img'))
    this.set('views', resolve('views'));
  },
  // set: function(setting,val){
  //   this._setting =[];
  //   this._setting.push({
  //     setting: setting,
  //     val: val
  //   })
  // },
  dispatch: function(path,extname) {
       let site='';
          if (path == '/')
       {
         site = './index.html';
       }
       else
      if (fs.existsSync('./views' + path + '.ejs' )) 
       {
        site = './views' + path+ '.ejs';
      } 
      else
      if (fs.existsSync('./views' + path )) 
      {
       site = './views' + path;
     } 
       else
       site = '.'+path;
    return site;
},
set: function set(setting, val) {
  if (arguments.length === 1) {
    // app.get(setting)
    return this.settings[setting];
  }

  //debug('set "%s" to %o', setting, val);

  // set value
  this.settings[setting] = val;

  // // trigger matched settings
  // switch (setting) {
  //   case 'etag':
  //     this.set('etag fn', compileETag(val));
  //     break;
  //   case 'query parser':
  //     this.set('query parser fn', compileQueryParser(val));
  //     break;
  //   case 'trust proxy':
  //     this.set('trust proxy fn', compileTrust(val));

  //     // trust proxy inherit back-compat
  //     Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
  //       configurable: true,
  //       value: false
  //     });

  //     break;
  // }
//console.log('settings',this.settings);
  return this;
},
// render: function render(name, options, callback) {
//   var cache = this.cache;
//   var done = callback;
//   var engines = this.engines;
//   var opts = options;
//   var renderOptions = {};
//   var view;

//   // support callback function as second arg
//   if (typeof options === 'function') {
//     done = options;
//     opts = {};
//   }

//   // merge app.locals
//   merge(renderOptions, this.locals);

//   // merge options._locals
//   if (opts._locals) {
//     merge(renderOptions, opts._locals);
//   }

//   // merge options
//   merge(renderOptions, opts);

//   // set .cache unless explicitly provided
//   if (renderOptions.cache == null) {
//     renderOptions.cache = this.enabled('view cache');
//   }

//   // primed cache
//   if (renderOptions.cache) {
//     view = cache[name];
//   }

//   // view
//   if (!view) {
//     let View = this.get('view');

//     view = new View(name, {
//       defaultEngine: this.get('view engine'),
//       root: this.get('views'),
//       engines: engines
//     });
//     // console.log('view',view,this.get('views'));
//     // return;
//     if (!view.path) {
//       let dirs = Array.isArray(view.root) && view.root.length > 1
//         ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
//         : 'directory "' + view.root + '"'
//       let err = new Error('Failed to lookup view "' + name + '" in views ' + dirs);
//       err.view = view;
//       return done(err);
//     }

//     // prime the cache
//     if (renderOptions.cache) {
//       cache[name] = view;
//     }
//   }

//   // render
//  let req = this.req;
//  let self = res.render;
//  console.log('self',self,res);
//   done = done || function (err, str) {
//    // if (err) return req.next(err);
//    // self.send(str);
//   };
//   //console.log( 'tryRender', 'renderOptions',renderOptions,'done', done);
//   tryRender(view, renderOptions, done);
// }
// ,
// engine: function engine(ext, fn) {
//   if (typeof fn !== 'function') {
//     throw new Error('callback function required');
//   }

//   // get file extension
//   var extension = ext[0] !== '.'
//     ? '.' + ext
//     : ext;

//   // store engine
//   this.engines[extension] = fn;

//   return this;
// },
// dispatchPattern: function(path) {
//      let site='';
//   // количество маршрутов в массиве
//   var i = this._paths.length;
//  //console.log(i);
//   // цикл до конца
//   while( i-- ) {
     
//       // если запрошенный путь соответствует какому-либо
//       // маршруту, смотрим есть ли маршруты
//       var args = path.match(this._paths[i].pattern);
//      // console.log(args,'args.slice(1)',args.slice(1));
//       // если есть аргументы
//       if( args ) {
         
//           // вызываем обработчик из объекта, передавая ему аргументы
//           // args.slice(1) отрезает всю найденную строку
//           site=this._paths[i].callback.apply(this,args.slice(1))
//       }
//   }
//   //console.log('site',site);
//   return site;
// },
// lazyrouter: function lazyrouter() {
//   if (!this._router) {
//     this._router = new Router({
//       caseSensitive: this.enabled('case sensitive routing'),
//       strict: this.enabled('strict routing')
//     });

//     this._router.use(query(this.get('query parser fn')));
//     this._router.use(middleware.init(this));
//   }
// }
//   ,
//     index: function() {
//       console.log('Page '+ './index.html');
//     //  window.location.hash = './index.html';
//       return './index.html';
// },
// enabled: function enabled(setting) {
//   return Boolean(this.set(setting));
// },
postForm: function(request, cb)
{
  //if (request.method === 'POST') {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', () => {
        cb(null,parse(body));
    });}
    else{
      cb(null,null);
    }
 // };  
},
Render: function(response,content,contentType){
  response.writeHead(200, { 'Content-Type': contentType });
  response.end(content, 'utf-8');
},
ejsRenderOld: function(response,filePath,fs,ejs,content,contentType){
  response.writeHead(200, { 'Content-Type': contentType });
  if(filePath.includes('./views'))
    {   
     //  console.log('Я тут!!!');
     response.writeHead(200, { 'Content-Type': contentType });
      let filename =  filePath;       
       let htmlContent = fs.readFileSync(filename, 'utf8');
      let htmlRenderized = ejs.render(htmlContent, {filename: 'login',  user: undefined, message: ' ' , SelForm: 'formlogin', notUser: undefined});
      content =htmlRenderized;
  }
    response.end(content, 'utf-8');
}

}
module.exports = app;
methods.forEach(function(method){
  //console.log('methods',methods)
  app[method] = function(path){
    if (method === 'get' && arguments.length === 1) {
      // app.get(setting)
      //console.log('mypath',path);
      return this.set(path);
    }
//console.log('method',method,arguments);
return;
   this.lazyrouter();

    var route = this._router.route(path);
   // console.log('route',arguments[0],route[method],route);
    route[method].apply(route, slice.call(arguments, 1));
    return this;
  };
});
// function routerMethod(){
//   var handles = flatten(slice.call(arguments));

//   for (var i = 0; i < handles.length; i++) {
//     var handle = handles[i];

//     if (typeof handle !== 'function') {
//       var type = toString.call(handle);
//       var msg = 'Route.' + method + '() requires a callback function but got a ' + type
//       throw new Error(msg);
//     }

//     //debug('%s %o', method, this.path)

//     var layer = Layer('/', {}, handle);
//     layer.method = method;

//     this.methods[method] = true;
//     this.stack.push(layer);
//   }

//   return this;
// } 

// function tryRender(view, options, callback) {
//   try {
//     view.render(options, callback);
//   } catch (err) {
//     callback(err);
//   }
// }
// function merge(a, b){
//   if (a && b) {
//     for (var key in b) {
//       a[key] = b[key];
//     }
//   }
//   return a;
// };
function getBasicNodeMethods() {
  return [
    'get',
    'post',
    'delete'
  ]
  }

// let prevTime;
// function debug() {
//   // disabled?
//   //if (!debug.enabled) return;

//   var self = debug;

//   // set `diff` timestamp
//   var curr = +new Date();
//   var ms = curr - (prevTime || curr);
//   self.diff = ms;
//   self.prev = prevTime;
//   self.curr = curr;
//   prevTime = curr;

//   // turn the `arguments` into a proper Array
//   var args = new Array(arguments.length);
//   for (var i = 0; i < args.length; i++) {
//     args[i] = arguments[i];
//   }

//   args[0] = coerce(args[0]);

//   if ('string' !== typeof args[0]) {
//     // anything else let's inspect with %O
//     args.unshift('%O');
//   }

//   // apply any `formatters` transformations
//   var index = 0;
//   args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
//     // if we encounter an escaped % then don't increase the array index
//     if (match === '%%') return match;
//     index++;
//     var formatter = formatters[format];
//     if ('function' === typeof formatter) {
//       var val = args[index];
//       match = formatter.call(self, val);

//       // now we need to remove `args[index]` since it's inlined in the `format`
//       args.splice(index, 1);
//       index--;
//     }
//     return match;
//   });

//   // apply env-specific formatting (colors, etc.)
//   //exports.formatArgs.call(self, args);

//   var logFn = debug.log || exports.log || console.log.bind(console);
//   logFn.apply(self, args);
// }
// function coerce(val) {
//   if (val instanceof Error) return val.stack || val.message;
//   return val;
// }

// formatters = {};
