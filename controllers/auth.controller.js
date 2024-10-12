const bcryptjs = require('bcryptjs')
const connection = require('../utils/DBConnection');




const signup = async (req, res) => {
    try {

        const { firstName, lastName, email, mobile, password, promoCode, password_confirmation, terms } = await req.body;


        connection.query("SELECT COUNT(*) AS exists FROM users WHERE email = ?", [ email], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }

            const exists = results[0].exists;
            if (exists > 0) {
                console.log('User already exists!');
            } else {
                console.log('User does not exist!');
            }
        });



        //Hash Password
        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt)


        const valuesToInsert = [firstName, lastName, email, mobile, hashedpassword,1];

        connection.query("INSERT INTO users (first_name, last_name, email,imobile,password,payment_receipt,user_type_id) VALUES (?, ?, ?,?,?,?,?)", valuesToInsert, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                return;
            }

            console.log('New row inserted with ID:', results.insertId);
        });
      

    } catch (error) {
        console.log("signup controller" + error);
        res.status(500).json({ error: "Internal Server Error" });
    }


}


const login = async (req, res) => {
    // console.log(req) 


}



const logout = (req, res) => {



}




module.exports = { login, signup, logout };