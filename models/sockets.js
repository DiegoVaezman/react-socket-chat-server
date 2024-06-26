const {
  usuarioConectado,
  usuarioDesconectado,
  getUsuarios,
  grabarMensaje,
} = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      const [valido, uid] = comprobarJWT(socket.handshake.query["x-token"]);

      if (!valido) {
        console.log("socket no identificado");
        return socket.disconnect();
      }

      await usuarioConectado(uid);

      socket.join(uid);

      //saber que usuario estÁ activo con el uid

      this.io.emit("lista-usuarios", await getUsuarios());

      socket.on("mensaje-personal", async (payload) => {
        const mensaje = await grabarMensaje(payload);
        this.io.to(payload.to).emit("mensaje-personal", mensaje);
        this.io.to(payload.from).emit("mensaje-personal", mensaje);
      });

      //socket join, uid
      //escuchar cuando cliente manda mensaje
      //disconnect
      //marvar en ddbb que el usuario se desconecto
      //emitir usuarios conectados

      socket.on("disconnect", async () => {
        await usuarioDesconectado(uid);
        this.io.emit("lista-usuarios", await getUsuarios());
      });
    });
  }
}

module.exports = Sockets;
