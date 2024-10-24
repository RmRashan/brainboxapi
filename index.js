import express from "express";
import bodyParser from "body-parser";

import cors from "cors";

import authRoutes from "./routes/auth.js";
import connection from "./utils/DBConnection.js";

/* CONFIGURATION */
const app = express();
app.use(cors());

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ROUTES */

app.use("/api/auth", authRoutes);

/* MYSQL SETUP */
const PORT = 5000 || 9000;
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
