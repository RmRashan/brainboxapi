const bcryptjs = require('bcryptjs')
const connection = require('../utils/DBConnection');
const genarateToken = require('../utils/genarateToken');




const signup = async (req, res) => {

    try {

        // get body data
        const { firstName, lastName, email, mobile, password, promoCode, password_confirmation,  userType } = await req.body;


        //Hash Password
        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt)


        // mysql query bind = email
        var emailq = { email: email }

        connection.query("SELECT COUNT(*) AS ex  FROM users WHERE ?", emailq, (err, results) => {
            if (err) {
                console.error('DBerror executing query:', err);
                return res.status(500).json({ DBerror: 'Error executing query:' + err });
            }

            // check user alredy exists
            const exists = results[0].ex
            if (exists > 0) {
                return res.status(409).json({ error: "User already exists!" });

            } else {

                const valuesToInsert = [firstName, lastName, email, mobile, hashedpassword, 'okyre', userType];

                connection.query("INSERT INTO users (`first_name`, `last_name`, `email`,`mobile`,`password`,`payment_receipt`,`user_type`) VALUES (?, ?, ?,?,?,?,?)", valuesToInsert, (err, results) => {
                    if (err) {
                        console.error('DBerror executing query:', err);
                        return res.status(500).json({DBerror:'Error executing query:' + err });
                    }

                    genarateToken(results.insertId, res)
                    return res.status(200).json({success: "Registration successfull !" })
                    // console.log('New row inserted with ID:', results.insertId);
                });
            }
        });


    } catch (error) {
        console.log("signup controller try catch" + error);
        return res.status(500).json({ error: "Internal Server Error" });
    }


}


const login = async (req, res) => {
    // console.log(req) 

    try {

        const { email, password } = await req.body;

        // mysql query bind = email
        var emailq = { email: email }

        connection.query("SELECT * FROM users WHERE ?", emailq, (err, results) => {
            if (err) {
                console.error('DBerror executing query:', err);
                return res.status(500).json({ DBerror: 'Error executing query:' + err });
            }




            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = results[0];


            // Compare passwords using bcrypt
            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    res.status(500).json({ error: 'bcryptjs :' + err });

                }
                if (isMatch) {
                    genarateToken(user._id, res)
                    return res.status(200).json({ success: "Login successfull !" })

                } else {
                    // Invalid password
                    res.status(401).json({ error: 'Invalid email or password' });
                }
            });


        });


    } catch (error) {
        console.log("login controller" + error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }


}


const logout = (req, res) => {



}




module.exports = { login, signup, logout };