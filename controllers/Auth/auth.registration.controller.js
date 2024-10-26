import bcryptjs from "bcrypt";

import connection from "../../utils/DBConnection.js";
import genarateToken from "../../utils/genarateToken.js";
import { CreateCurrentFullDate } from "../../utils/DateTimeCreation.js";

export const studentSignup = async (req, res) => {
  try {
    // get body data
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      promoCode,
      password_confirmation,
      userType,
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

                    let addZero="0";
                 
                    for(let i = intID.toString().length; i <= 3; i++) {
                      addZero += "0";
                    }
                    studentID = "BS-" + addZero + newId;
                   


                  } catch (error) {
                    console.log("student ID Creation : "+error)
                    
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
                    1,
                    1
                  ];

                  connection.query(
                    "INSERT INTO students (`ID`,`first_name`, `last_name`, `email`,`mobile`,`password`,`status_id`,`created_time`,`grades_or_levels_id`,`student_type_id`) VALUES (?,?,?,?,?,?,?,?,?,?)",
                    valuesToInsert,
                    (err, results) => {
                      if (err) {
                        console.error("DBerror executing query:", err);
                        return res
                          .status(500)
                          .json({ DBerror: "Error executing query:" + err });
                      }

                      genarateToken(results.insertId,hashedpassword, res);
                      return res
                        .status(200)
                        .json({ success: "Registration successfull !" });
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


export const agentSignup = async (req, res) => {
  try {
    // get body data

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      promoCode,
      password_confirmation,
      userType,
    } = req.body;

    //Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);

    // mysql query bind = email
    var mobile_check = { mobile: mobile };

    connection.query(
      "SELECT COUNT(*) AS ex  FROM users WHERE ?",
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
          return res.status(409).json({ error: "User already exists!" });
        } else {
          const valuesToInsert = [
            firstName,
            lastName,
            email,
            mobile,
            hashedpassword,
            "okyre",
            userType,
          ];

          connection.query(
            "INSERT INTO users (`first_name`, `last_name`, `email`,`mobile`,`password`,`payment_receipt`,`user_type`) VALUES (?, ?, ?,?,?,?,?)",
            valuesToInsert,
            (err, results) => {
              if (err) {
                console.error("DBerror executing query:", err);
                return res
                  .status(500)
                  .json({ DBerror: "Error executing query:" + err });
              }

              genarateToken(results.insertId, res);
              return res
                .status(200)
                .json({ success: "Registration successfull !" });
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


export const lecturerSignup = async (req, res) => {
  try {
    // get body data

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      promoCode,
      password_confirmation,
      userType,
    } = req.body;

    //Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);

    // mysql query bind = email
    var mobile_check = { mobile: mobile };

    connection.query(
      "SELECT COUNT(*) AS ex  FROM users WHERE ?",
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
          return res.status(409).json({ error: "User already exists!" });
        } else {
          const valuesToInsert = [
            firstName,
            lastName,
            email,
            mobile,
            hashedpassword,
            "okyre",
            userType,
          ];

          connection.query(
            "INSERT INTO users (`first_name`, `last_name`, `email`,`mobile`,`password`,`payment_receipt`,`user_type`) VALUES (?, ?, ?,?,?,?,?)",
            valuesToInsert,
            (err, results) => {
              if (err) {
                console.error("DBerror executing query:", err);
                return res
                  .status(500)
                  .json({ DBerror: "Error executing query:" + err });
              }

              genarateToken(results.insertId, res);
              return res
                .status(200)
                .json({ success: "Registration successfull !" });
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



export const adminSignup = async (req, res) => {
  try {
    // get body data

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      promoCode,
      password_confirmation,
      userType,
    } = req.body;

    //Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);

    // mysql query bind = email
    var mobile_check = { mobile: mobile };

    connection.query(
      "SELECT COUNT(*) AS ex  FROM users WHERE ?",
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
          return res.status(409).json({ error: "User already exists!" });
        } else {
          const valuesToInsert = [
            firstName,
            lastName,
            email,
            mobile,
            hashedpassword,
            "okyre",
            userType,
          ];

          connection.query(
            "INSERT INTO users (`first_name`, `last_name`, `email`,`mobile`,`password`,`payment_receipt`,`user_type`) VALUES (?, ?, ?,?,?,?,?)",
            valuesToInsert,
            (err, results) => {
              if (err) {
                console.error("DBerror executing query:", err);
                return res
                  .status(500)
                  .json({ DBerror: "Error executing query:" + err });
              }

              genarateToken(results.insertId, res);
              return res
                .status(200)
                .json({ success: "Registration successfull !" });
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


export const managerSignup = async (req, res) => {
  try {
    // get body data

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      promoCode,
      password_confirmation,
      userType,
    } = req.body;

    //Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);

    // mysql query bind = email
    var mobile_check = { mobile: mobile };

    connection.query(
      "SELECT COUNT(*) AS ex  FROM users WHERE ?",
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
          return res.status(409).json({ error: "User already exists!" });
        } else {
          const valuesToInsert = [
            firstName,
            lastName,
            email,
            mobile,
            hashedpassword,
            "okyre",
            userType,
          ];

          connection.query(
            "INSERT INTO users (`first_name`, `last_name`, `email`,`mobile`,`password`,`payment_receipt`,`user_type`) VALUES (?, ?, ?,?,?,?,?)",
            valuesToInsert,
            (err, results) => {
              if (err) {
                console.error("DBerror executing query:", err);
                return res
                  .status(500)
                  .json({ DBerror: "Error executing query:" + err });
              }

              genarateToken(results.insertId, res);
              return res
                .status(200)
                .json({ success: "Registration successfull !" });
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



export const coordinatorSignup = async (req, res) => {
  try {
    // get body data

    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      promoCode,
      password_confirmation,
      userType,
    } = req.body;

    //Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);

    // mysql query bind = email
    var mobile_check = { mobile: mobile };

    connection.query(
      "SELECT COUNT(*) AS ex  FROM users WHERE ?",
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
          return res.status(409).json({ error: "User already exists!" });
        } else {
          const valuesToInsert = [
            firstName,
            lastName,
            email,
            mobile,
            hashedpassword,
            "okyre",
            userType,
          ];

          connection.query(
            "INSERT INTO users (`first_name`, `last_name`, `email`,`mobile`,`password`,`payment_receipt`,`user_type`) VALUES (?, ?, ?,?,?,?,?)",
            valuesToInsert,
            (err, results) => {
              if (err) {
                console.error("DBerror executing query:", err);
                return res
                  .status(500)
                  .json({ DBerror: "Error executing query:" + err });
              }

              genarateToken(results.insertId, res);
              return res
                .status(200)
                .json({ success: "Registration successfull !" });
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
