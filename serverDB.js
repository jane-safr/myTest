const sqlite3 = require("sqlite3").verbose();
const path = __dirname + "\\users.db";
module.exports =
{

getUsersSQLite: function(callback,userId) {
  
  let db = new sqlite3.Database(path);
  db.all("select id,login , computer , fio, email,password,2 as nomOrder  from users union all select distinct -id, '','',chat,'','', 1 as nomOrder from chats where id in (select idChat from userInChat where idUser = " + userId +") order by nomOrder, fio ;", function(err, all) {
      callback(err, all);  
  });
  db.close();
}
,
insertUser: function(callback,userDB) {
  console.log('userDB',userDB, callback);
  let db = new sqlite3.Database(path);
  db.run(`INSERT INTO users (email, login, fio, password) values (?, ?, ?, ? )`, [userDB.email, userDB.email.substring(0,userDB.email.indexOf('@')), userDB.fio, userDB.password], function(err) {
    if (err) {
      callback(err, null); 
    }
    userDB.id =this.lastID;
    console.log('this.lastID', this.lastID)
    callback(err, userDB);  
})
db.close();
}
,
insertMessageOld: function(callback,row) {
 
  row = JSON.parse(row);
 
 // console.log('insertMessage',row["idUserFrom"], row.idUserTo, row.dateMessage, row.Message,row.usersSend);
 console.log('row.idChat',row.idChat);
  let db = new sqlite3.Database(path);
  if(row.idChat && row.idChat != 0)
  {

    console.log(`IiiiNSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message, idChat) select ?, idUser, ?, ?,$idChat from userInChat where idChat = $idChat`, [row.idUserFrom,  row.dateMessage, row.Message,$idChat =row.idChat]);
    // db.run(`IiiiNSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message, idChat) select ?, idUser, ?, ?,$idChat from userInChat where idChat = $idChat`, [row.idUserFrom,  row.dateMessage, row.Message,$idChat =row.idChat], function(err) {
  //     db.run(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message, idChat) select ?, idUser, ?, ?,$idChat from userInChat where idChat = $idChat`, [row.idUserFrom,  row.dateMessage, row.Message,$idChat =row.idChat], function(err) {
  //      return callback(err,row);
  //     console.log('!!!!!!!!!!!!!!!',err)
  //     // if (err) {
  //     //   console.log('err1',err)
  //     //   return callback(err, null); 
  //     // }
  //     console.log('this.lastID', this.lastID)
  //      console.log('select idUser from userInChat where idChat = ' + row.idChat);
  //     db.all("select idUser from userInChat where idChat = " + row.idChat +"  ;", function(err, all) {
  //       console.log('insertMessageInChat',err, all)
  //       callback(err, all);  
  //   });
  //     //callback(err, this.lastID);  
  // })
  db.run(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message) select ?, id, ?, ? from users where id in (`+row.usersSend+`)`, [row.idUserFrom, row.dateMessage, row.Message], function(err) {
    if (err) {
      console.log('err1',err)
      callback(err, null); 
    }
    console.log('this.lastIDChatNot', this.lastID)
    callback(err, this.lastID);  
})
  }
  else
  {
    console.log(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message) select ?, id, ?, ? from users where id in (`+row.usersSend+`)`, [row.idUserFrom, row.dateMessage, row.Message]);
      db.run(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message) select ?, id, ?, ? from users where id in (`+row.usersSend+`)`, [row.idUserFrom, row.dateMessage, row.Message], function(err) {
        if (err) {
          console.log('err2',err)
          callback(err, null); 
        }
        console.log('this.lastIDChatNot', this.lastID)
        callback(err, this.lastID);  
    })
  }
db.close();
},
insertMessage: function(callback,row) {
 
  row = JSON.parse(row);
 
 // console.log('insertMessage',row["idUserFrom"], row.idUserTo, row.dateMessage, row.Message,row.usersSend);
 console.log('row.idChat',row.idChat);
  let db = new sqlite3.Database(path);
  if(row.idChat && row.idChat != 0)
  {

    console.log(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message, idChat) select ?, idUser, ?, ?,$idChat from userInChat where id in (`+row.usersSend+`)`, [row.idUserFrom,  row.dateMessage, row.Message,$idChat =row.idChat]);

      db.run(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message, idChat) select ?, id, ?, ?,$idChat from users where id in (`+row.usersSend+`)`, [row.idUserFrom,  row.dateMessage, row.Message,$idChat =row.idChat], function(err) {

    // db.run(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message, idChat) select ?, idUser, ?, ?,$idChat from userInChat where idChat = $idChat`, [row.idUserFrom,  row.dateMessage, row.Message,$idChat =row.idChat], function(err) {        

    //   db.all("select idUser from userInChat where idChat = " + row.idChat +"  ;", function(err, all) {
    //     console.log('insertMessageInChat', all)
    //     callback(err, all);  
    // });
      callback(err, this.lastID);  
  })
  }
  else
  {
    console.log(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message) select ?, id, ?, ? from users where id in (`+row.usersSend+`)`, [row.idUserFrom, row.dateMessage, row.Message]);
      db.run(`INSERT INTO userMessage (idUserFrom, idUserTo, dateMessage, Message) select ?, id, ?, ? from users where id in (`+row.usersSend+`)`, [row.idUserFrom, row.dateMessage, row.Message], function(err) {
        if (err) {
          console.log('err2',err)
          callback(err, null); 
        }
        console.log('this.lastIDChatNot', this.lastID)
        callback(err, this.lastID);  
    })
  }
db.close();
},
insertUserInChat: function(callback,row) {
  row = JSON.parse(row);
  console.log('insertUserInChat', row);

  let db = new sqlite3.Database(path);
////проверка
let chat = row.chat;
//let idChat=-Array.prototype.slice.call(row.usersAddChat).filter(ch =>  ch < 0)[0];
let idChat= row.idChat;
let usersInChat =Array.prototype.slice.call(row.usersAddChat).filter(ch =>  ch > 0).join();

console.log('!idChat',!idChat)
if(!idChat){
    console.log('!idChat1',!idChat)
  db.run(`INSERT  INTO chats ( chat) values (?)`, [ chat], function(err,idChat) {
    console.log('000');
    if (err) {
      console.log('err',err)
      callback(err, null); 
    }
    idChat= this.lastID; 
    console.log('idChat2',idChat,`INSERT OR IGNORE INTO userInChat (idUser, idChat, dateAdd) values (?, ?, ?)`, [ row.idUserFrom,idChat, row.dateAdd]);
    
    db.run(`INSERT OR IGNORE INTO userInChat (idUser, idChat, dateAdd) values (?, ?, ?)`, [ row.idUserFrom,idChat, row.dateAdd], function(err) {
      if (err) {
        callback(err, null); 
      }
      usersInChat=usersInChat+ "," + row.idUserFrom;
      console.log('newChat', this.lastID)
      RefChat(db,idChat,row,usersInChat,callback);
      callback(null, idChat); 
    })
  })
}
else
{
  RefChat(db,idChat,row,usersInChat,callback);
  callback(null, idChat); 
 }

db.close();
},
getUsersInChat: function(callback,idChat) {
  
  let db = new sqlite3.Database(path);
  db.all("select id from users where id in(select idUser from userInChat where idchat = ?);",-idChat, function(err, all) {
      callback(err, all);  
  });
  db.close();
},
getHistory: function(callback,idUser,usersSend,idChat) {
  let strWhere;
  if(idChat && idChat != 0)
    {
      strWhere = " where userMessage.idChat = " + idChat;
     
    }
  else
    {strWhere = "  where  userMessage.idUserFrom in ("+usersSend+") or userMessage.idUserTo in ("+usersSend+") and chats.id is null";}    
  let db = new sqlite3.Database(path);
  strWhere =  "select distinct userMessage.idUserFrom,userMessage.dateMessage,userMessage.Message,userFrom.fio as fioFrom, chats.chat from userMessage inner join users as userFrom on userMessage.idUserFrom =  userFrom.id left outer join chats  on userMessage.idChat = chats.id "+strWhere+";";
  console.log('strWhere',strWhere);
  db.all(strWhere, function(err, all) {
      callback(err, all);  
  });
  db.close();
},
delHistory: function(callback,mesHistory) {
  let strWhere;
  // if(idChat && idChat != 0)
  //   {
  //     strWhere = " where userMessage.idChat = " + idChat;
     
  //   }
  // else
  //   {strWhere = "  where  userMessage.idUserFrom in ("+usersSend+") or userMessage.idUserTo in ("+usersSend+") and chats.id is null";}    
  let db = new sqlite3.Database(path);
  strWhere =  " from userMessage where id in  ("+mesHistory+")";
  console.log('strWhere',strWhere);

  db.run(strWhere, function(err, all) {
    if (err) {
      console.log('err',err)
      callback(err, null); 
    }
      callback(null, this.changes);  
  });
  //db.close();
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
  });
},
getFilterUsers: function(callback,userId,strFilter) {
  
  let db = new sqlite3.Database(path);
  //console.log('strFilter',"select id,login , computer , fio, email,password,2 as nomOrder  from users where fio like '%" + strFilter + "%' union all select distinct -id, '','',chat,'','', 1 as nomOrder from chats where id in (select idChat from userInChat where idUser = " + userId +") order by nomOrder, fio ;",userId,strFilter);
  db.all("select id,login , computer , fio, email,password,2 as nomOrder  from users where fio like '%" + strFilter + "%' union all select distinct -id, '','',chat,'','', 1 as nomOrder from chats where id in (select idChat from userInChat where idUser = " + userId +") order by nomOrder, fio ;", function(err, all) {
      callback(err, all);  
  });
  db.close();
},
login: function( email, password, done){
 // console.log(path);
  let db = new sqlite3.Database(path);
  db.get("SELECT * FROM users WHERE email = ? ", [email],
 function(err, row){
  if(err){
  console.log('err',err);
   return done(err);
  }
  if(!row){
    console.log('Incorrect email '+ email);
   return done(null, false);
  }

  if(row.password!=password)
  { console.log('Incorrect password ' + password);
    return done(null, false);}

  let user= row;
  
  return done(null, user);
  db.close();
 });
},
change: 
function( done, email,password, password1,password2){
  console.log('local-change');
  
  if(password1!=password2)
  {
    msg ='Пароль и подтверждение пароля не совпадают!';
    console.log('msg',msg);
    return done(null, false, msg);
  }
  
  let db = new sqlite3.Database(path);
  db.get("SELECT * FROM users WHERE email = ?  and password = ? ", [email,password],
  function(err, row){
  if(err){
  console.log('err',err);
   return done(err);
  }
  //console.log(row,"SELECT * FROM users WHERE email = ? and password = ? ", [email],[password]);
  
  if(!row){
    msg ='Не правильный email или пароль! '+ email + password + ' '+ password1+ ' '+ password2;
       console.log('msg',msg);
        return done(null, false, msg);
  }
  let user = row;
  db.run(`UPDATE users SET password = ?  where email = ?`, [password1,email], function(err) {
    if (err) {
      return console.log('err.message',err.message);
    }
    msg ='Пароль изменен! ';
    console.log('msg',msg);
    return done(null, user,msg);
  })
  });
   db.close();
    },
register: 
function(done,email,login,username,password1,password2)
{
  let db = new sqlite3.Database(path);
  db.get("SELECT * FROM users WHERE email = ? ", [email],
 function(err, row){
  if(err){
  console.log('err',err);
   return done(err);
  }  else
// if(1==2)
//let msg;
  if(row){
    msg ='Пользователь с таким  e-mail уже существует!'+ email;
       console.log('msg',msg);
        return done(null, false, msg);
  } else
  if(password1!=password2)
  {
    msg ='Пароль и подтверждение пароля не совпадают!';
    console.log('msg',msg);
    return done(null, false, msg);
  } else
  if(req.body.email.indexOf('@')==-1)
  {
    msg ='Неправильно заведен e-mail!';
    console.log('msg',msg);
    return done(null, false, msg);
  } else
  {
    userDB = new Usr(
      -1,
      login,
      username,
      '',
      email,
      password1
    );
    serverDB.insertUser(function(err,UserDB ) {
      return done(null, userDB);
    },userDB);
        
  }
});
}
}


function RefChat(db,idChat,row,usersInChat,callback)
{
  db.run(`INSERT OR IGNORE INTO userInChat (idUser, idChat, dateAdd) select id,$idChat,$date from users where id in(`+usersInChat+`) and not id in (select idUser from  userInChat where idChat = $idChat);`, [$idChat= idChat, $date =row.dateAdd], function(err) {
    if (err) {
      console.log(err);
     callback(err, null); 
    }
    console.log('this.lastID', this.lastID)
  });
  db.run(`DELETE from userInChat where idChat = $idChat and idUser in (select idUser from userInChat where idChat = $idChat and not idUser in (`+usersInChat+`));`, [$idChat= idChat], function(err) {
    if (err) {
      console.log(err);
      callback(err, null); 
    }
   // console.log('this.lastID', this.lastID)
  });
}


