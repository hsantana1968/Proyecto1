// Setup basic express server version 2
//Comentario para prueba GitHub
//Prueba 222
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

//Conexion a la base de datos
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'juego'
});



io.on('connection', function(socket){
	socket.emit('welcome', { message: 'Welcome!', id: socket.id });
	console.log('a user connected');
  
	socket.on('disconnect', function(){
    console.log('user disconnected');
	});
	socket.on('coordenadas', function(x){
    console.log("x="+x.coordX+", y="+x.coordY);
	io.emit("nuevasCoordenadas",{coordX: x.coordX, coordY: x.coordY, id:socket.id});	 //Broadcast de coordenadas a todos los usuarios
	connection.query(
            "INSERT INTO juego.coordenadas_barco (coordX, coordY) VALUES (?, ?)",
            [x.coordX, x.coordY],
            function(err, results, fields)
            {
                if (err) throw err;
            }
        )
    });


});

 