const express = require("express");
const MySQLUsersService = require("./services/MySQL/MySQLUsersService");
const MySQLClassesService = require("./services/MySQL/MySQLClassesService");
const MySQLPeersService = require("./services/MySQL/MySQLPeersService");
const MySQLSuggestionsService = require("./services/MySQL/MySQLSuggestionsService");
const MySQLRoomsService = require("./services/MySQL/MySQLRoomsService");
const MySQLRoomMemberService = require("./services/MySQL/MySQLRoomMemberService");
const MySQLMessagesService = require("./services/MySQL/MySQLMessagesService");
const MySQLSocketService = require("./services/MySQL/MySQLSocketService");
const ServiceLocator = require("./services/ServiceLocator");
const UsersService = require("./services/UsersService");
const ClassesService = require("./services/ClassesService");
const PeersService = require("./services/PeersService");
const SuggestionsService = require("./services/SuggestionsService");
const RoomsService = require("./services/RoomsService");
const RoomMemberService = require("./services/RoomMemberService");
const MessagesService = require("./services/MessagesService");
const SocketService = require("./services/SocketService");
const jwt = require("jsonwebtoken");
const secret= "super-duper-secret";

const app = express();
app.use(require('cors')());
const PORT = 5050;



// const NEW_MESSAGE_EVENT = "new-message-event";
// const NEW_ROOM = "new-room-event"; 
const NEW_PEER = "new_peer_event";
const http = require("http");
const socketIO = require("socket.io");
const socketPort = process.env.PORT || 3030;
const server = http.createServer(app);
const io = socketIO(server, {
    cors: true,
    //origins:["localhost:3000"]
});

server.listen(socketPort, () => {
    console.log(`listening on *:${socketPort}`);
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    //console.log("index ", token)
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
                    //console.log(user.USERNAME)
                    socket.username = user.USERNAME
                    
                    //console.log(socket.username)
                }
            }catch(e){
                console.log("an error occured", e);
            }
        }

    });
    next()
    // ...
  });
io.on("connection", async (socket) => {
    console.log("socket id is ",socket.id);
    console.log("socket user_id is ",socket.user_id);

    const socketService = ServiceLocator.getService(SocketService.name);

    try{
        const { payload: sock, error } = await socketService.createSocket(socket.user_id, socket.id);
        if(error) {
            console.log(error)
        } else {
            //console.log(user.USERNAME)
            //console.log(sock)
            
            //console.log(socket.username)
        }
    }catch(e){
        console.log("an error occured", e);
    }

    
    socket.on(NEW_PEER, async (peer_id) => {
        console.log(socket.user_id," ", peer_id)
        const roomMemberService = ServiceLocator.getService(RoomMemberService.name);
        //socket.user_id, peer_id
        try{
            const { payload: commonRoom, error } = await roomMemberService.checkForCommonRoom(socket.user_id, peer_id);
            if(error) {
                console.log(error)
            } else {
                console.log("index",commonRoom)
                if(commonRoom){
                    const socketService = ServiceLocator.getService(SocketService.name);

                    try{
                        const { payload: sock, error } = await socketService.getSocket(peer_id);
                        if(error) {
                            console.log(error)
                        } else {
                            //console.log(user.USERNAME)
                            //console.log("yes",sock.SOCKET_ID)
                            io.to(socket.id).emit(NEW_PEER);
                            io.to(sock.SOCKET_ID).emit(NEW_PEER);
                            
                            //console.log('file2Event triggered');
                            //console.log(socket.username)
                        }
                    }catch(e){
                        console.log("an error occured", e);
                    }
                }
            }
        }catch(e){
            console.log("an error occured", e);
        }

        
          
          
    });
    require("./services/ChatService")(socket)
    //require("./services/NotificationService")(io)
    // socket.on(NEW_ROOM, (data) => {
    //     socket.join(data);
    //     console.log("joining room ",data)
        
    // });

    // socket.on(NEW_MESSAGE_EVENT, (data) => {

    //     io.emit(NEW_MESSAGE_EVENT, data);
    // });

    socket.on("disconnect", async() => {
        try{
            const { payload: sock, error } = await socketService.deleteSocket(socket.user_id, socket.id);
            if(error) {
                console.log(error)
            } else {
                //console.log(user.USERNAME)
                console.log(sock)
                
                //console.log(socket.username)
            }
        }catch(e){
            console.log("an error occured", e);
        }
        socket.leave();
    });
});



app.use(express.json());
app.use(require(`./routes/userRoutes`));
app.use(require(`./routes/classesRoutes`));
app.use(require(`./routes/peersRoutes`));
app.use(require(`./routes/signInRoute`));
app.use(require(`./routes/suggestionsRoute`));
app.use(require(`./routes/roomsRoute`));
app.use(require(`./routes/roomMemberRoute`));
app.use(require(`./routes/messagesRoute`));



const databaseSetup = async () => {
    const exec = require("child_process").exec;
    //mysql -u root < schema.sql
    const mysqlCMD = new Promise((resolve, reject) => {
        exec("ls",(error, stdout, stderr) => {
            if(stderr) {
                console.log("stderr");
                reject(new Error(stderr));
                return console.log(stderr);
            }
            if(error) {
                console.log("error");
                reject(error);
                return console.log(error);
            }
            resolve();
        });
    });
    //mysql://b4410f552ec22f:cd993a39@us-cdbr-east-04.cleardb.com/heroku_d74528e87dcb28b?reconnect=true
    //mysql://b4410f552ec22f:cd993a39@us-cdbr-east-04.cleardb.com/heroku_d74528e87dcb28b?reconnect=true
    try{
        await mysqlCMD;
        const connection = require("mysql").createPool({
            // connectionLimit : 100,
            // host: "localhost",
            // user:"root",
            // database:"study"
            connectionLimit : 100,
            host: "us-cdbr-east-04.cleardb.com",
            user:"b4410f552ec22f",
            database:"heroku_d74528e87dcb28b",
            password:"cd993a39"
        });
        const usersService = new MySQLUsersService(connection);
        const classesService = new MySQLClassesService(connection);
        const peersService = new MySQLPeersService(connection);
        const suggestionsService = new MySQLSuggestionsService(connection);
        const roomsService = new MySQLRoomsService(connection);
        const roomMemberService = new MySQLRoomMemberService(connection);
        const messagesService = new MySQLMessagesService(connection);
        const socketService = new MySQLSocketService(connection);

        await usersService.init();
        await classesService.init();
        await peersService.init();
        await suggestionsService.init();
        await roomsService.init();
        await roomMemberService.init();
        await messagesService.init();
        await socketService.init();

        ServiceLocator.setService(UsersService.name, usersService);
        ServiceLocator.setService(ClassesService.name, classesService);
        ServiceLocator.setService(PeersService.name, peersService);
        ServiceLocator.setService(SuggestionsService.name, suggestionsService);
        ServiceLocator.setService(RoomsService.name, roomsService);
        ServiceLocator.setService(RoomMemberService.name, roomMemberService);
        ServiceLocator.setService(MessagesService.name, messagesService);
        ServiceLocator.setService(SocketService.name, socketService);

        console.log("UsersService initialized");
        console.log("ClassesService initialized");
        console.log("PeersService initialized");
        console.log("SuggestionsService initialized");
        console.log("RoomsService initialized");
        console.log("RoomsMemberService initialized");
        console.log("MessagesService initialized");
        console.log("SocketService initialized");
        console.log("Database set up complete");
    } catch(e){
        throw new Error("Failed to setup database.");
    }
    
    
};



const main = () => {


    

    app.use(function(req, res) {
        res.status(400);
        res.send("Bad Request!");
    });

    app.listen(process.env.PORT || PORT, () => {
        console.log(`Listening on PORT ${PORT}`);
    });
    
};

(
    async () => {
        try{
            await databaseSetup();
            main();
        }catch(e){
            console.log(e);
            process.exit(-1);
        }
    }
    
)();

// const express = require("express");
// const cors = require("cors");
// const http = require("http");
// const socketIO = require("socket.io"); 

// // setup the PORT our backend app will run on
// const PORT = 5050;
// const NEW_MESSAGE_EVENT = "new-message-event";

// const app = express();
// const server = http.createServer(app);

// const io = socketIO(server, {
//   cors: true,
//   origins:["localhost:3000"]
// });

// app.use(cors());

// // Hardcoding a room name here. This is to indicate that you can do more by creating multiple rooms as needed.
// const room = "general"

// io.on("connection", (socket) => {
//   socket.join(room);

//   socket.on(NEW_MESSAGE_EVENT, (data) => {
//     io.in(room).emit(NEW_MESSAGE_EVENT, data);
//   });

//   socket.on("disconnect", () => {
//     socket.leave(room);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`listening on *:${PORT}`);
// });