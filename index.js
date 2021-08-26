const express = require("express");
const MySQLUsersService = require("./services/MySQL/MySQLUsersService");
const MySQLClassesService = require("./services/MySQL/MySQLClassesService");
const MySQLPeersService = require("./services/MySQL/MySQLPeersService");
const MySQLSuggestionsService = require("./services/MySQL/MySQLSuggestionsService");
const ServiceLocator = require("./services/ServiceLocator");
const UsersService = require("./services/UsersService");
const ClassesService = require("./services/ClassesService");
const PeersService = require("./services/PeersService");
const SuggestionsService = require("./services/SuggestionsService");
const app = express();
app.use(require('cors')());
const socketIo = require("socket.io");

const port = 5050;

app.use(express.json());
app.use(require(`./routes/userRoutes`));
app.use(require(`./routes/classesRoutes`));
app.use(require(`./routes/peersRoutes`));
app.use(require(`./routes/signInRoute`));
app.use(require(`./routes/suggestionsRoute`));


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
            connectionLimit : 100,
            host: "localhost",
            user:"root",
            database:"study"
        });
        const usersService = new MySQLUsersService(connection);
        const classesService = new MySQLClassesService(connection);
        const peersService = new MySQLPeersService(connection);
        const suggestionsService = new MySQLSuggestionsService(connection);

        await usersService.init();
        await classesService.init();
        await peersService.init();
        await suggestionsService.init();

        ServiceLocator.setService(UsersService.name, usersService);
        ServiceLocator.setService(ClassesService.name, classesService);
        ServiceLocator.setService(PeersService.name, peersService);
        ServiceLocator.setService(SuggestionsService.name, suggestionsService);

        console.log("UsersService initialized");
        console.log("ClassesService initialized");
        console.log("PeersService initialized");
        console.log("SuggestionsService initialized");
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

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
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