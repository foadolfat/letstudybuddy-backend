var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const PeersService = require("../services/PeersService");
const RoomsService = require("../services/RoomsService");
const RoomMemberService = require("../services/RoomMemberService");
const authService = require("../services/AuthService");
    
//PEER ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access peers Time: ', Date.now());
        next();
    })

    //Posting a peer happens when current user swipes right
    //A peer is created with the id of the swiped user, if one doesn't exist
    //We check to see if the swiped user has previously swiped right on current user
    //If so, we create a room and assign current and swiped user's ids to the members
    //Otherwise we send back the peer without creating a room
    //This ensures rooms are only created after a match between two users who swiped right on each other
    .post("/peers", authService.verifyToken, async(req, res) => {

        /**
         * @type {PeersService}
         */
        const peersService = ServiceLocator.getService(PeersService.name);
        const roomsService = ServiceLocator.getService(RoomsService.name);
        const roomMemberService = ServiceLocator.getService(RoomMemberService.name);

        try{

            //Create peer
            const { payload: peers, error } = await peersService.createPeer(req.body, req.user_id, req.body.peer_id);
            if(error) {
                res.status(400).json(error);
            } else { 
                //Check if peer has already liked user
                const { payload: peer, error } = await peersService.getPeer(req.body.peer_id, req.user_id );
                if(error){
                    res
                        .status(201)
                        .json(
                            peers
                        );
                    
                } else {
                    //Create room
                    const { payload: room, error } = await roomsService.createRoom();
                    if(error){
                        res.status(400).json(error);
                    } else {

                        //Create user room member 
                        const { payload: roomMember, error } = await roomMemberService.createRoomMember({
                            room_id:room.insertId,
                            user_id:req.user_id
                        });
                        if(error){
                            res.status(400).json(error);
                        } else {

                            //Create peer room member 
                            const { payload: roomMember, error } = await roomMemberService.createRoomMember({
                                room_id:room.insertId,
                                user_id:req.body.peer_id
                            });
                            if(error){
                                res.status(400).json(error);
                            } else {
                                //console.log("it's a match ",peers)
                                res
                                    .status(201)
                                    .json(
                                        peers
                                    );
                                }
                            }
                        }
                    }
        
                
            }
        }catch(e){
            console.log("an error occured", e);
            res.status(500).end();
        }
        
        
    })

    .delete("/peers", authService.verifyToken, async(req, res) => {

        /**
         * @type {PeersService}
         */
        const peersService = ServiceLocator.getService(PeersService.name);

        try{
            const { payload: message, error } = await peersService.deletePeer(req.user_id, req.body.peer_id);

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

    .get("/peers", authService.verifyToken, async(req, res) => {

        /**
         * @type {PeersService}
         */
        const peersService = ServiceLocator.getService(PeersService.name);

        try{
            const { payload: peers, error } = await peersService.getPeers(req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            peers
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }
    
    })

    .put("/peers", authService.verifyToken, async(req, res) => {

        /**
         * @type {PeersService}
         */
        const peersService = ServiceLocator.getService(PeersService.name);

        try{
            const { payload: peers, error } = await peersService.updatePeer(req.body, req.user_id, req.body.peer_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            peers
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }
    
    });

module.exports = router;