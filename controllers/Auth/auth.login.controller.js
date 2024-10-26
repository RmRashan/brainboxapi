import bcryptjs from "bcrypt";

import genarateToken from "../../utils/genarateToken.js";
import connection from "../../utils/DBConnection.js";

export const studentLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // mysql query bind = email
    var emailq = { email: email };
    // console.log(emailq)

    connection.query("SELECT * FROM students WHERE ?", emailq, (err, results) => {
      if (err) {
        console.error("DBerror executing query:"+ err);
       
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

export const agentLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // mysql query bind = email
    var emailq = { email: email };
  
    connection.query("SELECT * FROM users WHERE ?", emailq, (err, results) => {
      if (err) {
        console.error("DBerror executing query:", err);
        return res
          .status(500)
          .json({ DBerror: "Error executing query:" + err });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      // Compare passwords using bcrypt
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ error: "bcryptjs :" + err });
        }
        if (isMatch) {
         const cokkie = genarateToken(user._id, res);

          console.log(cokkie)
          return res.status(200).json({ success: "Login successfull !" });
        } else {
          // Invalid password
          res.status(401).json({ error: "Invalid email or password" });
        }
      });
    });
  } catch (error) {
    console.log("login controller" + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const lecturerLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // mysql query bind = email
    var emailq = { email: email };
    console.log(email, password);

    connection.query("SELECT * FROM users WHERE ?", emailq, (err, results) => {
      if (err) {
        console.error("DBerror executing query:", err);
        return res
          .status(500)
          .json({ DBerror: "Error executing query:" + err });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      // Compare passwords using bcrypt
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ error: "bcryptjs :" + err });
        }
        if (isMatch) {
          genarateToken(user._id, res);
          return res.status(200).json({ success: "Login successfull !" });
        } else {
          // Invalid password
          res.status(401).json({ error: "Invalid email or password" });
        }
      });
    });
  } catch (error) {
    console.log("login controller" + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // mysql query bind = email
    var emailq = { email: email };
    console.log(email, password);

    connection.query("SELECT * FROM users WHERE ?", emailq, (err, results) => {
      if (err) {
        console.error("DBerror executing query:", err);
        return res
          .status(500)
          .json({ DBerror: "Error executing query:" + err });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      // Compare passwords using bcrypt
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ error: "bcryptjs :" + err });
        }
        if (isMatch) {
          genarateToken(user._id, res);
          return res.status(200).json({ success: "Login successfull !" });
        } else {
          // Invalid password
          res.status(401).json({ error: "Invalid email or password" });
        }
      });
    });
  } catch (error) {
    console.log("login controller" + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const managerLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // mysql query bind = email
    var emailq = { email: email };
    console.log(email, password);

    connection.query("SELECT * FROM users WHERE ?", emailq, (err, results) => {
      if (err) {
        console.error("DBerror executing query:", err);
        return res
          .status(500)
          .json({ DBerror: "Error executing query:" + err });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      // Compare passwords using bcrypt
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ error: "bcryptjs :" + err });
        }
        if (isMatch) {
          genarateToken(user._id, res);
          return res.status(200).json({ success: "Login successfull !" });
        } else {
          // Invalid password
          res.status(401).json({ error: "Invalid email or password" });
        }
      });
    });
  } catch (error) {
    console.log("login controller" + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const coordinatorLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;

    // mysql query bind = email
    var emailq = { email: email };
    console.log(email, password);

    connection.query("SELECT * FROM users WHERE ?", emailq, (err, results) => {
      if (err) {
        console.error("DBerror executing query:", err);
        return res
          .status(500)
          .json({ DBerror: "Error executing query:" + err });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const user = results[0];

      // Compare passwords using bcrypt
      bcryptjs.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ error: "bcryptjs :" + err });
        }
        if (isMatch) {
          genarateToken(user._id, res);
          return res.status(200).json({ success: "Login successfull !" });
        } else {
          // Invalid password
          res.status(401).json({ error: "Invalid email or password" });
        }
      });
    });
  } catch (error) {
    console.log("login controller" + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
