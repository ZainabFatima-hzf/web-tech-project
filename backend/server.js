const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // 👈 import DB connection

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Test route (backend check)
 */
app.get("/test", (req, res) => {
  res.send("Backend working!");
});

/**
 * Oracle DB test route
 */
app.get("/db-test", async (req, res) => {
  let connection;

  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT 'Oracle DB Connected Successfully' AS message FROM dual`
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");

  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
});

/**
 * Start server
 */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});