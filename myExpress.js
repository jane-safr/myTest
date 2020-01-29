let fs = require("fs");

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
  set: function(setting,val){
    this._setting =[];
    this._setting.push({
      setting: setting,
      val: val
    })
  },
  dispatch: function(path,extname) {
       let site='';
      //  let extname = String(path.extname(path)).toLowerCase();
      // console.log('fs.existsSync',fs.existsSync('./views' + path + '.ejs', 'extname',extname));
       if (path == '/')
       {
         site = './index.html';
       }
      //  else
      //  if (!fs.existsSync(path))
      //     { 
      //       //view engine
      //       //  if(this._setting.findIndex(x => x.val==extname) !=-1 || extname == '' ){
      //         // if(this._setting['']  ){
      //         // this._setting.match(this._paths[i].pattern)
              
      //         if(this._setting.findIndex(x => x.setting=='view engine') !=-1  ){
      //           console.log(this._setting,this._setting[this._setting.findIndex(x => x.setting=='view engine')].val);
      //           }
      //     }
                else
       if (fs.existsSync('./views' + path + '.ejs' || fs.existsSync('./views' + path + '.css'))) {
        site = './views' + path;
        // It exists
      } 
              // fs.promises.access(path)
              // .then(() => {
              //   // It exists
              // })
              // .catch(() => {
              //   // It doesn't exist
              // })
      //  if (path == '/login')
      //  {
      //   site = './views' + path + '.ejs'
      //  }
      //  else       
      //  if (path == '/login.css')
      //  {
      //   site = './views' + path 
      //  }
       else
       site = '.'+path;
      // console.log('settings',this.settings);
    return site;
},
setApp: function set(setting, val) {
  if (arguments.length === 1) {
    // app.get(setting)
    return this.settings[setting];
  }

  debug('set "%s" to %o', setting, val);

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
console.log('settings',this.settings);
  return this;
},
engine: function engine(ext, fn) {
  if (typeof fn !== 'function') {
    throw new Error('callback function required');
  }

  // get file extension
  var extension = ext[0] !== '.'
    ? '.' + ext
    : ext;

  // store engine
  this.engines[extension] = fn;

  return this;
},
dispatchPattern: function(path) {
     let site='';
  // количество маршрутов в массиве
  var i = this._paths.length;
 //console.log(i);
  // цикл до конца
  while( i-- ) {
     
      // если запрошенный путь соответствует какому-либо
      // маршруту, смотрим есть ли маршруты
      var args = path.match(this._paths[i].pattern);
     // console.log(args,'args.slice(1)',args.slice(1));
      // если есть аргументы
      if( args ) {
         
          // вызываем обработчик из объекта, передавая ему аргументы
          // args.slice(1) отрезает всю найденную строку
          site=this._paths[i].callback.apply(this,args.slice(1))
      }
  }
  //console.log('site',site);
  return site;
}
  ,
    index: function() {
      console.log('Page '+ './index.html');
    //  window.location.hash = './index.html';
      return './index.html';
}

}
module.exports = app;

let prevTime;
function debug() {
  // disabled?
  //if (!debug.enabled) return;

  var self = debug;

  // set `diff` timestamp
  var curr = +new Date();
  var ms = curr - (prevTime || curr);
  self.diff = ms;
  self.prev = prevTime;
  self.curr = curr;
  prevTime = curr;

  // turn the `arguments` into a proper Array
  var args = new Array(arguments.length);
  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }

  args[0] = coerce(args[0]);

  if ('string' !== typeof args[0]) {
    // anything else let's inspect with %O
    args.unshift('%O');
  }

  // apply any `formatters` transformations
  var index = 0;
  args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
    // if we encounter an escaped % then don't increase the array index
    if (match === '%%') return match;
    index++;
    var formatter = formatters[format];
    if ('function' === typeof formatter) {
      var val = args[index];
      match = formatter.call(self, val);

      // now we need to remove `args[index]` since it's inlined in the `format`
      args.splice(index, 1);
      index--;
    }
    return match;
  });

  // apply env-specific formatting (colors, etc.)
  //exports.formatArgs.call(self, args);

  var logFn = debug.log || exports.log || console.log.bind(console);
  logFn.apply(self, args);
}
function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

formatters = {};
