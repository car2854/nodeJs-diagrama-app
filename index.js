require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);
require('./sockets/index');

app.use(cors());
app.use( express.json() )
app.use(express.static('public'));

app.use( '/api/autenticacion', require('./routes/autenticacion') );
app.use( '/api/usuario', require('./routes/usuario') );
app.use( '/api/pizarra', require('./routes/reunion'));
app.use( '/api/entrar', require('./routes/unirse'));

app.get('*', (req, res) => {
  res.sendFile( path.resolve(__dirname, 'public/index.html') );
});

server.listen( process.env.PORT, () => {
  	console.log('Corriendo: ' + process.env.PORT);
});