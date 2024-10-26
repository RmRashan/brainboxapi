
import connection from "../utils/DBConnection.js";


export const GetAllGrades = async (req, res) => {
    try {

        connection.query("SELECT `id` , `grade` AS name FROM grades_or_levels", (err, results) => {
            if (err) {
                console.error("DBerror executing query:" + err);

            }

            if (results.length === 0) {
                return res.status(401).json({ error: "No Any Data" });
            }

            const grades = results;
            return res.status(200).json({  grades: grades });

        }
        );

    } catch (error) {
        console.log("login controller" + error.message);
    }
};