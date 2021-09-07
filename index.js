const express = require("express");
const MySQLUsersService = require("./services/MySQL/MySQLUsersService");
const MySQLClassesService = require("./services/MySQL/MySQLClassesService");
const MySQLPeersService = require("./services/MySQL/MySQLPeersService");
const MySQLSuggestionsService = require("./services/MySQL/MySQLSuggestionsService");
const MySQLRoomsService = require("./services/MySQL/MySQLRoomsService");
const MySQLRoomMemberService = require("./services/MySQL/MySQLRoomMemberService");
const MySQLMessagesService = require("./services/MySQL/MySQLMessagesService");
const MySQLSocketService = require("./services/MySQL/MySQLSocketService");
const MySQLNotificationService = require("./services/MySQL/MySQLNotificationService");
const ServiceLocator = require("./services/ServiceLocator");
const UsersService = require("./services/UsersService");
const ClassesService = require("./services/ClassesService");
const PeersService = require("./services/PeersService");
const SuggestionsService = require("./services/SuggestionsService");
const RoomsService = require("./services/RoomsService");
const RoomMemberService = require("./services/RoomMemberService");
const MessagesService = require("./services/MessagesService");
const SocketService = require("./services/SocketService");
const NotificationService = require("./services/NotificationService");



const app = express();
app.use(require('cors')());
const PORT = process.env.PORT || 5050;

const { socketConnection } = require('./services/IOService');


const http = require("http");

const server = http.createServer(app);
socketConnection(server);




app.use(express.json());
app.use(require(`./routes/userRoutes`));
app.use(require(`./routes/classesRoutes`));
app.use(require(`./routes/peersRoutes`));
app.use(require(`./routes/signInRoute`));
app.use(require(`./routes/suggestionsRoute`));
app.use(require(`./routes/roomsRoute`));
app.use(require(`./routes/roomMemberRoute`));
app.use(require(`./routes/messagesRoute`));
app.use(require(`./routes/notificationRoute`));



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
    
    try{
        await mysqlCMD;
        const connection = require("mysql").createPool({
            // connectionLimit : 100,
            // host: "localhost",
            // user:"root",
            // database:"study"
            connectionLimit : 10,
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
        const notificationService = new MySQLNotificationService(connection);

        await usersService.init();
        await classesService.init();
        await peersService.init();
        await suggestionsService.init();
        await roomsService.init();
        await roomMemberService.init();
        await messagesService.init();
        await socketService.init();
        await notificationService.init();

        ServiceLocator.setService(UsersService.name, usersService);
        ServiceLocator.setService(ClassesService.name, classesService);
        ServiceLocator.setService(PeersService.name, peersService);
        ServiceLocator.setService(SuggestionsService.name, suggestionsService);
        ServiceLocator.setService(RoomsService.name, roomsService);
        ServiceLocator.setService(RoomMemberService.name, roomMemberService);
        ServiceLocator.setService(MessagesService.name, messagesService);
        ServiceLocator.setService(SocketService.name, socketService);
        ServiceLocator.setService(NotificationService.name, notificationService);

        console.log("UsersService initialized");
        console.log("ClassesService initialized");
        console.log("PeersService initialized");
        console.log("SuggestionsService initialized");
        console.log("RoomsService initialized");
        console.log("RoomsMemberService initialized");
        console.log("MessagesService initialized");
        console.log("SocketService initialized");
        console.log("NotificationService initialized");
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
    server.listen(PORT, () => {
        console.log(`listening on *:${PORT}`);
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

