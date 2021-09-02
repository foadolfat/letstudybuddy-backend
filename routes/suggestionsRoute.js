var express = require(`express`)
var router = express.Router();
const authService = require("../services/AuthService") 
const ServiceLocator = require("../services/ServiceLocator");
const SuggestionsService = require("../services/SuggestionsService");

//SUGGESTIONS ROUTE
router
    .use(function timeLog(req, res, next) {
        console.log('Access suggestions Time: ', Date.now());
        next();
    })

    .post("/suggestions", authService.verifyToken, async(req, res) => {

        /**
         * @type {SuggestionsService}
         */
        const suggestionsService = ServiceLocator.getService(SuggestionsService.name);

        try{
            const { payload: suggestions, error } = await suggestionsService.createSuggestion(req.user_id);
            if(error) {
                console.log(error);
                res.status(400).json(error);
            } else {
                res
                    .status(201)
                    .json(
                        suggestions
                    );
            }
        }catch(e){
            console.log("an error occured");
            res.status(500).end();
        }
        
        
    })
    
    module.exports = router;