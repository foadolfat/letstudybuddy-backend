var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const ClassesService = require("../services/ClassesService");
const authService = require("../services/AuthService");


//CLASS ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access classes Time: ', Date.now());
        next();
    })
    .post("/classes", authService.verifyToken, async(req, res) => {

        /**
         * @type {ClassesService}
         */
        const classesService = ServiceLocator.getService(ClassesService.name);

        try{
            const { payload: classes, error } = await classesService.createClass(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json(
                        classes
                    );
            }
        }catch(e){
            console.log("an error occured", e);
            res.status(500).end();
        }
        
        
    })

    .delete("/classes", authService.verifyToken, async(req, res) => {

        /**
         * @type {ClassesService}
         */
        const classesService = ServiceLocator.getService(ClassesService.name);

        try{
            const { payload: message, error } = await classesService.deleteClass(req.user_id, req.body.class_name, req.body.school);

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

    .get("/classes", authService.verifyToken, async(req, res) => {

        /**
         * @type {ClassesService}
         */
        const classesService = ServiceLocator.getService(ClassesService.name);

        try{
            const { payload: classes, error } = await classesService.getClasses(req.user_id);

            if(error) {
                res.status(200).json(error);
            } else {
                
                res
                    .status(200)
                    .json(
                        {
                            classes
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .get("/peer_classes/:peer_id", authService.verifyToken, async(req, res) => {

        /**
         * @type {ClassesService}
         */
        const classesService = ServiceLocator.getService(ClassesService.name);

        try{
            const { payload: classes, error } = await classesService.getPeerClasses(req.user_id, req.params.peer_id);

            if(error) {
                res.status(200).json(error);
            } else {
                
                res
                    .status(200)
                    .json(
                        {
                            classes
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .put("/classes", authService.verifyToken, async(req, res) => {

        /**
         * @type {ClassesService}
         */
        const classesService = ServiceLocator.getService(ClassesService.name);

        try{
            const { payload: classes, error } = await classesService.updateClass(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            classes
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    });

module.exports = router;