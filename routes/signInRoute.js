var express = require(`express`)
var router = express.Router();
const authService = require("../services/AuthService") 

router
    .use(function timeLog(req, res, next) {
        console.log('Access signin Time: ', Date.now());
        next();
    })

    .post("/signin", authService.authenticate, async(req, res) => {
        if(req.auth){
            res.status(200).json({accessToken:req.token});
        }
        else{
            res.status(400).json({message:"Unauthorized"});
        }
    })
    
    module.exports = router;

