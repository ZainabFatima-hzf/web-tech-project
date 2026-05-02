// routes/dashboard.js  –  Member 1
const express = require("express");
const router  = express.Router();
const connectDB = require("../db");
const oracledb  = require("oracledb");

// ─────────────────────────────────────────────
// GET /dashboard  –  Summary cards + at-risk list
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();

    // Summary KPIs
    const summaryResult = await connection.execute(
  `SELECT 
    (SELECT COUNT(*) FROM Students WHERE status = 'Active') AS total_students,
    0 AS overall_attendance_pct,
    0 AS overall_avg_marks,
    0 AS at_risk_count
   FROM dual`,
  [],
  { outFormat: oracledb.OUT_FORMAT_OBJECT }
);

    // At-risk students (top 10)
    const atRiskResult = { rows: [] };

    // Department-wise student count
    const deptResult = await connection.execute(
      `SELECT d.dept_name, COUNT(s.student_id) AS student_count
       FROM   Departments d
       LEFT JOIN Students s ON s.dept_id = d.dept_id AND s.status = 'Active'
       GROUP  BY d.dept_name
       ORDER  BY student_count DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json({
      summary:      summaryResult.rows[0],
      at_risk:      atRiskResult.rows,
      by_department: deptResult.rows,
    });
  } catch (err) {
    console.error("GET /dashboard error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

module.exports = router;