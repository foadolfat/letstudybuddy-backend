var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const RoomMemberService = require("../services/RoomMemberService");
const authService = require("../services/AuthService");


//ROOM MEMBER ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access roomMember Time: ', Date.now());
        next();
    })

    .post("/roomMember", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomMemberService}
         */
        const roomMemberService = ServiceLocator.getService(RoomMemberService.name);

        try{
            const { payload: roomMember, error } = await roomMemberService.createRoomMember(req.body);
            console.log(roomMember)
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json(
                        {
                            roomMember
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }
        
        
    })

    .delete("/roomMember", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomMemberService}
         */
        const roomMemberService = ServiceLocator.getService(RoomMemberService.name);

        try{
            const { payload: message, error } = await roomMemberService.deleteRoomMember(req.body);

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

    .put("/roomMember", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomMemberService}
         */
        const roomMemberService = ServiceLocator.getService(RoomMemberService.name);

        try{
            const { payload: roomMember, error } = await roomMemberService.updateRoomMember(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            roomMember
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .get("/roomMember", authService.verifyToken, async(req, res) => {

        /**
         * @type {RoomMemberService}
         */
        const roomMemberService = ServiceLocator.getService(RoomMemberService.name);

        try{
            const { payload: roomMember, error } = await roomMemberService.getRoomMember(req.body);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            roomMember
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    });

module.exports = router;