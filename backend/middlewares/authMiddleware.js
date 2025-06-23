const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ****MIDDLEWARE TO PROTECT ROUTES****//

const protect = async (req, res, next) =>{
    try{
        let token = req.headers.authorization;
        if(token && token.startWith("Bearer")){
            token = token.split("")[1]; //Extract token
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }else{
            res.status(401).json({message:"Not authorized, token failed"});
        }
    }catch(error){
        res.status(401).json({message:"Not authorized, token failed",error: error.message});
    }
};

module.exports = {protect};