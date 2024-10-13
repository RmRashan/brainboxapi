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


}



const logout = (req, res) => {



}




module.exports = { login, signup, logout };