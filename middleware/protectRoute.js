const jwt = require("jsonwebtoken");
const User = require("../models/user.model");




const ProtectRoute = async (req, res, next) => {
    


    try {
       

        const token = req.cookies.jwt;
        


        if (!token) {
          return res.status(401).json({ error: "unauthorized - No Token Provided" });
        


        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if (!decoded) {
                return res.status(401).json({ error: "unauthorized - Ivaild Provided" });

            }

            const user = await User.findById(decoded.userID).select("-password")
            if (!user) {
                res.status(404).json({ error: "User Not found" });

            }
            req.user = user

            next();
            
        } catch (error) {
            
            return res.status(401).json({ error: "unauthorized - No Token Provided" });
            
        }



   

    } catch (error) {
        res.status(500).json({ error: "protectroute.js Internal server error  "+error });
    }

}

module.exports = ProtectRoute;
