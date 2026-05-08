// src/pages/MarksEntry.jsx  –  Member 3
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { ClipboardList, CheckCircle2, AlertCircle, Search, PlusCircle } from "lucide-react";

const API = "http://localhost:5000";

// ── Grade badge ─────────────────────────────
function GradeBadge({ letter }) {
  const map = {
    "A+": "#22C55E", A: "#22C55E", "A-": "#4ADE80",
    "B+": "#06B6D4", B: "#06B6D4", "B-": "#38BDF8",
    "C+": "#F59E0B", C: "#F59E0B", "C-": "#FCD34D",
    D:    "#F97316",
    F:    "#EF4444",
  };
  const color = map[letter] || "#94A3B8";
  return (
    <span style={{
      background: `${color}22`, color, border: `1px solid ${color}44`,
      borderRadius: 6, padding: "2px 9px", fontSize: 12, fontWeight: 700,
    }}>{letter || "—"}</span>
  );
}

// ── Field ────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ color: "#94A3B8", fontSize: 12, fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "#1e1329", border: "1px solid rgba(124,58,237,0.25)",
  borderRadius: 8, padding: "9px 12px", color: "#F8FAFC",
  fontSize: 13, outline: "none", width: "100%",
  fontFamily: "'Poppins', sans-serif",
};

export default function MarksEntry() {
  const [students, setStudents]   = useState([]);
  const [courses,  setCourses]    = useState([]);
  const [exams,    setExams]      = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [existingMarks, setExistingMarks] = useState([]);

  const [form, setForm] = useState({
    student_id: "", course_id: "", exam_id: "", marks_obtained: "", total_marks: "100",
  });

  const [status,  setStatus]  = useState(null); // { type: 'success'|'error', msg }
  const [loading, setLoading] = useState(false);
  const [search,  setSearch]  = useState("");
  const [examSearch, setExamSearch] = useState("");

  // ── Load dropdowns ─────────────────────────
  useEffect(() => {
    fetch(`${API}/students`).then(r => r.json()).then(setStudents).catch(console.error);
    fetch(`${API}/performance/courses`).then(r => r.json()).then(setCourses).catch(console.error);
    fetch(`${API}/exams`).then(r => r.json()).then(d => { setExams(d); setFilteredExams(d); }).catch(console.error);
  }, []);

  // Filter exams by selected course
  useEffect(() => {
    if (form.course_id) {
      setFilteredExams(exams.filter(e => String(e.COURSE_ID) === String(form.course_id)));
    } else {
      setFilteredExams(exams);
    }
    setForm(f => ({ ...f, exam_id: "" }));
  }, [form.course_id, exams]);

  // Load existing marks when student changes
  useEffect(() => {
    if (!form.student_id) { setExistingMarks([]); return; }
    fetch(`${API}/performance/marks?student_id=${form.student_id}`)
      .then(r => r.json()).then(setExistingMarks).catch(console.error);
  }, [form.student_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = async () => {
    const { student_id, course_id, exam_id, marks_obtained, total_marks } = form;
    if (!student_id || !course_id || !exam_id || marks_obtained === "") {
      setStatus({ type: "error", msg: "Please fill all required fields." });
      return;
    }
    if (Number(marks_obtained) > Number(total_marks)) {
      setStatus({ type: "error", msg: "Marks obtained cannot exceed total marks." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/performance/marks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id, course_id, exam_id, marks_obtained: Number(marks_obtained), total_marks: Number(total_marks) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save marks.");
      setStatus({ type: "success", msg: `Marks saved! Grade ID: ${data.grade_id}` });
      // Refresh marks list
      fetch(`${API}/performance/marks?student_id=${student_id}`)
        .then(r => r.json()).then(setExistingMarks).catch(console.error);
    } catch (err) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  // ── Filtered students for search ──────────
  const filteredStudents = students.filter(s =>
    !search || s.FULL_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    s.STUDENT_ID?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedExam = exams.find(e => String(e.EXAM_ID) === String(form.exam_id));

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <ClipboardList size={22} color="#7C3AED" /> Marks Entry
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
          Enter exam marks for students. Grades are calculated automatically.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18, alignItems: "start" }}>

        {/* ── Entry Form ── */}
        <div style={{
          background: "#37284e", borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 22px", borderBottom: "1px solid rgba(124,58,237,0.12)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <PlusCircle size={16} color="#7C3AED" />
            <span style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>New Marks Entry</span>
          </div>

          <div style={{ padding: "22px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Student search */}
            <Field label="Student *">
              <div style={{ position: "relative" }}>
                <Search size={13} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  style={{ ...inputStyle, paddingLeft: 30 }}
                  placeholder="Search by name or ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select name="student_id" value={form.student_id} onChange={handleChange} style={inputStyle}>
                <option value="">— Select Student —</option>
                {filteredStudents.map(s => (
                  <option key={s.STUDENT_ID} value={s.STUDENT_ID}>
                    {s.STUDENT_ID} · {s.FULL_NAME}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Course *">
              <select name="course_id" value={form.course_id} onChange={handleChange} style={inputStyle}>
                <option value="">— Select Course —</option>
                {courses.map(c => (
                  <option key={c.COURSE_ID} value={c.COURSE_ID}>{c.COURSE_CODE} · {c.COURSE_NAME}</option>
                ))}
              </select>
            </Field>

            <Field label="Exam *">
              <select name="exam_id" value={form.exam_id} onChange={handleChange} style={inputStyle} disabled={!form.course_id}>
                <option value="">— Select Exam —</option>
                {filteredExams.map(e => (
                  <option key={e.EXAM_ID} value={e.EXAM_ID}>
                    [{e.EXAM_TYPE}] {e.EXAM_NAME} ({e.EXAM_DATE})
                  </option>
                ))}
              </select>
              {form.course_id && filteredExams.length === 0 && (
                <span style={{ color: "#F59E0B", fontSize: 11 }}>No exams found for this course.</span>
              )}
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Marks Obtained *">
                <input
                  type="number" name="marks_obtained" value={form.marks_obtained}
                  onChange={handleChange} min="0" max={form.total_marks || 100}
                  style={inputStyle} placeholder="e.g. 78"
                />
              </Field>
              <Field label="Total Marks">
                <input
                  type="number" name="total_marks" value={form.total_marks}
                  onChange={handleChange} min="1"
                  style={inputStyle} placeholder="100"
                />
              </Field>
            </div>

            {/* Live preview */}
            {form.marks_obtained !== "" && form.total_marks && (
              <div style={{
                background: "rgba(124,58,237,0.1)", borderRadius: 10,
                padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ color: "#94A3B8", fontSize: 12 }}>Score preview</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 13 }}>
                    {Math.round(form.marks_obtained / form.total_marks * 100)}%
                  </span>
                  <GradeBadge letter={previewGrade(form.marks_obtained, form.total_marks)} />
                </div>
              </div>
            )}

            {status && (
              <div style={{
                background: status.type === "success" ? "#22C55E15" : "#EF444415",
                border: `1px solid ${status.type === "success" ? "#22C55E40" : "#EF444440"}`,
                borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 8,
                color: status.type === "success" ? "#22C55E" : "#EF4444", fontSize: 13,
              }}>
                {status.type === "success"
                  ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                {status.msg}
              </div>
            )}

            <button
              onClick={handleSubmit} disabled={loading}
              style={{
                background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7C3AED,#5B21B6)",
                border: "none", borderRadius: 10, padding: "11px 0",
                color: "#fff", fontWeight: 600, fontSize: 13,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Poppins', sans-serif",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Saving…" : "Save Marks"}
            </button>
          </div>
        </div>

        {/* ── Existing Marks Table ── */}
        <div style={{
          background: "#37284e", borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 22px", borderBottom: "1px solid rgba(124,58,237,0.12)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <ClipboardList size={16} color="#06B6D4" />
            <span style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>
              {form.student_id ? "Grades for Selected Student" : "Select a student to view grades"}
            </span>
          </div>

          {!form.student_id ? (
            <div style={{ padding: "40px 22px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
              Select a student to see their marks history.
            </div>
          ) : existingMarks.length === 0 ? (
            <div style={{ padding: "40px 22px", textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
              No marks recorded for this student yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                    {["Course", "Exam", "Type", "Marks", "Grade"].map(h => (
                      <th key={h} style={{
                        color: "#94A3B8", fontSize: 11, fontWeight: 600,
                        padding: "10px 14px", textAlign: "left", letterSpacing: "0.05em",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {existingMarks.map(row => (
                    <tr key={row.GRADE_ID}
                      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.07)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "10px 14px", color: "#F8FAFC", fontSize: 12 }}>{row.COURSE_NAME}</td>
                      <td style={{ padding: "10px 14px", color: "#F8FAFC", fontSize: 12 }}>{row.EXAM_NAME}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          background: "rgba(6,182,212,0.15)", color: "#06B6D4",
                          borderRadius: 6, padding: "2px 8px", fontSize: 11,
                        }}>{row.EXAM_TYPE}</span>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#F8FAFC", fontSize: 12 }}>
                        {row.MARKS_OBTAINED}/{row.TOTAL_MARKS}
                        <span style={{ color: "#94A3B8", marginLeft: 6, fontSize: 11 }}>
                          ({Math.round(row.MARKS_OBTAINED / row.TOTAL_MARKS * 100)}%)
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <GradeBadge letter={row.GRADE_LETTER} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ── Pure helper: preview grade letter ───────
function previewGrade(marks, total) {
  if (!total || total <= 0) return "—";
  const pct = (marks / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 85) return "A";
  if (pct >= 80) return "A-";
  if (pct >= 75) return "B+";
  if (pct >= 70) return "B";
  if (pct >= 65) return "B-";
  if (pct >= 60) return "C+";
  if (pct >= 55) return "C";
  if (pct >= 50) return "C-";
  if (pct >= 45) return "D";
  return "F";
}
