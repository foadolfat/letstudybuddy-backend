const ServiceLocator = require("./ServiceLocator");
const UsersService = require("./UsersService");
const SocketService = require("./SocketService");

let io;

exports.socketConnection = (server) => {
    
    const jwt = require("jsonwebtoken");
    const secret= "super-duper-secret";
    const socketIO = require("socket.io");

    io = socketIO(server, {
        cors: true,
        origins:["localhost:3000"]
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        socket.token = token;
        if (!socket.token) {

            }
        
        jwt.verify(socket.token, secret, async (err, decoded) => {
            if (err) {
                console.log(err)
            }
            else {
                socket.user_id = decoded.id
                const usersService = ServiceLocator.getService(UsersService.name);

            try{
                const { payload: user, error } = await usersService.getUser(decoded.id, null, null);
                    if(error) {
                        console.log(error)
                    } else {
                        //If socket and IO are authenticated
                        //Initialize Chat
                        require("./ChatServiceV2")(socket)
                        socket.username = user.USERNAME
    
                    }
                }catch(e){
                    console.log("an error occured", e);
                }
            }

        });
        next()

    });
    io.on("connection", async (socket) => {
        console.log("in IOService: socket id is ",socket.id);
        console.log("in IOService: socket user_id is ",socket.user_id);

        const socketService = ServiceLocator.getService(SocketService.name);

        try{
            const { payload: sock, error } = await socketService.createSocket(socket.user_id, socket.id);
            if(error) {
                console.log(error)
            } else {

            }
        }catch(e){
            console.log("an error occured", e);
        }

        socket.on("disconnect", async() => {
            const socketService = ServiceLocator.getService(SocketService.name);
            try{
                const { payload: sock, error } = await socketService.deleteSocket(socket.user_id, socket.id);
                if(error) {
                    console.log(error)
                } else {
    
                }
            }catch(e){
                console.log("an error occured", e);
            }
            socket.leave();
        });
    });
};

exports.sendMessage = (room, key, message, intendedRoom) => io.to(room).emit(key, message, intendedRoom);
exports.sendNotification = (socketId, key, room) => io.to(socketId).emit(key, room);