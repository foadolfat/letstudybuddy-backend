var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const PeersService = require("../services/PeersService");
const authService = require("../services/AuthService");
    
//PEER ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access peers Time: ', Date.now());
        next();
    })
    .post("/peers", authService.verifyToken, async(req, res) => {

        /**
         * @type {PeersService}
         */
        const peersService = ServiceLocator.getService(PeersService.name);

        try{
            const { payload: peers, error } = await peersService.createPeer(req.body, req.user_id, req.body.peer_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json(
                        peers
                    );
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
            const { payload: peers, error } = await peersService.getPeer(req.user_id, req.body.peer_id);

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