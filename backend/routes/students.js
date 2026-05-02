// routes/students.js  –  Member 1
const express = require("express");
const router = express.Router();
const connectDB = require("../db");

// ─────────────────────────────────────────────
// POST /students  –  Add student via stored procedure
// ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { full_name, email, phone, dept_id, semester } = req.body;

  if (!full_name || !email || !dept_id || !semester) {
    return res.status(400).json({ error: "full_name, email, dept_id, semester are required." });
  }

  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `BEGIN
         sp_add_student(:full_name, :email, :phone, :dept_id, :semester, :student_id);
       END;`,
      {
        full_name: full_name.trim(),
        email:     email.trim().toLowerCase(),
        phone:     phone || null,
        dept_id:   Number(dept_id),
        semester:  Number(semester),
        student_id: { dir: require("oracledb").BIND_OUT, type: require("oracledb").STRING, maxSize: 20 },
      }
    );

    res.status(201).json({
      message: "Student added successfully.",
      student_id: result.outBinds.student_id,
    });
  } catch (err) {
    if (err.message.includes("Email already exists")) {
      return res.status(409).json({ error: err.message });
    }
    console.error("POST /students error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ─────────────────────────────────────────────
// GET /students  –  List all students (with dept name)
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT s.student_id, s.full_name, s.email, s.phone,
              d.dept_name, s.semester, s.status,
              TO_CHAR(s.enrollment_date, 'YYYY-MM-DD') AS enrollment_date
       FROM   Students s
       JOIN   Departments d ON d.dept_id = s.dept_id
       ORDER  BY s.enrollment_date DESC`,
      [],
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET /students error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ─────────────────────────────────────────────
// GET /students/:id  –  Single student
// ─────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT s.student_id, s.full_name, s.email, s.phone,
              d.dept_name, d.dept_id, s.semester, s.status,
              TO_CHAR(s.enrollment_date, 'YYYY-MM-DD') AS enrollment_date
       FROM   Students s
       JOIN   Departments d ON d.dept_id = s.dept_id
       WHERE  s.student_id = :id`,
      { id: req.params.id },
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Student not found." });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("GET /students/:id error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ─────────────────────────────────────────────
// GET /students/departments/all  –  Departments list
// ─────────────────────────────────────────────
router.get("/departments/all", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT dept_id, dept_name, dept_code FROM Departments ORDER BY dept_name`,
      [],
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /students/departments/all error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

module.exports = router;