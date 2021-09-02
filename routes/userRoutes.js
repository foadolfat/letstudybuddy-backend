var express = require(`express`)
var router = express.Router();
const ServiceLocator = require("../services/ServiceLocator");
const UsersService = require("../services/UsersService");
const authService = require("../services/AuthService");

//USER ROUTES
router
    .use(function timeLog(req, res, next) {
        console.log('Access user Time: ', Date.now());
        next();
    })

    .post("/user", authService.encrypt, async(req, res) => {

        /**
         * @type {UsersService}
         */
        const usersService = ServiceLocator.getService(UsersService.name);

        try{
            const { payload: user, error } = await usersService.createUser(req.body, req.hash);
            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json(
                        {
                            message:"User Created",
                            USERNAME:user.USERNAME,
                            EMAIL:user.EMAIL,
                            FNAME:user.FNAME,
                            LNAME:user.LNAME,
                            MAJOR:user.MAJOR,
                            DEGREE:user.DEGREE,
                            EXPECTED_GRAD:user.EXPECTED_GRAD,
                            GPA:user.GPA,
                            IMG:user.IMG,
                            USER_ID:user.USER_ID
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }
        
        
    })

    .delete("/user", authService.verifyToken, async(req, res) => {

        /**
         * @type {UsersService}
         */
        const usersService = ServiceLocator.getService(UsersService.name);

        try{
            const { payload: message, error } = await usersService.deleteUser(req.body.user_id);

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

    .put("/user", authService.verifyToken, async(req, res) => {

        /**
         * @type {UsersService}
         */
        const usersService = ServiceLocator.getService(UsersService.name);

        try{
            const { payload: user, error } = await usersService.updateUser(req.body, req.user_id);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            USER_NAME:user.USERNAME,
                            EMAIL:user.EMAIL,
                            FNAME:user.FNAME,
                            LNAME:user.LNAME,
                            MAJOR:user.MAJOR,
                            DEGREE:user.DEGREE,
                            EXPECTED_GRAD:user.EXPECTED_GRAD,
                            GPA:user.GPA,
                            IMG:user.IMG,
                            USER_ID:user.USER_ID
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    })

    .get("/user", authService.verifyToken, async(req, res) => {

        /**
         * @type {UsersService}
         */
        const usersService = ServiceLocator.getService(UsersService.name);

        try{
            const { payload: user, error } = await usersService.getUser(req.user_id, req.body.username, req.body.email);

            if(error) {
                res.status(400).json(error);
            } else {
                res
                    .status(200)
                    .json(
                        {
                            USERNAME:user.USERNAME,
                            EMAIL:user.EMAIL,
                            FNAME:user.FNAME,
                            LNAME:user.LNAME,
                            MAJOR:user.MAJOR,
                            DEGREE:user.DEGREE,
                            EXPECTED_GRAD:user.EXPECTED_GRAD,
                            GPA:user.GPA,
                            IMG:user.IMG,
                            USER_ID:user.USER_ID
                        }
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }

    });

module.exports = router;