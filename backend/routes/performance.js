// routes/performance.js  –  Member 3
// Routes: /exams, /performance
const express  = require("express");
const router   = express.Router();
const connectDB = require("../db");
const oracledb  = require("oracledb");

// ════════════════════════════════════════════
// EXAMS
// ════════════════════════════════════════════

// GET /exams  –  All exams (with course name)
router.get("/exams", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT e.exam_id, e.exam_name, e.exam_type,
              c.course_name, c.course_id,
              TO_CHAR(e.exam_date,'YYYY-MM-DD') AS exam_date,
              e.total_marks
       FROM   Exams e
       JOIN   Courses c ON c.course_id = e.course_id
       ORDER  BY e.exam_date DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /exams error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// POST /exams  –  Create a new exam
router.post("/exams", async (req, res) => {
  const { exam_name, exam_type, course_id, exam_date, total_marks } = req.body;
  if (!exam_name || !exam_type || !course_id) {
    return res.status(400).json({ error: "exam_name, exam_type, course_id are required." });
  }
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `INSERT INTO Exams (exam_name, exam_type, course_id, exam_date, total_marks)
       VALUES (:exam_name, :exam_type, :course_id,
               TO_DATE(:exam_date,'YYYY-MM-DD'), :total_marks)
       RETURNING exam_id INTO :exam_id`,
      {
        exam_name:   exam_name.trim(),
        exam_type:   exam_type.trim(),
        course_id:   Number(course_id),
        exam_date:   exam_date || new Date().toISOString().slice(0, 10),
        total_marks: Number(total_marks) || 100,
        exam_id:     { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );
    await connection.commit();
    res.status(201).json({ message: "Exam created.", exam_id: result.outBinds.exam_id[0] });
  } catch (err) {
    console.error("POST /exams error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// GET /exams/stats  –  Per-exam stats from view
router.get("/exams/stats", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT * FROM vw_exam_stats ORDER BY exam_id DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /exams/stats error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ════════════════════════════════════════════
// COURSES  (needed by marks entry UI dropdowns)
// ════════════════════════════════════════════

router.get("/courses", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT course_id, course_name, course_code, credit_hours, dept_id FROM Courses ORDER BY course_name`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /courses error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ════════════════════════════════════════════
// MARKS ENTRY  –  uses sp_insert_marks stored procedure
// ════════════════════════════════════════════

// POST /performance/marks  –  Insert / update marks via stored procedure
router.post("/marks", async (req, res) => {
  const { student_id, course_id, exam_id, marks_obtained, total_marks } = req.body;
  if (!student_id || !course_id || !exam_id || marks_obtained == null) {
    return res.status(400).json({ error: "student_id, course_id, exam_id, marks_obtained are required." });
  }
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `BEGIN
         sp_insert_marks(:student_id, :course_id, :exam_id,
                         :marks_obtained, :total_marks, :grade_id);
       END;`,
      {
        student_id:     student_id.trim(),
        course_id:      Number(course_id),
        exam_id:        Number(exam_id),
        marks_obtained: Number(marks_obtained),
        total_marks:    Number(total_marks) || 100,
        grade_id:       { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );
    res.status(201).json({
      message:  "Marks saved successfully.",
      grade_id: result.outBinds.grade_id,
    });
  } catch (err) {
    console.error("POST /performance/marks error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// GET /performance/marks?exam_id=X  –  All marks for an exam
router.get("/marks", async (req, res) => {
  const { exam_id, student_id } = req.query;
  let connection;
  try {
    connection = await connectDB();

    let sql = `SELECT g.grade_id, g.student_id, s.full_name,
                      c.course_name, e.exam_name, e.exam_type,
                      g.marks_obtained, g.total_marks,
                      g.grade_letter, g.grade_points,
                      TO_CHAR(g.created_at,'YYYY-MM-DD') AS created_at
               FROM   Grades g
               JOIN   Students s ON s.student_id = g.student_id
               JOIN   Courses  c ON c.course_id  = g.course_id
               JOIN   Exams    e ON e.exam_id    = g.exam_id
               WHERE  1=1`;
    const binds = {};
    if (exam_id)    { sql += " AND g.exam_id = :exam_id";       binds.exam_id    = Number(exam_id); }
    if (student_id) { sql += " AND g.student_id = :student_id"; binds.student_id = student_id; }
    sql += " ORDER BY s.full_name";

    const result = await connection.execute(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json(result.rows);
  } catch (err) {
    console.error("GET /performance/marks error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ════════════════════════════════════════════
// PERFORMANCE / GPA REPORTS
// ════════════════════════════════════════════

// GET /performance/report  –  All students' GPA summary
router.get("/report", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT * FROM vw_student_gpa ORDER BY gpa DESC`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /performance/report error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// GET /performance/report/:student_id  –  One student's full record
router.get("/report/:student_id", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();

    // GPA summary
    const gpaResult = await connection.execute(
      `SELECT * FROM vw_student_gpa WHERE student_id = :id`,
      { id: req.params.student_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    // Detailed grades
    const gradesResult = await connection.execute(
      `SELECT g.grade_id, c.course_name, c.course_code,
              e.exam_name, e.exam_type, e.exam_date,
              g.marks_obtained, g.total_marks,
              ROUND(g.marks_obtained/g.total_marks*100,1) AS percentage,
              g.grade_letter, g.grade_points
       FROM   Grades  g
       JOIN   Courses c ON c.course_id = g.course_id
       JOIN   Exams   e ON e.exam_id   = g.exam_id
       WHERE  g.student_id = :id
       ORDER  BY e.exam_date DESC`,
      { id: req.params.student_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (gpaResult.rows.length === 0 && gradesResult.rows.length === 0)
      return res.status(404).json({ error: "No records found for this student." });

    res.json({
      summary: gpaResult.rows[0] || null,
      grades:  gradesResult.rows,
    });
  } catch (err) {
    console.error("GET /performance/report/:id error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// GET /performance/grade-distribution  –  Grade distribution across courses
router.get("/grade-distribution", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT * FROM vw_grade_distribution`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /performance/grade-distribution error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

module.exports = router;
