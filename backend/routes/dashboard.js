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
      `SELECT total_students, overall_attendance_pct,
              overall_avg_marks, at_risk_count
       FROM   vw_dashboard_summary`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
 
    // At-risk students (top 10)
    const atRiskResult = await connection.execute(
      `SELECT student_id, full_name, attendance_pct, avg_marks, risk_level
       FROM   vw_at_risk_students
       ORDER  BY CASE risk_level WHEN 'Critical' THEN 1
                                  WHEN 'Low Attendance' THEN 2
                                  WHEN 'Low Marks' THEN 3
                                  ELSE 4 END
       FETCH FIRST 10 ROWS ONLY`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
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