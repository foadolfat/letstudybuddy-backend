var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const RoomsService = require("../services/RoomsService");
const authService = require("../services/AuthService");


//ROOMS ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access rooms Time: ', Date.now());
        next();
    })

    .post("/rooms", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomsService}
         */
        const roomsService = ServiceLocator.getService(RoomsService.name);

        try{
            const { payload: room, error } = await roomsService.createRoom();
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json(
                        {
                            room_id:room.insertId
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }
        
        
    })

    .delete("/rooms", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomsService}
         */
        const roomsService = ServiceLocator.getService(RoomsService.name);

        try{
            const { payload: message, error } = await roomsService.deleteRoom(req.body.room_id);

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
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .put("/rooms", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomsService}
         */
        const roomsService = ServiceLocator.getService(RoomsService.name);

        try{
            const { payload: room, error } = await roomsService.updateRoom(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            room
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .get("/rooms", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomsService}
         */
        const roomsService = ServiceLocator.getService(RoomsService.name);

        try{
            const { payload: room, error } = await roomsService.getRoom(req.body.room_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            room
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    });

module.exports = router;