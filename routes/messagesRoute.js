var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const MessagesService = require("../services/MessagesService");
const authService = require("../services/AuthService");


//Message ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access messages Time: ', Date.now());
        next();
    })
    .post("/message", authService.verifyToken, async(req, res) => {

        /**
         * @type {MessagesService}
         */
        const messagesService = ServiceLocator.getService(MessagesService.name);

        try{
            const { payload: message, error } = await messagesService.createMessage(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json(
                        message
                    );
            }
        }catch(e){
            console.log("an error occured", e);
            res.status(500).end();
        }
        
        
    })

    .delete("/messages", authService.verifyToken, async(req, res) => {

        /**
         * @type {MessagesService}
         */
        const messagesService = ServiceLocator.getService(MessagesService.name);

        try{
            const { payload: message, error } = await messagesService.deleteMessages(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            message: message
                        }
                    );
            }
        }catch(e){
            console.log("an error occured", e);
            res.status(500).end();
        }

    })

    .delete("/message", authService.verifyToken, async(req, res) => {

        /**
         * @type {MessagesService}
         */
        const messagesService = ServiceLocator.getService(MessagesService.name);

        try{
            const { payload: message, error } = await messagesService.deleteMessages(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            message: message
                        }
                    );
            }
        }catch(e){
            console.log("an error occured", e);
            res.status(500).end();
        }

    })

    .post("/messages/user", authService.verifyToken, async(req, res) => {

        /**
         * @type {MessagesService}
         */
        const messagesService = ServiceLocator.getService(MessagesService.name);

        try{
            const { payload: messages, error } = await messagesService.getUserMessages(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {

                res
                    .status(200)
                    .json(
                        {
                            messages
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .post("/messages/room", authService.verifyToken, async(req, res) => {

        /**
         * @type {MessagesService}
         */
        const messagesService = ServiceLocator.getService(MessagesService.name);

        try{
            const { payload: messages, error } = await messagesService.getRoomMessages(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                //console.log(messages)
                res
                    .status(200)
                    .json(
                        {
                            messages
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .put("/messages", authService.verifyToken, async(req, res) => {

        /**
         * @type {MessagesService}
         */
        const messagesService = ServiceLocator.getService(MessagesService.name);

        try{
            const { payload: message, error } = await messagesService.updateMessages(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            message
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    });

module.exports = router;