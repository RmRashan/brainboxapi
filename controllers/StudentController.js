import bcryptjs from "bcrypt";
import genarateToken from "../utils/genarateToken.js";
import connection from "../utils/DBConnection.js";
import { CreateCurrentFullDate } from "../utils/DateTimeCreation.js";


export const studentLogin = async (req, res) => {
    try {
        const { email, password } = await req.body;

        // mysql query bind = email
        var emailq = { email: email };
        // console.log(emailq)

        connection.query("SELECT * FROM students WHERE ?", emailq, (err, results) => {
            if (err) {
                console.error("DBerror executing query:" + err);

            }

            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const user = results[0];

            // Compare passwords using bcrypt
            bcryptjs.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error("bcryptjs :" + err)
                }
                if (isMatch) {
                    const token = genarateToken(user.id, password, res);
                    return res.status(200).json({ success: "Login successfull !", token: token });
                } else {
                    // Invalid password
                    res.status(401).json({ error: "Invalid email or password" });
                }
            });
        });
    } catch (error) {
        console.log("login controller" + error.message);
    }
};


export const studentSignup = async (req, res) => {
    try {
        // get body data
        const {
            firstName,
            lastName,
            email,
            mobile,
            grade,
            password,
            gender,
            promoCode,
        } = req.body;


        //Hash Password
        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt);

        // mysql query bind = email
        var mobile_check = { mobile: mobile };
        var email_check = { email: email };

        connection.query(
            "SELECT COUNT(*) AS ex  FROM students WHERE ?",
            mobile_check,
            (err, results) => {

                if (err) {
                    console.error("DBerror executing query:", err);
                    return res
                        .status(500)
                        .json({ DBerror: "Error executing query:" + err });
                }
                // check user alredy exists
                const exists = results[0].ex;
                if (exists > 0) {
                    return res.status(409).json({ error: "This Mobile Number already exists!" });
                } else {


                    connection.query(
                        "SELECT COUNT(*) AS ex  FROM students WHERE ?",
                        email_check,
                        (err, results) => {
                            if (err) {
                                console.error("DBerror executing query:", err);
                                return res
                                    .status(500)
                                    .json({ DBerror: "Error executing query:" + err });
                            }
                            // check user alredy exists
                            const exists = results[0].ex;
                            if (exists > 0) {
                                return res.status(409).json({ error: "This Email already exists!" });
                            } else {

                                const query = 'SELECT id FROM students ORDER BY id DESC LIMIT 1';
                                connection.query(query, (err, results) => {
                                    if (err) throw err;

                                    let studentID;
                                    try {
                                        let lastid = results[0].id
                                        const removeFirstThreeLetter = lastid.slice(3);
                                        const intID = parseInt(removeFirstThreeLetter);
                                        let newId = intID + 1;

                                        let addZero = "0";

                                        for (let i = intID.toString().length; i <= 3; i++) {
                                            addZero += "0";
                                        }
                                        studentID = "BS-" + addZero + newId;



                                    } catch (error) {
                                        console.log("student ID Creation : " + error)

                                    }

                                    let date = CreateCurrentFullDate()

                                    const valuesToInsert = [
                                        studentID,
                                        firstName,
                                        lastName,
                                        email,
                                        mobile,
                                        hashedpassword,
                                        2,
                                        date,
                                        grade,
                                        1,
                                        gender
                                    ];

                                    connection.query(
                                        "INSERT INTO students (`ID`,`first_name`, `last_name`, `email`,`mobile`,`password`,`status_id`,`created_time`,`grades_or_levels_id`,`student_type_id`,`gender_id`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                                        valuesToInsert,
                                        (err, results) => {
                                            if (err) {
                                                console.error("DBerror executing query:", err);
                                                return res
                                                    .status(500)
                                                    .json({ DBerror: "Error executing query:" + err });
                                            }

                                            const token = genarateToken(studentID, password, res);
                                            return res
                                                .status(200)
                                                .json({ success: "Registration successfull !", token: token });
                                        }
                                    );
                                });
                            }
                        }
                    );

                }
            }
        );




    } catch (error) {
        console.log("signup controller try catch" + error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const studentProfile = async (req, res) => {
    try {
        // console.log(req.user)
        const id = await req.user;

        // mysql query bind = email
        var userID = { id: id };

        connection.query("SELECT * FROM students WHERE ?", userID, (err, results) => {
            if (err) {
                console.error("DBerror executing query:", err);

            }

            if (!results) {
                return res.status(401).json({ unauthorized: "Invalid email or password" });
            }

            const user = results[0];

            const dateString = user.created_time;
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString();
            
            const userObj = {
                id: user.id,
                firstName: user.first_name,
                middle_name: user.middle_name,
                lastName: user.last_name,
                nameCertificate: user.name_on_certificate,
                mobile: user.mobile,
                address: user.address,
                date_of_birth: user.date_of_birth,
                gender_id: user.gender_id,
                zipcode: user.zipcode,
                joinedDate: formattedDate,
                grade: user.grades_or_levels_id,
            }
            // console.log(userObj)

            return res.status(200).json({ student: userObj });


        });
    } catch (error) {
        console.log("login controller" + error);
    }
};

export const studentProfileEdite = async (req, res) => {
    try {
        const id = await req.user;
        const { firstName, lastName, mobile, nameCertificate, address, zipcode, birth, middle_name } = req.body

        // mysql query bind = email
        var user = {
            first_name: firstName,
            middle_name: middle_name,
            last_name: lastName,
            mobile: mobile,
            name_on_certificate: nameCertificate,
            address: address,
            zipcode: zipcode,
            date_of_birth: birth,


        };
        var userID = {
            id: id

        }


        connection.query("UPDATE students SET ? WHERE ?",[user,userID], (err, results) => {
            if (err) {
                console.error("DBerror executing query:", err);

            }

            if (!results) {
                return res.status(401).json({ unauthorized: "unauthorized" });
            }


            console.log(user)

            // return res.status(200).json({ student: userObj });


        });
    } catch (error) {
        console.log("login controller" + error);
    }
};

