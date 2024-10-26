import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import connection from "./utils/DBConnection.js";
import ProtectRoute from "./middleware/Auth/protectRoute.js";
import {
  studentAuthRoute,
  studentRoute,
} from "./routes/student/Student.Route.js";
import GradeRoute from "./routes/Grade.Rote.js";
import GenderRoute from "./routes/Gender.Rote.js";

/* CONFIGURATION */
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
  },
});
const upload = multer({ storage: storage });
app.use(upload.array("files"));

/* ROUTES */

// -------------------------------------------------****** student ******
app.use("/api/auth/student", studentAuthRoute);
app.use("/api/student", studentRoute);
// -------------------------------------------------****** agent ******
app.use("/api/auth/agent", studentAuthRoute);
app.use("/api/agent", studentRoute);
// -------------------------------------------------****** get grades ******
app.use("/api/grade", GradeRoute);
// -------------------------------------------------****** get gender ******
app.use("/api/gender", GenderRoute);

// check user session
app.use("/api/auth", ProtectRoute);

/* MYSQL SETUP */
const PORT = 8000 || 9000;
async function startServer() {
  try {
    connection.connect(function (err) {
      if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
      }

      console.log("Connected to MySQL as ID " + connection.threadId);
    });

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // Start the server
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

// Call the async function to start the server
startServer();
