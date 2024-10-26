import bcryptjs from "bcrypt";
import genarateToken from "../utils/genarateToken.js";
import connection from "../utils/DBConnection.js";
import { CreateCurrentFullDate } from "../utils/DateTimeCreation.js";

export const agentLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // mysql query bind = email
    var emailq = { email: email };
    // console.log(emailq)

    connection.query("SELECT * FROM agents WHERE ?", emailq, (err, results) => {
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
          console.error("bcryptjs :" + err);
        }
        if (isMatch) {
          const token = genarateToken(user.id, password, res);
          return res
            .status(200)
            .json({ success: "Login successfull !", token: token });
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

export const agentSignup = async (req, res) => {
  try {
    // get body data
    const {
      firstName,
      lastName,
      email,
      mobile,
      nic,
      password,

    } = req.body;

    //Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);

    // mysql query bind = email
    var mobile_check = { mobile: mobile };
    var email_check = { email: email };

    connection.query(
      "SELECT COUNT(*) AS ex  FROM agents WHERE ?",
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
          return res
            .status(409)
            .json({ error: "This Mobile Number already exists!" });
        } else {
          connection.query(
            "SELECT COUNT(*) AS ex  FROM agents WHERE ?",
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
                return res
                  .status(409)
                  .json({ error: "This Email already exists!" });
              } else {
                const query = "SELECT id FROM agents ORDER BY id DESC LIMIT 1";
                connection.query(query, (err, results) => {
                  if (err) throw err;

                  let studentID;
                  try {
                    let lastid = results[0].id;
                    const removeFirstThreeLetter = lastid.slice(3);
                    const intID = parseInt(removeFirstThreeLetter);
                    let newId = intID + 1;

                    let addZero = "0";

                    for (let i = intID.toString().length; i <= 3; i++) {
                      addZero += "0";
                    }
                    agentID = "BA-" + addZero + newId;
                  } catch (error) {
                    console.log("Agent ID Creation : " + error);
                  }

                  let date = CreateCurrentFullDate();

                  const valuesToInsert = [
                    agentID,
                    firstName,
                    lastName,
                    email,
                    nic,
                    mobile,
                    hashedpassword,
                    2,
                    NULL,
                    NULL,
                    NULL,
                    date,
                    
                    
                  
                  ];

                  connection.query(
                    "INSERT INTO agents (`ID`,`first_name`, `last_name`, `email`,`nic`,`mobile`,`password`,`status_id`,`nic_address`,`living_address`,`verification_code`,`created_time`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                        .json({
                          success: "Registration successfull !",
                          token: token,
                        });
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

export const agentProfile = async (req, res) => {
  try {
    // console.log(req.user)
    const id = await req.user;

    // mysql query bind = email
    var userID = { id: id };

    connection.query("SELECT * FROM agents WHERE ?", userID, (err, results) => {
      if (err) {
        console.error("DBerror executing query:", err);
      }

      if (!results) {
        return res
          .status(401)
          .json({ unauthorized: "Invalid email or password" });
      }

      const user = results[0];

      const dateString = user.created_time;
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString();

      const userObj = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        mobile: user.mobile,
        nic: user.nic,
        image_url: user.image_url,
        nic_address: user.nic_address,
        living_address: user.living_address,
        joinedDate: formattedDate,
      };
      // console.log(userObj)

      return res.status(200).json({ agent: userObj });
    });
  } catch (error) {
    console.log("login controller" + error);
  }
};

export const agentProfileEdit = async (req, res) => {
  try {
    const id = await req.user;
    const {
      firstName,
      lastName,
      mobile,
      email,
      nic,
      nic_address,
      living_address,
    } = req.body;

    // mysql query bind = email
    var user = {
      first_name: firstName,
      last_name: lastName,
      mobile: mobile,
      email: email,
      nic: nic,
      nic_address: nic_address,
      living_address: living_address,
    };
    var userID = {
      id: id,
    };

    connection.query(
      "UPDATE agents SET ? WHERE ?",
      [user, userID],
      (err, results) => {
        if (err) {
          console.error("DBerror executing query:", err);
        }

        if (!results) {
          return res.status(401).json({ unauthorized: "unauthorized" });
        }

        console.log(user);

        // return res.status(200).json({ student: userObj });
      }
    );
  } catch (error) {
    console.log("login controller" + error);
  }
};

//get all courses

export const agentGetAllCourses = async (req, res) => {
    try {
      // console.log(req.user)
      const id = await req.user;
  
      // mysql query bind = email
      var userID = { id: id };
  
      connection.query("SELECT * FROM courses ", (err, results) => {
        if (err) {
          console.error("DBerror executing query:", err);
        }
  
        if (!results) {
          return res
            .status(401)
            .json({ unauthorized: "Invalid email or password" });
        }
  
        const user = results[0];
  
        const dateString = user.created_time;
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString();
  
        const userObj = {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          mobile: user.mobile,
          nic: user.nic,
          image_url: user.image_url,
          nic_address: user.nic_address,
          living_address: user.living_address,
          joinedDate: formattedDate,
        };
        // console.log(userObj)
  
        return res.status(200).json({ agent: userObj });
      });
    } catch (error) {
      console.log("login controller" + error);
    }
  };

//get unique course
