//filesystem
const fs = require('fs');
//filesystem---
//mysql
const mysql = require('mysql');
//mysql---
//mail
const nodemailer = require('nodemailer');
//mail---
//cryptoJS---
const cryptoJS = require("crypto-js");
//cryptoJS---

// //http connect ------------------
// const express = require('express');
// var app = express();
// const http = require('http');
// var server = http.createServer(app);
// const io = require('socket.io').listen(server);
//
// var port = 80;
// server.listen(port);
// //end http connect --------------

//https connect ------------------
const server = require('https');
const express = require('express');
const app = express();

const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/gmer.io/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/gmer.io/privkey.pem')
};
//express.listen(80);
var port = 443;
var serverIO = server.createServer(options, app);
serverIO.listen(port);

//redirect to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

var io = require('socket.io').listen(serverIO);
//end https connect --------------

var myip = 'n/a';
app.get('*', function(request, respons, next) {
  myip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || (request.connection.socket ? request.connection.socket.remoteAddress : null);
  next();
});
app.get('/', function(request, respons) {
  respons.sendFile(__dirname+'/games/cannons/index.html');
});
app.get('/resource/*', function(request, respons) {
  urlRequest = request.originalUrl;
  var url = request.originalUrl.split("?")[0];
  url = url.split("/");
  if (fs.existsSync(__dirname+url.join('/'))) {
    respons.sendFile(__dirname+url.join('/'));
  } else {
    respons.status(404).send();
  }
});
app.get('/query*', function(request, respons) {
  urlRequest = request.originalUrl;
  var url = request.originalUrl.split("?")[0];
  url = url.split("/");
  if (url[2] == 'query') {
    if (url.length == 2) {
      respons.sendFile(__dirname+'/pages/query.html');
    } else if (url.length > 2) {
      respons.status(404).send();
    }
  } else {
    respons.status(404).send();
  }
});
app.get('/g/*', function(request, respons) {
  urlRequest = request.originalUrl;
  var url = request.originalUrl.split("?")[0];
  url = url.split("/");
  if (url.length == 3) {
    if (fs.existsSync(__dirname+'/games/'+url[2]+'/index.html')) {
      respons.sendFile(__dirname+'/games/'+url[2]+'/index.html');
    } else {
      respons.status(404).send();
    }
  } else if (url.length > 3) {
    var flagExistPage = false;
    for (var i = url.length; i > 3; i--) {
      var relativeURL = "";
      for (var j = 3; j < i; j++) {
        relativeURL += "/"+url[j];
      }
      if (fs.existsSync(__dirname+'/games/'+url[2]+'/pages'+relativeURL+'.html')) {
        respons.sendFile(__dirname+'/games/'+url[2]+'/pages'+relativeURL+'.html');
        flagExistPage = true;
        break;
      }
    }

    if (!flagExistPage) {
      var relativeURL = "";
      for (var i = 3; i < url.length; i++) {
        relativeURL += "/"+url[i];
      }
      if (fs.existsSync(__dirname+'/games/'+url[2]+relativeURL)) {
        respons.sendFile(__dirname+'/games/'+url[2]+relativeURL);
      } else {
        respons.status(404).send();
      }
    }
  }
});
app.get('/u*', function(request, respons) {
  urlRequest = request.originalUrl;
  var url = request.originalUrl.split("?")[0];
  url = url.split("/");
  if (url[1] == 'u') {
    if (url.length == 2) {
      respons.sendFile(__dirname+'/users/index.html');
    } else if (url.length == 3) {
      respons.sendFile(__dirname+'/users/user.html');
    } else if (url.length > 3) {
      if (url[2] == 'document' && url[3] == 'terms') {
        respons.sendFile(__dirname+'/users/documents/terms.html');
      } else if (url[2] == 'document' && url[3] == 'privacy') {
        respons.sendFile(__dirname+'/users/documents/privacy.html');
      } else {
        respons.status(404).send();
      }
    }
  } else {
    respons.status(404).send();
  }
});
app.get('/s*', function(request, respons) {
  urlRequest = request.originalUrl;
  var url = request.originalUrl.split("?")[0];
  url = url.split("/");
  if (url[1] == 's') {
    if (url.length == 2) {
      respons.sendFile(__dirname+'/studios/index.html');
    } else if (url.length > 2) {
      respons.status(404).send();
    }
  } else {
    respons.status(404).send();
  }
});

// app.use('/img', express.static('img'));
// app.use('/resource', express.static('resource'));
// app.use('/request', express.static('pages/request.html'));
// app.use('/stats/:id', express.static('pages/stats.html'));
// app.use('/design', express.static('pages/design.html'));
app.use('/', function (req, res, next) {
  res.redirect('/');
});


//start code fortress ----------------
//crypt
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);
const key = new Buffer([0x36, 0x1e, 0x5f, 0xc8, 0x64, 0x10, 0xe4, 0x0b, 0x33, 0x9a, 0x60, 0x0e, 0xbf, 0x8e, 0xc0, 0xa8, 0xc1, 0x41, 0xfc, 0x80, 0x51, 0x14, 0x18, 0xa9, 0x3b, 0x21, 0x2c, 0x01, 0x4a, 0xe6, 0x41, 0xa6]);
const iv = new Buffer([0xbc, 0xc4, 0xca, 0xc2, 0x5a, 0xf0, 0xa7, 0x65, 0xdd, 0xc7, 0x4d, 0x4c, 0x40, 0x6a, 0x29, 0x1f]);
function encrypt(text) {
 let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 // return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 return iv.toString('hex')+"~~"+encrypted.toString('hex');
}
function decrypt(hash) {
 var ivv = hash.split("~~")[0];
 var data = hash.split("~~")[1];
 let iv = Buffer.from(ivv, 'hex');
 let encryptedText = Buffer.from(data, 'hex');
 let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}
//crypt---

var rooms = {};
var players = {};

function getRandomInt(max) {
  return Math.floor(Math.random()*Math.floor(max));
}

function getID(length) {
  var letters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-+";
  var answer = "";
  for (var i = 0; i < length; i++) {
    answer += letters[getRandomInt(64)];
  }
  return answer;
}

var encryptHolder = function(data) {
  var keyHolder = getID(10);
  var cryptHolder = keyHolder+'!!!!!1'+cryptoJS.AES.encrypt(JSON.stringify(data), keyHolder).toString();
  return cryptHolder;
};

var decryptHolder = function(data) {
  var bytesCryptHolder  = cryptoJS.AES.decrypt(data.split("!!!!!1")[1], data.split("!!!!!1")[0]);
  var decryptedHolder = JSON.parse(bytesCryptHolder.toString(cryptoJS.enc.Utf8));
  return decryptedHolder;
};

function createRoom(idPlayer) {
  var id = getID(10);
  while (rooms[id]) {
    id = getID(10);
  }
  rooms[id] = {player1: idPlayer, player2: 0}
  players[idPlayer].status = 2;

  io.to(idPlayer).emit('sendIdRoom', id);

  console.log("");
  console.log("create room: "+id);
  console.log("");
}

function startRoom(idRoom) {
  players[rooms[idRoom].player1].status = 3;
  players[rooms[idRoom].player2].status = 3;
  players[rooms[idRoom].player1].side = 1;
  players[rooms[idRoom].player2].side = 2;

  var data = {me: players[rooms[idRoom].player1], enemy: players[rooms[idRoom].player2], room: idRoom}
  io.to(rooms[idRoom].player1).emit('sendNewData', data);
  data = {me: players[rooms[idRoom].player2], enemy: players[rooms[idRoom].player1], room: idRoom}
  io.to(rooms[idRoom].player2).emit('sendNewData', data);

  console.log("");
  console.log("start room: "+idRoom);
  console.log("");
}

function abortRoom(idRoom) {
  delete rooms[idRoom];
  console.log("");
  console.log("delete room: "+idRoom);
  console.log("");
}

function exitToMenu(idPlayer) {
  players[idPlayer] = {};
  players[idPlayer].status = 0;
  var data = {};
  data.me = players[idPlayer];
  data.enemy = {}
  io.to(idPlayer).emit('sendNewData', data);
}

//search rooms
setInterval(function() {
  for (var i in players) {
    if (players[i].status == 1) {
      var flagFreeRoom = false;
      for (var j in rooms) {
        if (rooms[j].player1 == 0) {
          rooms[j].player1 = i;
          players[i].status = 2;
          flagFreeRoom = true;
          startRoom(j);
        } else if (rooms[j].player2 == 0) {
          rooms[j].player2 = i;
          players[i].status = 2;
          flagFreeRoom = true;
          startRoom(j);
        }
      }
      if (!flagFreeRoom) {
        createRoom(i);
      }
    }
  }
}, 3000);
//end code fortress ----------------


//start code stealth ----------------
var playersS = [];
var roomsS = [];

function getRandomS(min, max) {
	return Math.random() * (max - min) + min;
}

function addObjectsS(idRoom, arrObj) {
	for (var i = 0; i < arrObj.length; i++) {
		roomsS[idRoom].objects[arrObj[i].id] = arrObj[i];
	}

	for (var i = 0; i < roomsS[idRoom].players.length; i++) {
		io.to(roomsS[idRoom].players[i]).emit('addObjectsS', arrObj);
	}
}

function removeFromArrayByDataS(arr, data) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == data) {
			arr.splice(i, 1);
			break;
		}
	}
}

function createRoomS(idCreator) {
	roomsS[idCreator] = {
		id: idCreator,
		status: 'searchingPlayers',
		players: [],
		objects: [],
    timestart: Date.now()
	};
}

//check botS
var timeWaitingS = 5;
setInterval(function() {
  for (i in roomsS) {
    if (roomsS[i] && roomsS[i].status == 'searchingPlayers' && (Date.now()-roomsS[i].timestart)/1000 > timeWaitingS) {
      var length = roomsS[i].players.length;
      for (var j = length; j < maxSizeRoomS; j++) {
        roomsS[i].players[j] = 'bot'+(j-length+1);
      }
      startRoomS(i);
    }
  }
}, 5000);

function generateMapS(idRoom) {
	var layout = Math.round(getRandomS(1,8));
	//var layout = 2;

	var objectsMap = require('./games/stealth/resource/js/objectsMap.js');

	for (var i = 0; i < roomsS[idRoom].players.length; i++) {
		io.to(roomsS[idRoom].players[i]).emit('takeLayoutS', layout);
	}

	addObjectsS(idRoom, objectsMap.getHall(roomsS[idRoom].objects.length));
	addObjectsS(idRoom, objectsMap.getRestaurant(roomsS[idRoom].objects.length));
	addObjectsS(idRoom, objectsMap.getRooms(roomsS[idRoom].objects.length));
	addObjectsS(idRoom, objectsMap.getSecurity(roomsS[idRoom].objects.length));
}

function startRoomS(idRoom) {
	console.log('start rooom '+idRoom);
	roomsS[idRoom].status = 'playing';

  roomsS[idRoom].alives = roomsS[idRoom].players.length;
  roomsS[idRoom].finishData = [];

  var flagBot = false;
	for (var i = 0; i < roomsS[idRoom].players.length; i++) {
    var currPlayer = roomsS[idRoom].players[i];
    if (currPlayer.length > 6) {//the socket id very long, cause if length stoke more then 6 it means this is socket
      io.to(roomsS[idRoom].players[i]).emit('startRoomS', roomsS[idRoom].players.length);
    } else if (currPlayer.substr(0, 3) == 'bot') {
      addObjectsS(idRoom, [{
        id: roomsS[idRoom].objects.length,
        tag: 'player',
        coord: {x: 0, y: 0},
        speed: {x: 0, y: 0},
        name: '',
        bot: true
      }]);
      flagBot = true;
    }
	}
  if (flagBot) {
    for (var i = 0; i < roomsS[idRoom].players.length; i++) {
      var currPlayer = roomsS[idRoom].players[i];
      if (currPlayer.substr(0, 3) != 'bot') {
        roomsS[idRoom].controlerBot = roomsS[idRoom].players[0];
        io.to(roomsS[idRoom].players[0]).emit('makeBotControler');
        break;
      }
    }
  }

	generateMapS(idRoom);

}

var checkFinishRoom = function(room) {
  // console.log(room.status);
  //console.log(room.alives);
  if (room.status == 'playing' && room.alives < 2) {
    room.status = 'finished';
    for (var i = 0; i < room.players.length; i++) {
      if (room.players[i].substr(0, 3) != 'bot' && room.players[i].length > 6) {
        io.to(room.players[i]).emit('takeFinishDataS');
      }
  	}
    // for (var i = 0; i < room.players.length; i++) {
  	// 	io.to(room.players[i]).emit('finishGameS');
  	// }
  }
};

var maxSizeRoomS = 4;
function addPlayerToRoomS(idPlayer) {
	var flag = true;
	for (i in roomsS) {
		if (roomsS[i].status == 'searchingPlayers') {
			roomsS[i].players[roomsS[i].players.length] = idPlayer;
			playersS[idPlayer].idRoom = i;
			flag = false;
			if (roomsS[i].players.length == maxSizeRoomS) {
				startRoomS(i);
			}
			break;
		}
	}
	if (flag) {
		createRoomS(idPlayer);
		roomsS[idPlayer].players[roomsS[idPlayer].players.length] = idPlayer;
		playersS[idPlayer].idRoom = idPlayer;
	}
}

function removePlayerFromRoomS(idPlayer) {
	if (playersS[idPlayer].idRoom) {
		var idRoom = playersS[idPlayer].idRoom;
		if (roomsS[idRoom] && roomsS[idRoom].players.length > 1) {
			removeFromArrayByDataS(roomsS[idRoom].players, idPlayer);

			for (var i = 0; i < roomsS[idRoom].players.length; i++) {
				io.to(roomsS[idRoom].players[i]).emit('removePlayerS', playersS[idPlayer].idObj);
			}
			delete roomsS[idRoom].objects[playersS[idPlayer]];
      roomsS[idRoom].alives--;
      checkFinishRoom(roomsS[idRoom]);

      if (idPlayer == roomsS[idRoom].controlerBot) {
        for (var i = 0; i < roomsS[idRoom].players.length; i++) {
          var currPlayer = roomsS[idRoom].players[i];
          if (currPlayer.substr(0, 3) != 'bot') {
            roomsS[idRoom].controlerBot = roomsS[idRoom].players[0];
            io.to(roomsS[idRoom].players[0]).emit('makeBotControler');
            break;
          }
        }
      }

			// if (roomsS[idRoom].players.length == 1) {
			// 	//io.to(roomsS[idRoom].players[0]).emit('exitToHomeS');
			// 	playersS[roomsS[idRoom].players[0]].idRoom = '';
			// 	playersS[roomsS[idRoom].players[0]].status = 'home';
			// 	playersS[roomsS[idRoom].players[0]].idObj = '';
			// 	delete roomsS[idRoom];
			// }
		} else if (roomsS[idRoom] && roomsS[idRoom].players.length < 2) {
      playersS[roomsS[idRoom].players[0]].idRoom = '';
      playersS[roomsS[idRoom].players[0]].status = 'home';
      playersS[roomsS[idRoom].players[0]].idObj = '';
      delete roomsS[idRoom];
    }
	}
}

//synchronize
setInterval(function() {
	for (i in roomsS) {
		if (roomsS[i].players && roomsS[i].status == 'playing') {
			for (var j = 0; j < roomsS[i].players.length; j++) {
				io.to(roomsS[i].players[j]).emit('updateCoordS');
			}
		}
	}
}, 5000);
//end code stealth ----------------



io.sockets.on('connection', function(socket) {


  //start code fortress into socket ----------------
  socket.on('updateMe', function(player) {
    players[socket.id] = player;

		//search room player
		if (player.status == 0) {
			for (i in rooms) {
				if (rooms[i].player1 == socket.id || rooms[i].player2 == socket.id ) {
					abortRoom(i);
				}
			}
		}
  });

	socket.on('shoot', function(bullet, sideSource, idRoom) {
		if (rooms[idRoom]) {
			if (sideSource == 1) {
				io.to(rooms[idRoom].player2).emit('sendShoot', bullet);
			} else if (sideSource == 2) {
				io.to(rooms[idRoom].player1).emit('sendShoot', bullet);
			}
		}
  });

  socket.on('changeAngle', function(cannon, sideSource, idRoom) {
		if (rooms[idRoom]) {
			if (sideSource == 1) {
				io.to(rooms[idRoom].player2).emit('sendChangeAngle', cannon);
			} else if (sideSource == 2) {
				io.to(rooms[idRoom].player1).emit('sendChangeAngle', cannon);
			}
		}
  });

	socket.on('imready', function(idRoom, sideSource, sign) {
		if (rooms[idRoom]) {
			if (sideSource == 1) {
				io.to(rooms[idRoom].player2).emit('sendReady', sign);
			} else if (sideSource == 2) {
				io.to(rooms[idRoom].player1).emit('sendReady', sign);
			}
		}
  });

	socket.on('startGame', function(idRoom) {
		if (rooms[idRoom]) {
			io.to(rooms[idRoom].player1).emit('sendStartGame');
			io.to(rooms[idRoom].player2).emit('sendStartGame');
		}
  });

	socket.on('showMyBuilding', function(idRoom, sideSource, obj) {
		if (rooms[idRoom]) {
			if (sideSource == 1) {
				io.to(rooms[idRoom].player2).emit('sendBuildingEnemy', obj);
			} else if (sideSource == 2) {
				io.to(rooms[idRoom].player1).emit('sendBuildingEnemy', obj);
			}
		}
  });

	socket.on('changeTurn', function(idRoom) {
		if (rooms[idRoom]) {
			io.to(rooms[idRoom].player1).emit('sendChangeTurn');
			io.to(rooms[idRoom].player2).emit('sendChangeTurn');
		}
  });

	socket.on('finishGame', function(idRoom, data) {
		if (rooms[idRoom]) {
			io.to(rooms[idRoom].player1).emit('sendWinner', data);
			io.to(rooms[idRoom].player2).emit('sendWinner', data);
			abortRoom(idRoom);
		}
  });

	socket.on('exitToMenu', function() {
			exitToMenu(socket.id);
  });

	socket.on('startRoomBot', function(idRoom) {
		var bot = {status: 3, bot: true};
		players[socket.id].status = 3;
		players[socket.id].side = getRandomInt(2)+1;
		if (players[socket.id].side == 1) {
			bot.side = 2;
		} else if (players[socket.id].side == 2) {
			bot.side = 1;
		}

		var data = {me: players[socket.id], enemy: bot, room: idRoom}
		io.to(socket.id).emit('sendNewData', data);

		console.log("");
		console.log("start bot room: "+idRoom);
		console.log("");
  });

  socket.on('getOnline', function() {
    var length = Object.keys(players).length;
		io.to(socket.id).emit('sendOnline', length);
  });

  socket.on('getEmail', function(email) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM users", function (err, result, fields) {
        //if (err) throw err;
        var flag = true;
        for (i in result) {
          if (result[i].email == email) {
            io.to(socket.id).emit('sendServerSignEmail', true, result[i].confirm, result[i].email);
            flag = false;
            break;
          }
        }
        if (flag) {
          io.to(socket.id).emit('sendServerSignEmail', false, false, email);
        }
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('addQuery', function(link) {
		var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      connection.query("INSERT INTO queries (link, dateAdd) VALUES ('"+link+"', NOW())", function (err) {
        if (err) {
          io.to(socket.id).emit('sendAnswer2Signup', false, "Something goes wrong with database. Try sign up again.");
        } else {
          io.to(socket.id).emit('addedQuery');
        }
      });
    });
    setTimeout(function() {
        connection.end();
    }, 1500);
  });

  socket.on('mailSign', function(mail, recaptcha) {
    var flagRecaptcha = true;
    var flagRecaptcha = false;
    var secretRecaptcha = "6Ld-_NEUAAAAALkRGwYLKttHeWZ51FkZHafMhGXS";
    server.get('https://www.google.com'+'/recaptcha/api/siteverify?secret='+secretRecaptcha+'&response='+recaptcha, (res) => {
      res.on('data', (d) => {
        //process.stdout.write(d);
        var answer = JSON.parse(''+d);
        flagRecaptcha = answer.success;

        if (flagRecaptcha) {
          var connection = mysql.createConnection({
            host: "vh50.timeweb.ru",
            user: "totarget_gmerio",
            password: "Jc3FiReQ",
            database: "totarget_gmerio"
          });
      		connection.connect(function(err) {
      			connection.query("SELECT id FROM users WHERE email='"+mail+"'", function (err, result, fields) {
              if (result[0]) {
                io.to(socket.id).emit('mailSign2', 'ok:signin');
              } else {
                io.to(socket.id).emit('mailSign2', 'ok:signup');
              }
            });
      			setTimeout(function() {
      					connection.end();
      			}, 1500);
      		});
        } else if (!flagRecaptcha) {
          io.to(socket.id).emit('mailSign2', 'err:recaptcha invalid');
        }

      });
    }).on('error', (e) => {});
  });

  socket.on('mailSign3', function(mail, condition, holder) {
    var pstTime = new Date(Date.now()+new Date().getTimezoneOffset()*60*1000+(-7*60*60*1000));
    var mounths = pstTime.getMonth()+1;
    if (mounths < 10) { mounths = '0'+mounths; }
    var days = pstTime.getDate();
    if (days < 10) { days = '0'+days; }
    var hours = pstTime.getHours();
    if (hours < 10) { hours = '0'+hours; }
    var minutes = pstTime.getMinutes();
    if (minutes < 10) { minutes = '0'+minutes; }
    var seconds = pstTime.getSeconds();
    if (seconds < 10) { seconds = '0'+seconds; }
    pstTime = pstTime.getFullYear()+'-'+mounths+'-'+days+' '+hours+':'+minutes+':'+seconds;
    holder.ip = myip;
    holder.pst = pstTime;

    var hash = encryptHolder(holder);

    var linkHost = 'https://gmer.io';
    //var linkHost = 'http://localhost';
    var key = getID(5);
    var link = "/query";
    link += "?";
    link += "action="+condition;
    link += "&";
    link += "mail="+mail;
    link += "&";
    link += "holder="+hash;
    link += "&";
    link += "key="+key;

    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });
    connection.connect(function(err) {
      connection.query("INSERT INTO queries (link, dateAdd) VALUES ('"+link+"', '"+pstTime+"')", function (err) {
        if (err) {
          io.to(socket.id).emit('mailSign4', 'err:something goes wrong in the database');
        } else {
          var transporter = nodemailer.createTransport({
            host: "smtp.timeweb.ru",
            port: 2525,
            secure: false,
            auth: {
              user: 'admin@gmer.io',
              pass: 'XPgfR7A8'
            }
          });
          if (condition == "signup") {
  					themeMail = "gmer.io sign up";
  					fs.readFile('code/mail/register.html', {encoding: 'utf-8'}, function(err, data) {
  						textMail = data;
  						textMail = textMail.replace('~~LINK~~', linkHost+link).replace('~~LINK~~', linkHost+link);
  						var mailOptions = {
  						  from: 'admin@gmer.io',
  						  to: mail,
  						  subject: themeMail,
  						  html: textMail
  						};
  						transporter.sendMail(mailOptions, function(error, info) {
  						  if (error) {
                  io.to(socket.id).emit('mailSign4', 'err:something goes wrong in the sending mail, please check, is your email exist?');
  						  } else {
                  io.to(socket.id).emit('mailSign4', 'ok:mail has been sent to <b>'+mail+'</b> , check your email to continue sing up');
  							}
  						});
  					});
  				} else if (condition == "signin") {
  					themeMail = "gmer.io sign in";
  					fs.readFile('code/mail/enter.html', {encoding: 'utf-8'}, function(err, data) {
  						textMail = data;
  						textMail = textMail.replace('~~LINK~~', linkHost+link).replace('~~LINK~~', linkHost+link);
  						var mailOptions = {
  						  from: 'admin@gmer.io',
  						  to: mail,
  						  subject: themeMail,
  						  html: textMail
  						};
  						transporter.sendMail(mailOptions, function(error, info) {
  							if (error) {
  								io.to(socket.id).emit('mailSign4', 'err:something goes wrong in the sending mail, please check, is your email exist?');
  						  } else {
  								io.to(socket.id).emit('mailSign4', 'ok:mail has been sent to <b>'+mail+'</b> , check your email to continue sing in');
  							}
  						});
  					});
  				}
        }
      });
      setTimeout(function() {
          connection.end();
      }, 1500);
    });
  });

	socket.on('sendMail', function(type, email) {
		var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

		connection.connect(function(err) {
      //if (err) throw err;
			var link = "https://gmer.io/g/cannons/request";
			var key = getID(20);

			link += "?";
			link += "type="+type;
			link += "&";
			link += "mail="+email;
			link += "&";
			link += "key="+key;

			connection.query("INSERT INTO queries (link, dateAdd) VALUES ('"+link+"', NOW())", function (err) {
        //if (err) throw err;
				var themeMail = "";
				var textMail = "";

				var transporter = nodemailer.createTransport({
					host: "smtp.timeweb.ru",
					port: 2525,
			    secure: false,
				  auth: {
				    user: 'admin@gmer.io',
				    pass: 'wU5qcL6x'
				  }
				});

				if (type == "signup") {
					themeMail = "gmer.io registration";

					fs.readFile('code/mail/register.html', {encoding: 'utf-8'}, function(err, data) {
						textMail = data;
						textMail = textMail.replace('~~LINK~~', link).replace('~~LINK~~', link);

						var mailOptions = {
						  from: 'admin@gmer.io',
						  to: email,
						  subject: themeMail,
						  html: textMail
						};

						transporter.sendMail(mailOptions, function(error, info) {
						  if (!error) {
								io.to(socket.id).emit('sendAnswer2Signup', true, "Confirm letter was submitted on <b>"+email+"</b> check it to sign in.");
						  } else {
								io.to(socket.id).emit('sendAnswer2Signup', false, "Something goes wrong. Try sign up again.");
							}
						});

					});
				} else if (type == "signin") {
					themeMail = "gmer.io sign in";

					fs.readFile('code/mail/enter.html', {encoding: 'utf-8'}, function(err, data) {
						textMail = data;
						textMail = textMail.replace('~~LINK~~', link).replace('~~LINK~~', link);

						var mailOptions = {
						  from: 'admin@gmer.io',
						  to: email,
						  subject: themeMail,
						  html: textMail
						};

						transporter.sendMail(mailOptions, function(error, info) {
							if (!error) {
								io.to(socket.id).emit('sendAnswer2Signup', true, "Confirm letter was submitted on "+email+" . Check it to sign in.");
						  } else {
								io.to(socket.id).emit('sendAnswer2Signup', false, "Something goes wrong. Try sign in again.");
							}
						});

					});
				}



      });
			setTimeout(function() {
					connection.end();
			}, 1500);
		});
	});

  var getValueFromGet = function(query, val) {
    var arrQuery = query.split('&');
    for (var i = 0; i < arrQuery.length; i++) {
      var currQuery = arrQuery[i].split('=');
      if (currQuery[0] == val) {
        return currQuery[1];
      }
    }
  };

  socket.on('queryLink', function(url) {
    if (socket.id) {
    var get = url.split('?')[1];
    if (typeof get == 'undefined' || get == '') {
      io.to(socket.id).emit('responsQueryLink', 'redirect', '/');
    } else {
      var action = getValueFromGet(get, 'action');
      if (action == 'signup' || action == 'signin') {
        var connection = mysql.createConnection({
          host: "vh50.timeweb.ru",
          user: "totarget_gmerio",
          password: "Jc3FiReQ",
          database: "totarget_gmerio"
        });
        connection.connect(function(err) {
          connection.query("SELECT * FROM queries WHERE link='/query?"+get+"'", function (err1, result1, fields1) {
            if (result1[0]) {
              var hash = getValueFromGet(get, 'holder');
              var holder = decryptHolder(hash);
              var mail = getValueFromGet(get, 'mail')
              if (action == 'signup') {
                connection.query("SELECT * FROM users WHERE email='"+mail+"'", function (err2, result2, fields2) {
                  if (result2[0]) {
                    io.to(socket.id).emit('responsQueryLink', 'errorMessage', 'this email is already signed up');
                  } else {
                    connection.query("INSERT INTO users (email, holders, dateSignup) VALUES ('"+mail+"', '"+hash+"', '"+holder.pst+"')", function (err3, result3, fields3) {
                      if (err3) {
                        io.to(socket.id).emit('responsQueryLink', 'errorMessage', 'something goes wrong in the database, please, try later.');
                      } else {
                        connection.query("DELETE FROM queries WHERE link='/query?"+get+"'", function (err4) {});
                        io.to(socket.id).emit('responsQueryLink', 'signin', mail);
                      }
                    });
                  }
                });
              } else if (action == 'signin') {
                connection.query("SELECT * FROM users WHERE email='"+mail+"'", function (err2, result2, fields2) {
                  if (result2[0]) {
                    if (result2[0].dateSignup == null) {
                      connection.query("UPDATE users SET `dateSignup`='"+holder.pst+"' WHERE id='"+result2[0].id+"'", function (err3) {});
                    }
                    if (result2[0].holders == null) {
                      connection.query("UPDATE users SET `holders`='"+hash+"' WHERE id='"+result2[0].id+"'", function (err4) {});
                    } else {
                      var flagAddHolder = true;
                      var strokeHolders = result2[0].holders.split('!!!!!2');
                      for (var i = 0; i < strokeHolders.length; i++) {
                        var currStrHolder = decryptHolder(strokeHolders[i]);
                        if (currStrHolder.browser == holder.browser && currStrHolder.mobile == holder.mobile && currStrHolder.os == holder.os && currStrHolder.osVersion == holder.osVersion && currStrHolder.ip == holder.ip) {
                          flagAddHolder = false;
                        }
                      }
                      if (flagAddHolder) {
                        connection.query("UPDATE users SET `holders`='"+result2[0].holders+'!!!!!2'+hash+"' WHERE id='"+result2[0].id+"'", function (err) {});
                      }
                    }
                    connection.query("DELETE FROM queries WHERE link='/query?"+get+"'", function (err5) {});
                    io.to(socket.id).emit('responsQueryLink', 'signin', mail);
                  } else {
                    io.to(socket.id).emit('responsQueryLink', 'errorMessage', 'this account doesn\'t exist');
                  }
                });
              }
    				} else {
              io.to(socket.id).emit('responsQueryLink', 'errorMessage', 'incorrect query');
    				}
          });
    			setTimeout(function() {
    					connection.end();
    			}, 2500);
        });
      } else {
        io.to(socket.id).emit('responsQueryLink', 'errorMessage', 'incorrect query');
      }
    }
    }
  });

  socket.on('authorization', function(mail, device) {
    device.ip = myip;
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });
    connection.connect(function(err) {
      connection.query("SELECT * FROM users WHERE email='"+mail+"'", function (err, result, fields) {
        if (result[0]) {
          var flagFound = false;
          if (result[0].holders != null && result[0].holders != '' && result[0].holders) {
            var hashs = result[0].holders.split('!!!!!2');
            var holders = [];
            for (var i = 0; i < hashs.length; i++) {
              var currHolder = decryptHolder(hashs[i]);
              if (device.browser == currHolder.browser && device.mobile == currHolder.mobile && device.os == currHolder.os && device.osVersion == currHolder.osVersion && device.ip == currHolder.ip) {
                flagFound = true;
              }
              holders[i] = currHolder;
            }
            if (flagFound) {
              var user = {
                id: result[0].id,
                email: result[0].email,
                holders: holders,
                dateSignup: result[0].dateSignup
              };
              io.to(socket.id).emit('authorization2', user);
            } else if (!flagFound) {
              io.to(socket.id).emit('authorization2', false);
            }
          } else {
            io.to(socket.id).emit('authorization2', false);
          }
        } else {
          io.to(socket.id).emit('authorization2', false);
        }
      });
      setTimeout(function() {
          connection.end();
      }, 2500);
    });
  });

  socket.on('deleteDevice', function(idUser, indexDevice) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });
    connection.connect(function(err) {
      connection.query("SELECT * FROM users WHERE id='"+idUser+"'", function (err, result, fields) {
        if (result[0]) {
          var hashs = result[0].holders.split("!!!!!2");
          hashs.splice(Number(indexDevice), 1);
          hashs = hashs.join('!!!!!2');
          if (hashs == null || hashs == '' || !hashs) {
            connection.query("UPDATE users SET `holders`=NULL WHERE id='"+idUser+"'", function (err2, result2, fields2) {
              io.to(socket.id).emit('refreshPage');
              connection.end();
            });
          } else {
            //connection.query("UPDATE itemsFortress SET `received` = '"+received+"' WHERE id = '"+getIdItemRecieved+"'", function () {});
            connection.query("UPDATE users SET `holders` = '"+hashs+"' WHERE id='"+idUser+"'", function (err2, result2, fields2) {
              io.to(socket.id).emit('refreshPage');
              connection.end();
            });
          }
        }
      });
      // setTimeout(function() {
      //     connection.end();
      // }, 1500);
    });
  });

  socket.on('deleteAccount', function(idUser) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });
    connection.connect(function(err) {
      connection.query("DELETE FROM users WHERE id='"+idUser+"'", function (err, result, fields) {
        // io.to(socket.id).emit('refreshPage');
        // connection.end();
      });
    });
  });

  socket.on('haveIStudio1', function(idUser) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });
    connection.connect(function(err) {
      connection.query("SELECT * FROM users WHERE id='"+idUser+"'", function (err, result, fields) {
        if (result[0].studios != null && result[0].studios != '' && typeof result[0].studios != 'undefined' && result[0].studios) {
          var studios = result[0].studios.split(',');
          studios = studios.join('|');
          connection.query("SELECT * FROM studios WHERE id REGEXP '("+studios+")'", function (err2, result2, fields2) {
            if (result2[0]) {
              io.to(socket.id).emit('haveIStudio2', result2);
            }
          });
        } else {
          io.to(socket.id).emit('haveIStudio2', false);
        }
      });
      setTimeout(function() {
          connection.end();
      }, 1500);
    });
  });

  function testUser(decryptedUser, encryptedUser) {
    io.to(socket.id).emit('sendtextttt', decryptedUser);
    io.to(socket.id).emit('sendtextttt', encryptedUser);
    if (decryptedUser.id == encryptedUser.id && decryptedUser.email == encryptedUser.email && decryptedUser.dateSignup == encryptedUser.dateSignup) {
      var holders = encryptedUser.holders.split('!!!!!2');
      io.to(socket.id).emit('sendtextttt', holders);
      for (var i = 0; i < holders.length; i++) {
        io.to(socket.id).emit('sendtextttt', decryptHolder(holders[i]));
        if (decryptHolder(holders[i]) != decryptedUser.holders[i]) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  socket.on('createStudio', function(validUser, nameStudio) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });
    connection.connect(function(err) {
      connection.query("SELECT * FROM users WHERE id='"+validUser.id+"'", function (err, result, fields) {
        // io.to(socket.id).emit('sendtextttt', validUser);
        // io.to(socket.id).emit('sendtextttt', result[0]);
        // io.to(socket.id).emit('sendtextttt', testUser(validUser, result[0], socket.id));
        if (result[0] && testUser(validUser, result[0])) {
          // io.to(socket.id).emit('sendtextttt', result[0]);
          var pstTime = new Date(Date.now()+new Date().getTimezoneOffset()*60*1000+(-7*60*60*1000));
          var mounths = pstTime.getMonth()+1;
          if (mounths < 10) { mounths = '0'+mounths; }
          var days = pstTime.getDate();
          if (days < 10) { days = '0'+days; }
          var hours = pstTime.getHours();
          if (hours < 10) { hours = '0'+hours; }
          var minutes = pstTime.getMinutes();
          if (minutes < 10) { minutes = '0'+minutes; }
          var seconds = pstTime.getSeconds();
          if (seconds < 10) { seconds = '0'+seconds; }
          pstTime = pstTime.getFullYear()+'-'+mounths+'-'+days+' '+hours+':'+minutes+':'+seconds;
          connection.query("INSERT INTO studios (name, keyHolder, staff, dateCreate) VALUES ('"+nameStudio+"', '"+result[0].id+"', '"+result[0].id+":Founder', '"+pstTime+"')", function (err, result, fields) {
            if (!err) {
              io.to(socket.id).emit('refreshPage');
            }
          });
        }
      });
      setTimeout(function() {
          connection.end();
      }, 1500);
    });
  });

  socket.on('listMyStudios1', function(idUser) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });
    connection.connect(function(err) {
      connection.query("SELECT * FROM users WHERE id='"+idUser+"'", function (err, result, fields) {
        if (result[0]) {
          var studios = result[0].studios.split(',');
          studios = studios.join('|');
          connection.query("SELECT * FROM studios WHERE id REGEXP '("+studios+")'", function (err2, result2, fields2) {
            if (result2[0]) {
              // var answer = '';
              // for (var i = 0; i < result2.length; i++) {
              //   if (i == 0) {
              //     answer += result2.id[i];
              //     continue;
              //   }
              //   answer += ','+result2.id[i];
              // }
              io.to(socket.id).emit('listMyStudios2', result2);
            }
          });
          // connection.query("INSERT INTO studios (name, keyHolder, staff, dateCreate) VALUES ('"+nameStudio+"', '"+result[0].id+"', '"+result[0].id+":Founder', '"+pstTime+"')", function (err, result, fields) {});
          // io.to(socket.id).emit('refreshPage');
        }
      });
      setTimeout(function() {
          connection.end();
      }, 1500);
    });
  });

	socket.on('requestLink', function(link) {
		var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM queries WHERE link='"+link+"'", function (err, result, fields) {
        //if (err) throw err;
        if (result[0]) {
					var attr = link.split("?");
					attr = attr[1].split("&");

					var oneattr = attr[0].split("=");
					if (oneattr[0] == "type" && (oneattr[1] == "signup" || oneattr[1] == "signin")) {
						var mail = attr[1].split("=");
						mail = mail[1];
						if (oneattr[1] == "signup") {
							connection.query("INSERT INTO users (email) VALUES ('"+mail+"')");
						}
						connection.query("DELETE FROM queries WHERE link='"+link+"'");

						io.to(socket.id).emit('answerRequestLink', "cookie", "mid", encrypt(mail));
					}
				} else {
					io.to(socket.id).emit('answerRequestLink', "cookie", "error", "This link doesn't work try sign in again.");
				}
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
	});

	socket.on('decryptMail', function(hex) {
    var mail = decrypt(hex);
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM users", function (err, result, fields) {
        //if (err) throw err;
        var answer = "!nomail";
        for (i in result) {
          if (result[i].email == mail) {
            answer = result[i].id+"|"+mail;
            break;
          }
        }
        io.to(socket.id).emit('sendDecryptMail', answer);

        if (answer != "!nomail") {
          //console.log(answer.split("|")[0]);
          connection.query("SELECT * FROM dataFortress WHERE id = "+answer.split("|")[0], function (err1, result1, fields1) {
            if (!result1[0]) {
              connection.query("INSERT INTO dataFortress (id, rating) VALUES ('"+answer.split("|")[0]+"', '100')");

              io.to(socket.id).emit('getAdditionalCookie', answer);
              socket.on('giveAdditionalCookie', function(additional) {
                var nowadd = decrypt(additional);
                nowadd = nowadd.split(";");
                for (var i = 0; i < nowadd.length; i++) {
                  var curradd = nowadd[i].split("=");
                  if (curradd[0] == "rating" && parseInt(curradd[1]) > 100) {
                    var endstroke = "";
                    for (var j = 0; j < nowadd.length; j++) {
                      if (nowadd[j].split("=")[0] == "items" && nowadd[j].split("=")[1] != "1,2,3") {
                        var getIdItemRecieved = nowadd[j].split("=")[1].split(",");
                        getIdItemRecieved = getIdItemRecieved[getIdItemRecieved.length-1];

                        connection.query("SELECT * FROM itemsFortress WHERE id = '"+getIdItemRecieved+"'", function (err3, result3, fields3) {
                          var received = parseInt(result3[0].received)+1;
                          connection.query("UPDATE itemsFortress SET `received` = '"+received+"' WHERE id = '"+getIdItemRecieved+"'", function () {});
                        });
                      }

                      if (j == 0) {
                        endstroke += "`"+nowadd[j].split("=")[0]+"`='"+nowadd[j].split("=")[1]+"'";
                        continue;
                      }
                      endstroke += ",`"+nowadd[j].split("=")[0]+"`='"+nowadd[j].split("=")[1]+"'";
                    }
                    // console.log(endstroke);
                    // console.log(answer.split("|")[0]);
                    connection.query("UPDATE dataFortress SET "+endstroke+" WHERE id = "+answer.split("|")[0]);
                    io.to(socket.id).emit('removeAdditionalCookie');
                    break;
                  }
                }
              });
            }
          });
        }
      });
      io.to(socket.id).emit('removeAdditionalCookie');//testing
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
	});

  socket.on('getUserData', function(id) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM dataFortress WHERE id = '"+id+"'", function (err, result, fields) {
        //if (err) throw err;
        var answer = "";
        for (var i in result[0]) {
          if (answer == "") {
            answer += i+"~~"+result[0][i];
            continue;
          }
          answer += "||"+i+"~~"+result[0][i];
        }
        io.to(socket.id).emit('sendUserData', answer);
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('getItems', function(items) {

    //var regexp = items.replace(/\,/g, '|');
    var regexp = items.split(",");
    for (var i = 0; i < regexp.length; i++) {
      regexp[i] = "^"+regexp[i]+"$";
    }
    regexp = regexp.join("|");

    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM itemsFortress WHERE id REGEXP '("+regexp+")'", function (err, result, fields) {
        //if (err) throw err;
        var answer = "";
        for (var i in result) {
          if (i == 0) {
            answer += result[i].id+"~~"+result[i].type+"~~"+result[i].name+"~~"+result[i].received;
            continue;
          }
          answer += "||"+result[i].id+"~~"+result[i].type+"~~"+result[i].name+"~~"+result[i].received;
        }
        io.to(socket.id).emit('sendItems', answer);
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('setItem', function(id, item) {
    item = item.split("~~");
    var type = item[0];
    var name = item[1];
    var field = "";
    switch (type) {
      case "cannon1":
        field = "equipItemCannon1";
        break;
      case "cannon2":
        field = "equipItemCannon2";
        break;
      case "wall":
        field = "equipItemWall";
        break;
    }

    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("UPDATE dataFortress SET `"+field+"` = '"+name+"' WHERE id = '"+id+"'", function (err, result, fields) {
        //if (err) throw err;
        io.to(socket.id).emit('sendAnwerSetItem');
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('alert', function(idRoom, text) {
		if (rooms[idRoom]) {
      io.to(rooms[idRoom].player1).emit('sendAlert', text);
			io.to(rooms[idRoom].player2).emit('sendAlert', text);
		}
  });

  socket.on('getMyRrating', function(iduser) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM dataFortress WHERE id = '"+iduser+"'", function (err, result, fields) {
        //if (err) throw err;
        // var answer = "";
        // for (var i in result) {
        //   if (i == 0) {
        //     answer += result[i].id+"~~"+result[i].type+"~~"+result[i].name+"~~"+result[i].received;
        //     continue;
        //   }
        //   answer += "||"+result[i].id+"~~"+result[i].type+"~~"+result[i].name+"~~"+result[i].received;
        // }
        // io.to(socket.id).emit('sendItems', answer);
          io.to(socket.id).emit('sendRating', result[0].rating);
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('giveMyRatingToEnemy', function(idRoom, sideSource, rating) {
		if (rooms[idRoom]) {
      if (sideSource == 1) {
        io.to(rooms[idRoom].player2).emit('sendEnemyRating', rating);
      } else if (sideSource == 2) {
        io.to(rooms[idRoom].player1).emit('sendEnemyRating', rating);
      }
		}
  });

  socket.on('giveMyIdToEnemy', function(idRoom, sideSource, id) {
		if (rooms[idRoom]) {
      if (sideSource == 1) {
        io.to(rooms[idRoom].player2).emit('sendEnemyId', id);
      } else if (sideSource == 2) {
        io.to(rooms[idRoom].player1).emit('sendEnemyId', id);
      }
		}
  });

  socket.on('addDataUser', function(id, column, value) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM dataFortress WHERE id = '"+id+"'", function (err, result, fields) {
        var insert = result[0][column]+value;
        connection.query("UPDATE dataFortress SET `"+column+"` = '"+insert+"' WHERE id = '"+id+"'", function (err, result, fields) {});
      });

      setTimeout(function() {
          connection.end();
      }, 1500);
    });
  });

  socket.on('cookieAdditionalData', function(datacookie) {
    io.to(socket.id).emit('sendEncryptAdditionalData', encrypt(datacookie));
  });

  socket.on('decryptAdditional', function(additional) {
    io.to(socket.id).emit('sendDecryptAdditional', decrypt(additional));
  });

  socket.on('getItemIdonHave', function(iduser) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      if (iduser == "!noid") {
          var myItems = "1,2,3";
          myItems = myItems.split(",");

          connection.query("SELECT * FROM itemsFortress", function (err, result, fields) {
            var answer = "";
            var flagfirst1 = true;
            for (var i = 0; i < result.length; i++) {
              var idonthave = true;
              for (var j = 0; j < myItems.length; j++) {
                if (myItems[j] == result[i].id) {
                  idonthave = false;
                  break;
                }
              }
              if (idonthave) {
                // answer += "";
                var flagfirst2 = true;
                for (j in result[i]) {
                  if (flagfirst2) {
                    if (flagfirst1) {
                      answer += j+"="+result[i][j];
                      flagfirst1 = false;
                      flagfirst2 = false;
                      continue;
                    }
                    answer += ";"+j+"="+result[i][j];
                    flagfirst2 = false;
                    continue;
                  }
                  answer += ","+j+"="+result[i][j];
                }
              }
            }
            io.to(socket.id).emit('sendItemYouDontHave', answer);
          });
      } else {
        connection.query("SELECT * FROM dataFortress WHERE id = '"+iduser+"'", function (err, result, fields) {
          var myItems = result[0].items;
          myItems = myItems.split(",");

          connection.query("SELECT * FROM itemsFortress", function (err, result, fields) {
            var answer = "";
            var flagfirst1 = true;
            for (var i = 0; i < result.length; i++) {
              var idonthave = true;
              for (var j = 0; j < myItems.length; j++) {
                if (myItems[j] == result[i].id) {
                  idonthave = false;
                  break;
                }
              }
              if (idonthave) {
                // answer += "";
                var flagfirst2 = true;
                for (j in result[i]) {
                  if (flagfirst2) {
                    if (flagfirst1) {
                      answer += j+"="+result[i][j];
                      flagfirst1 = false;
                      flagfirst2 = false;
                      continue;
                    }
                    answer += ";"+j+"="+result[i][j];
                    flagfirst2 = false;
                    continue;
                  }
                  answer += ","+j+"="+result[i][j];
                }
              }
            }
            io.to(socket.id).emit('sendItemYouDontHave', answer);
          });
        });
      }

			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('getCounterUsers', function() {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM dataFortress", function (err, result, fields) {
        io.to(socket.id).emit('sendCounterUsers', result.length);
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('addItemUser', function(iduser, iditem) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM dataFortress WHERE id = '"+iduser+"'", function (err, result, fields) {
        var items = result[0].items+","+iditem;
        connection.query("UPDATE dataFortress SET `items` = '"+items+"' WHERE id = '"+iduser+"'", function (err, result, fields) {});

        connection.query("SELECT * FROM itemsFortress WHERE id = '"+iditem+"'", function (err2, result2, fields2) {
          if (result2[0].received) {
            var received = parseInt(result2[0].received)+1;
            connection.query("UPDATE itemsFortress SET `received` = '"+received+"' WHERE id = '"+iditem+"'", function () {});
          }
        });
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('getTextures', function(iduser) {
    var connection = mysql.createConnection({
      host: "vh50.timeweb.ru",
      user: "totarget_gmerio",
      password: "Jc3FiReQ",
      database: "totarget_gmerio"
    });

    connection.connect(function(err) {
      //if (err) throw err;
      connection.query("SELECT * FROM dataFortress WHERE id = '"+iduser+"'", function (err, result, fields) {
        io.to(socket.id).emit('sendTextures', result[0].equipItemCannon1+"~~"+result[0].equipItemCannon2+"~~"+result[0].equipItemWall);
      });
			setTimeout(function() {
					connection.end();
			}, 1500);
    });
  });

  socket.on('sendEnemyTextures', function(idRoom, sideSource, textures) {
		if (rooms[idRoom]) {
      if (sideSource == 1) {
        io.to(rooms[idRoom].player2).emit('takeEnemyRating', textures);
      } else if (sideSource == 2) {
        io.to(rooms[idRoom].player1).emit('takeEnemyRating', textures);
      }
		}
  });

  socket.on('upload', function(file, name) {
    fs.writeFile(__dirname+'/img/designers/'+name, file, function (err) {});

    io.to(socket.id).emit('uploaded');
  });

  // socket.on('uploadMultiply', function(files, idDesigner) {
  //   var imgs = [];
  //   var count = 0;
  //   fs.readdir(__dirname+'/img', function(err, imgFiles) {
  //     imgFiles.forEach(function (file) {
  //       if (file.split(".")[1] == "png") {
  //         imgs[count] = file;
  //         count++;
  //       }
  //     });
  //
  //     for (var i = 0; i < files.length; i++) {
  //       //check name
  //       for (var j = 0; j < imgs.length; j++) {
  //         if (imgs[j] == files[i].name) {
  //           //add file
  //           fs.writeFile(__dirname+'/img/designers/'+idDesigner+"~~"+files[i].name, imgone, function (err) {});
  //           break;
  //         }
  //       }
  //     }
  //   });
  //   io.to(socket.id).emit('uploaded');
  // });

  socket.on('getAllImg', function() {
    fs.readdir(__dirname+'/img', function(err, files) {
      var answer = "";
      var flag = true;
      files.forEach(function (file) {
        if (file.split(".")[1] == "png") {
          if (flag) {
            answer += file;
            flag = false;
          } else {
            answer += ";"+file;
          }
        }
      });
      io.to(socket.id).emit('sendAllImg', answer);
    });
  });

  socket.on('removeFile', function(url) {
    fs.unlink(__dirname+url, function (err) {});

    io.to(socket.id).emit('uploaded');
  });
  //end code fortress into socket ----------------


  //start code stealth into socket ----------------
  playersS[socket.id] = {
		id: socket.id,
		status: 'home'
	};

	socket.on('switchSearchingGameS', function() {
		if (playersS[socket.id].status == 'home') {
			addPlayerToRoomS(socket.id);
			playersS[socket.id].status = 'intoRoom';
		} else if (playersS[socket.id].status == 'intoRoom') {
			removePlayerFromRoomS(socket.id);
			playersS[socket.id].idRoom = '';
			playersS[socket.id].status = 'home';
			playersS[socket.id].idObj = '';
		}
  });

	socket.on('sendAddObjectsS', function(arrObjects, flag) {
    if (playersS[socket.id] && roomsS[playersS[socket.id].idRoom]) {
  		var idRoom = playersS[socket.id].idRoom;
  		var lengthObjects = roomsS[idRoom].objects.length;
  		for (var i = 0; i < arrObjects.length; i++) {
  			arrObjects[i].id = lengthObjects+i;
  		}
  		addObjectsS(idRoom, arrObjects);

  		if (flag == 'me') {
  			playersS[socket.id].idObj = lengthObjects;
  			io.to(socket.id).emit('takeIdObjPlayerS', lengthObjects);
  		}
    }
  });

	socket.on('sendChgSpeedPlayerS', function(idObjPlayer, speedx, speedy) {
		if (playersS[socket.id].idRoom && roomsS[playersS[socket.id].idRoom] && roomsS[playersS[socket.id].idRoom].objects[idObjPlayer]) {
    var idRoom = playersS[socket.id].idRoom;
		if (speedx != null) {
			roomsS[idRoom].objects[idObjPlayer].speed.x = speedx;
			for (var i = 0; i < roomsS[idRoom].players.length; i++) {
				io.to(roomsS[idRoom].players[i]).emit('chgSpeedPlayerS', idObjPlayer, speedx, null);
			}
		}
		if (speedy != null) {
			roomsS[idRoom].objects[idObjPlayer].speed.y = speedy;
			for (var i = 0; i < roomsS[idRoom].players.length; i++) {
				io.to(roomsS[idRoom].players[i]).emit('chgSpeedPlayerS', idObjPlayer, null, speedy);
			}
		}
		}
  });

	socket.on('sendMyCoordToAllS', function(idObj, coord) {
    if (playersS[socket.id] && playersS[socket.id].idRoom) {
		var idRoom = playersS[socket.id].idRoom;
  		for (var i = 0; i < roomsS[idRoom].players.length; i++) {
  			if (roomsS[idRoom].players[i] != socket.id) {
  				io.to(roomsS[idRoom].players[i]).emit('takeNewCoordPlayerS', idObj, coord);
  			}
  		}
    }
  });

	socket.on('rotatePlayerS', function(idObj, angle, direct) {
    if (playersS[socket.id] && playersS[socket.id].idRoom) {
		var idRoom = playersS[socket.id].idRoom;
  		for (var i = 0; i < roomsS[idRoom].players.length; i++) {
  			if (roomsS[idRoom].players[i] != socket.id) {
  				io.to(roomsS[idRoom].players[i]).emit('takeNewRotatePlayerS', idObj, angle, direct);
  			}
  		}
    }
  });

  socket.on('sendActionS', function(idObj, action, param) {
    if (playersS[socket.id] && roomsS[playersS[socket.id].idRoom]) {
		var idRoom = playersS[socket.id].idRoom;
  		for (var i = 0; i < roomsS[idRoom].players.length; i++) {
  			if (roomsS[idRoom].players[i] != socket.id) {
  				io.to(roomsS[idRoom].players[i]).emit('takeActionS', idObj, action, param);
  			}
  		}
    }
  });

  socket.on('sendChgHpBloodS', function(idPlayer, hp, blood) {
    if (playersS[socket.id] && roomsS[playersS[socket.id].idRoom]) {
		var idRoom = playersS[socket.id].idRoom;
  		for (var i = 0; i < roomsS[idRoom].players.length; i++) {
  			if (roomsS[idRoom].players[i] != socket.id) {
  				io.to(roomsS[idRoom].players[i]).emit('takeChgHpBloodS', idPlayer, hp, blood);
  			}
  		}
    }
  });

  socket.on('sendDeadPlayerS', function(idPlayer) {
    if (playersS[socket.id] && roomsS[playersS[socket.id].idRoom]) {
		var idRoom = playersS[socket.id].idRoom;
      roomsS[idRoom].alives--;
  		for (var i = 0; i < roomsS[idRoom].players.length; i++) {
  			if (roomsS[idRoom].players[i] != socket.id) {
  				io.to(roomsS[idRoom].players[i]).emit('takeDeadPlayerS', idPlayer);
  			}
  		}
      checkFinishRoom(roomsS[idRoom]);
    }
  });

  socket.on('giveFinishDataS', function(finishData) {
    if (playersS[socket.id] && roomsS[playersS[socket.id].idRoom]) {
      var room = roomsS[playersS[socket.id].idRoom];
      finishData.id = socket.id;
      room.finishData[room.finishData.length] = finishData;
      var countbots = 0;
      for (var i = 0; i < room.players.length; i++) {
        if (room.players[i].substr(0, 3) == 'bot' && room.players[i].length < 6) {
          countbots++;
        }
      }
      if (room.finishData.length == room.players.length-countbots) {
        for (var i = 0; i < room.players.length; i++) {
    			io.to(room.players[i]).emit('finishGameS', room.finishData);
    		}
        //delete roomsS[playersS[socket.id].idRoom];
      }
    }
  });

  socket.on('sendCreateFinishDataBotsS', function(finishDataBots) {
    if (playersS[socket.id] && roomsS[playersS[socket.id].idRoom]) {
		var idRoom = playersS[socket.id].idRoom;
  		for (var i = 0; i < roomsS[idRoom].players.length; i++) {
  			if (roomsS[idRoom].players[i] != socket.id) {
  				io.to(roomsS[idRoom].players[i]).emit('takeCreateFinishDataBotsS', finishDataBots);
  			}
  		}
      checkFinishRoom(roomsS[idRoom]);
    }
  });

  socket.on('exitToMainMenuS', function() {
  	playersS[socket.id].idRoom = '';
  	playersS[socket.id].status = 'home';
  	playersS[socket.id].idObj = '';
  });

  //end code stealth into socket ----------------

  socket.on('disconnect', function() {
		if (players[socket.id]) {
	    if (players[socket.id].status == 2 || players[socket.id].status == 3) {
	      for (var i in rooms) {
	        if (rooms[i].player1 == socket.id || rooms[i].player2 == socket.id) {
	          if (rooms[i].player1 == socket.id) {
	            exitToMenu(rooms[i].player2);
	          } else if (rooms[i].player2 == socket.id) {
	            exitToMenu(rooms[i].player1);
	          }
	          abortRoom(i);
	          break;
	        }
	      }
	    }
		}
    delete players[socket.id];

    removePlayerFromRoomS(socket.id);
		delete playersS[socket.id];
	});
});
