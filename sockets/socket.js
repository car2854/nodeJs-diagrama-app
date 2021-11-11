const { Socket } = require('socket.io');
const { socketIO } = require('socket.io');

const disconnect = (client = Socket) => {
  client.on('disconnect', () => {
  });
}


const emitirDiagrama = (client = Socket, io = socketIO.server) => {
  
  client.on('emitirDiagrama', ( payload ) => {
    io.to(payload.idMeeting).emit('escucharDiagrama', payload);
  });
  
}

const ingresarNuevoUsuario = (client = Socket, io = socketIO.server) => {
  client.on('entrarReunion', ( payload = {de: String, room: String, nombreUsuario: String} ) => {
    client.join(payload.room);
    console.log(payload.nombreUsuario);
    io.to(payload.room).emit('escucharNuevoUsuario', payload);
  });
}

const abandonarUsuario = (client = Socket, io = socketIO.server) => {
  
  client.on('abandonarReunion', ( payload = {de: String, room: String, nombreUsuario: String} ) => {
    client.leave(payload.room);
    console.log('Salir');
    io.to(payload.room).emit('escucharDejarusuario', payload);
  });

}


module.exports = {
  disconnect,
  abandonarUsuario,
  ingresarNuevoUsuario,
  emitirDiagrama,
}