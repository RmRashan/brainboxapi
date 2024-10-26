import jwt  from "jsonwebtoken";
import bcryptjs from "bcrypt";
import connection from "../../utils/DBConnection.js";





 const ProtectRoute = async (req, res, next) => {

    try {

        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ error: "unauthorized - No Token Provided 1" });

        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if (!decoded) {
                return res.status(401).json({ error: "unauthorized - Ivaild Provided 2" });

            }

            const userId = decoded.userID;
            const password = decoded.userPassowrd;

            var id = { id: userId };


            connection.query("SELECT * FROM students WHERE ?", id, (err, results) => {
                if (err) {
                    console.error("DBerror executing query:", err);

                }

                if (results.length === 0) {
                    return res.status(404).json({ error: "User Not found" });

                }

                const user = results[0];

                // Compare passwords using bcrypt
                bcryptjs.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.error("bcryptjs :" + err)
                    }
                    if (isMatch) {
                        // req.user = user

                        
                        res.status(200).json({ success: "Login successfull !", user: user.id });
                        // next();
                    } else {
                        return res.status(401).json({ error: "Invalid email or password" });
                    }
                });
            });


            // req.user = user



        } catch (error) {


            return res.status(401).json({ error: "unauthorized - No Token Provided 33"+error });

        }





    } catch (error) {
        console.log( "protectroute.js Internal server error  " + error )
        // res.status(500).json({ error: "protectroute.js Internal server error  " + error });
    }

}

export default ProtectRoute;
