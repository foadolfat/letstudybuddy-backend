const ServiceLocator = require("./ServiceLocator");
const SocketService = require("./SocketService");

const NEW_PEER = "new_peer_event";

module.exports = (io) => {
    // io.on(NEW_PEER, (data) => {
    //     const peer_id = data.peer_id;

    // });

    io.sockets.on('connection', function (socket) {
        socket.on(NEW_PEER, function () {
          console.log('file2Event triggered');
        });
      });
}