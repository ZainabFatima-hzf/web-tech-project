// routes/attendance.js  –  Member 2
const express   = require("express");
const router    = express.Router();
const connectDB = require("../db");
const oracledb  = require("oracledb");

// ─────────────────────────────────────────────
// POST /attendance  –  Mark attendance
// ─────────────────────────────────────────────
router.post("/", async (req, res) => {
  const { student_id, course_id, attend_date, status, remarks } = req.body;

  if (!student_id || !course_id || !attend_date || !status) {
    return res.status(400).json({
      error: "student_id, course_id, attend_date, status are required.",
    });
  }

  if (!["Present", "Absent", "Late"].includes(status)) {
    return res.status(400).json({ error: "status must be Present, Absent, or Late." });
  }

  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `INSERT INTO Attendance (student_id, course_id, attend_date, status, remarks)
       VALUES (:student_id, :course_id, TO_DATE(:attend_date,'YYYY-MM-DD'), :status, :remarks)
       RETURNING attendance_id INTO :attendance_id`,
      {
        student_id:    student_id.trim().toUpperCase(),
        course_id:     Number(course_id),
        attend_date:   attend_date,
        status:        status,
        remarks:       remarks || null,
        attendance_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );

    await connection.commit();
    res.status(201).json({
      message: "Attendance marked successfully.",
      attendance_id: result.outBinds.attendance_id[0],
    });
  } catch (err) {
    if (err.message.includes("Attendance already marked") || err.message.includes("ORA-00001")) {
      return res.status(409).json({ error: "Attendance already marked for this student on this date." });
    }
    console.error("POST /attendance error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ─────────────────────────────────────────────
// POST /attendance/bulk  –  Mark attendance for entire class
// Body: { course_id, attend_date, records: [{student_id, status, remarks}] }
// ─────────────────────────────────────────────
router.post("/bulk", async (req, res) => {
  const { course_id, attend_date, records } = req.body;

  if (!course_id || !attend_date || !Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ error: "course_id, attend_date, and records[] are required." });
  }

  let connection;
  const results = { success: 0, skipped: 0, errors: [] };

  try {
    connection = await connectDB();

    for (const rec of records) {
      try {
        await connection.execute(
          `INSERT INTO Attendance (student_id, course_id, attend_date, status, remarks)
           VALUES (:student_id, :course_id, TO_DATE(:attend_date,'YYYY-MM-DD'), :status, :remarks)`,
          {
            student_id:  rec.student_id.trim().toUpperCase(),
            course_id:   Number(course_id),
            attend_date: attend_date,
            status:      rec.status || "Present",
            remarks:     rec.remarks || null,
          }
        );
        results.success++;
      } catch (e) {
        if (e.message.includes("ORA-00001") || e.message.includes("already marked")) {
          results.skipped++;
        } else {
          results.errors.push({ student_id: rec.student_id, error: e.message });
        }
      }
    }

    await connection.commit();
    res.status(201).json({ message: "Bulk attendance processed.", ...results });
  } catch (err) {
    console.error("POST /attendance/bulk error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ─────────────────────────────────────────────
// GET /attendance  –  Fetch attendance records
// Query params: student_id, course_id, date
// ─────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { student_id, course_id, date } = req.query;

  let whereClause = "WHERE 1=1";
  const binds = {};

  if (student_id) { whereClause += " AND a.student_id = :student_id"; binds.student_id = student_id; }
  if (course_id)  { whereClause += " AND a.course_id = :course_id";   binds.course_id  = Number(course_id); }
  if (date)       { whereClause += " AND a.attend_date = TO_DATE(:date,'YYYY-MM-DD')"; binds.date = date; }

  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT a.attendance_id,
              a.student_id, s.full_name,
              a.course_id,  c.course_name,
              TO_CHAR(a.attend_date,'YYYY-MM-DD') AS attend_date,
              a.status, a.remarks,
              TO_CHAR(a.marked_at,'YYYY-MM-DD HH24:MI') AS marked_at
       FROM   Attendance a
       JOIN   Students s ON s.student_id = a.student_id
       JOIN   Courses  c ON c.course_id  = a.course_id
       ${whereClause}
       ORDER  BY a.attend_date DESC, s.full_name`,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /attendance error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ─────────────────────────────────────────────
// GET /attendance/summary  –  Attendance % per student per course
// ─────────────────────────────────────────────
router.get("/summary", async (req, res) => {
  const { student_id, course_id } = req.query;

  let whereClause = "WHERE 1=1";
  const binds = {};
  if (student_id) { whereClause += " AND student_id = :student_id"; binds.student_id = student_id; }
  if (course_id)  { whereClause += " AND course_id = :course_id";   binds.course_id  = Number(course_id); }

  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT student_id, full_name, course_id, course_name,
              total_classes, present_count, absent_count, late_count, attendance_pct
       FROM   vw_attendance_by_course
       ${whereClause}
       ORDER  BY full_name, course_name`,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /attendance/summary error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// ─────────────────────────────────────────────
// GET /attendance/courses  –  List all courses (for dropdowns)
// ─────────────────────────────────────────────
router.get("/courses", async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT course_id, course_name, course_code FROM Courses ORDER BY course_name`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /attendance/courses error:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

module.exports = router;
