const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const ServiceLocator = require("../services/ServiceLocator");
const UsersService = require("../services/UsersService");
const saltRounds = 10;
const secret= "super-duper-secret";

async function authenticate(req, res, next){
    /**
    * @type {UsersService}
    */
    const usersService = ServiceLocator.getService(UsersService.name);

    try{
        const { payload: user, error } = await usersService.getUser(req.body.user_id, req.body.username, req.body.email);

        if(error) {
            res.status(400).json(error);
        } else {
            bcrypt.compare(req.body.password, user.PASS, function(err, result) {
                if(err) {
                    res.status(500).send("Internal Error");
                    return;
                }
                req.auth = result;
                if(result){
                    req.token = jwt.sign({ id: user.USER_ID }, secret, {
                        expiresIn: 86400 // 24 hours
                    });
                }
                next();
            });
        }
     }catch(e){
         console.log("an error occured");
         res.status(500).end();
     }
};

function encrypt(req, res, next){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err) {
            res.status(500).send("Internal Error");
            throw err;
        }
        req.hash = hash;
        next();
    });
};

function verifyToken(req, res, next) {
    let token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.user_id = decoded.id;
      next();
    });
};



module.exports = {
    authenticate : authenticate,
    encrypt : encrypt,
    verifyToken : verifyToken
}