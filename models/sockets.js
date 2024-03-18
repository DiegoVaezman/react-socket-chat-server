class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      //TODO: validad jwt
      // si no es valido desconectar
      //saber que usuario estÁ activo con el uid
      //emitir todos los usuario conectados
      //socket join, uid
      //escuchar cuando cliente manda mensaje
      //disconnect
      //marvar en ddbb que el usuario se desconecto
      //emitir usuarios conectados
    });
  }
}

module.exports = Sockets;
