var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const NotificationService = require("../services/NotificationService");
const authService = require("../services/AuthService");

//NOTIFICATION ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access notification Time: ', Date.now());
        next();
    })
    .post("/notification", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: notifications, error } = await notificationService.createNotification(req.user_id, req.body.room_id, req.body.event_key, req.body.num);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            notifications: notifications
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, create/notification");
            res.status(500).end();
        }

    })
    .delete("/notificationByEvent", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: result, error } = await notificationService.deleteNotificationByEvent(req.user_id, req.body.room_id, req.body.event_key);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            message: result
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, deletebyevent/notification");
            res.status(500).end();
        }

    })
    .delete("/notificationByRoom/:room_id", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: result, error } = await notificationService.deleteNotificationByRoom(req.user_id, req.params.room_id);

            if(error) {
                console.log(error)
                res.status(400).json(error);
            } else {

                res
                    .status(200)
                    .json(
                        {
                            message: result
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, deletebyroom/notification", e);
            res.status(500).end();
        }

    })
    .delete("/notificationByUser", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: result, error } = await notificationService.deleteNotificationByUser(req.user_id);

            if(error) {
                console.log(error)
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            message: result
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, deletebyuser/notification");
            res.status(500).end();
        }

    })
    .put("/notification", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: notification, error } = await notificationService.updateNotification(req.user_id, req.body.room_id, req.body.event_key, req.body.num);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            notification: notification
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, update/notification");
            res.status(500).end();
        }

    })
    .get("/notification", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: notification, error } = await notificationService.getNotificationsByRoom(req.user_id, req.body.room_id, req.body.event_key);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            notification: notification
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, get/notification");
            res.status(500).end();
        }

    })
    .get("/notificationByRoom", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: notifications, error } = await notificationService.getNotificationsByRoom(req.user_id, req.body.room_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            notifications: notifications
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, getbyroom/notification");
            res.status(500).end();
        }

    })
    .get("/notificationByUser", authService.verifyToken, async(req, res) => {

        /**
         * @type {NotificationService}
         */
        const notificationService = ServiceLocator.getService(NotificationService.name);

        try{
            const { payload: notifications, error } = await notificationService.getNotificationsByUser(req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            notifications: notifications
                        }
                    );
            }
        }catch(e){
            console.log("an error occured in notificationRoute, getbyuser/notification");
            res.status(500).end();
        }

    });



    
module.exports = router;