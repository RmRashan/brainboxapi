
import connection from "../utils/DBConnection.js";


export const GetGenders = async (req, res) => {
    try {

        connection.query("SELECT `id` , `gender` AS name FROM gender", (err, results) => {
            if (err) {
                console.error("DBerror executing query:" + err);

            }

            if (results.length === 0) {
                return res.status(401).json({ error: "No Any Data" });
            }

            const gender = results;
            return res.status(200).json({ gender: gender });

        }
        );

    } catch (error) {
        console.log("login controller" + error.message);
    }
};