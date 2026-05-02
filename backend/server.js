// server.js  –  updated by Member 1 (wire in students + dashboard routes)
const express = require("express");
const cors    = require("cors");
const connectDB = require("./db");

const studentsRouter  = require("./routes/students");
const dashboardRouter = require("./routes/dashboard");

const app = express();

app.use(cors());
app.use(express.json());

// ── Existing test routes ─────────────────────
app.get("/test", (req, res) => res.send("Backend working!"));

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
    if (connection) await connection.close().catch(console.error);
  }
});

// ── Member 1 routes ──────────────────────────
app.use("/students",  studentsRouter);
app.use("/dashboard", dashboardRouter);

// ─────────────────────────────────────────────
app.listen(5000, () => console.log("Server running on port 5000"));