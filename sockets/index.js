const { io } = require('../index');

const { disconnect, abandonarUsuario, emitirDiagrama, ingresarNuevoUsuario} = require('./socket');

io.on('connection', client => {
  disconnect(client);
  ingresarNuevoUsuario(client, io);
  abandonarUsuario(client, io);
  emitirDiagrama(client, io);
});