// src/pages/MarkAttendance.jsx  –  Member 2
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  ClipboardList, CheckCircle, XCircle, Clock,
  AlertCircle, Loader2, Users, ChevronDown
} from "lucide-react";

const API = "http://localhost:5000";

const STATUS_OPTIONS = [
  { value: "Present", icon: CheckCircle, color: "#22C55E" },
  { value: "Absent",  icon: XCircle,     color: "#EF4444" },
  { value: "Late",    icon: Clock,        color: "#F59E0B" },
];

const INPUT_STYLE = {
  width: "100%", background: "#1e1329",
  border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8,
  color: "#F8FAFC", padding: "10px 14px", fontSize: 13,
  outline: "none", boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
};

export default function MarkAttendance() {
  const [courses, setCourses]     = useState([]);
  const [students, setStudents]   = useState([]);
  const [records, setRecords]     = useState({});   // { student_id: status }
  const [courseId, setCourseId]   = useState("");
  const [date, setDate]           = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Load courses
  useEffect(() => {
    fetch(`${API}/attendance/courses`)
      .then(r => r.json())
      .then(setCourses)
      .catch(() => showToast("error", "Failed to load courses."));
  }, []);

  // Load students when course changes
  useEffect(() => {
    if (!courseId) return;
    setSubmitted(false);
    setRecords({});
    fetch(`${API}/students`)
      .then(r => r.json())
      .then(data => {
        setStudents(data);
        // Default all to Present
        const defaults = {};
        data.forEach(s => { defaults[s.STUDENT_ID] = "Present"; });
        setRecords(defaults);
      })
      .catch(() => showToast("error", "Failed to load students."));
  }, [courseId]);

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!courseId) return showToast("error", "Please select a course.");
    if (students.length === 0) return showToast("error", "No students to mark.");

    setSubmitting(true);
    const payload = {
      course_id:   courseId,
      attend_date: date,
      records: students.map(s => ({
        student_id: s.STUDENT_ID,
        status:     records[s.STUDENT_ID] || "Present",
      })),
    };

    try {
      const res  = await fetch(`${API}/attendance/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit.");
      showToast("success",
        `Attendance saved! ✓ ${data.success} marked, ${data.skipped} skipped (already marked).`
      );
      setSubmitted(true);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = Object.values(records).filter(v => v === "Present").length;
  const absentCount  = Object.values(records).filter(v => v === "Absent").length;
  const lateCount    = Object.values(records).filter(v => v === "Late").length;

  return (
    <Layout>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "success" ? "#22C55E15" : "#EF444415",
          border: `1px solid ${toast.type === "success" ? "#22C55E40" : "#EF444440"}`,
          borderRadius: 12, padding: "12px 18px",
          color: toast.type === "success" ? "#22C55E" : "#EF4444",
          display: "flex", alignItems: "center", gap: 8, fontSize: 13,
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)", maxWidth: 420,
        }}>
          {toast.type === "success" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, margin: 0 }}>Mark Attendance</h1>
        <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
          Select a course and date, then mark each student's status.
        </p>
      </div>

      {/* Controls */}
      <div style={{
        background: "#37284e", borderRadius: 16, padding: 22,
        border: "1px solid rgba(124,58,237,0.15)", marginBottom: 20,
        display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "flex-end",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "#94A3B8", fontSize: 12, fontWeight: 500 }}>Course *</label>
          <select
            style={INPUT_STYLE}
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            onFocus={e => e.target.style.borderColor = "#7C3AED"}
            onBlur={e  => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
          >
            <option value="">Select course…</option>
            {courses.map(c => (
              <option key={c.COURSE_ID} value={c.COURSE_ID}>
                {c.COURSE_NAME} ({c.COURSE_CODE})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ color: "#94A3B8", fontSize: 12, fontWeight: 500 }}>Date *</label>
          <input
            type="date"
            style={INPUT_STYLE}
            value={date}
            max={new Date().toISOString().split("T")[0]}
            onChange={e => setDate(e.target.value)}
            onFocus={e => e.target.style.borderColor = "#7C3AED"}
            onBlur={e  => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || submitted || students.length === 0}
          style={{
            background: submitted
              ? "rgba(34,197,94,0.2)"
              : "linear-gradient(135deg,#7C3AED,#5B21B6)",
            border: submitted ? "1px solid #22C55E40" : "none",
            borderRadius: 10, padding: "10px 22px",
            color: submitted ? "#22C55E" : "#fff",
            fontSize: 13, fontWeight: 600,
            cursor: submitting || submitted || students.length === 0 ? "not-allowed" : "pointer",
            opacity: students.length === 0 ? 0.5 : 1,
            display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
          }}
        >
          {submitting
            ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }}/> Saving…</>
            : submitted
            ? <><CheckCircle size={14}/> Submitted</>
            : <><ClipboardList size={14}/> Submit Attendance</>
          }
        </button>
      </div>

      {/* Summary pills */}
      {students.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Present", count: presentCount, color: "#22C55E" },
            { label: "Absent",  count: absentCount,  color: "#EF4444" },
            { label: "Late",    count: lateCount,     color: "#F59E0B" },
          ].map(p => (
            <div key={p.label} style={{
              background: `${p.color}15`, border: `1px solid ${p.color}30`,
              borderRadius: 10, padding: "8px 16px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ color: p.color, fontWeight: 700, fontSize: 18 }}>{p.count}</span>
              <span style={{ color: "#94A3B8", fontSize: 12 }}>{p.label}</span>
            </div>
          ))}
          <div style={{
            background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 10, padding: "8px 16px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Users size={14} color="#7C3AED"/>
            <span style={{ color: "#94A3B8", fontSize: 12 }}>{students.length} total</span>
          </div>
        </div>
      )}

      {/* Student list */}
      {!courseId ? (
        <div style={{
          background: "#37284e", borderRadius: 16, padding: "50px 20px",
          border: "1px solid rgba(124,58,237,0.15)", textAlign: "center",
        }}>
          <ChevronDown size={32} color="#94A3B8" style={{ marginBottom: 10 }}/>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>Select a course above to load students.</p>
        </div>
      ) : students.length === 0 ? (
        <div style={{
          background: "#37284e", borderRadius: 16, padding: "50px 20px",
          border: "1px solid rgba(124,58,237,0.15)", textAlign: "center",
          color: "#94A3B8", fontSize: 13,
        }}>
          No students found.
        </div>
      ) : (
        <div style={{
          background: "#37284e", borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.25)" }}>
                {["#", "Student ID", "Name", "Department", "Status"].map(h => (
                  <th key={h} style={{
                    color: "#94A3B8", fontSize: 11, fontWeight: 600,
                    padding: "12px 16px", textAlign: "left", letterSpacing: "0.05em",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.STUDENT_ID}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px 16px", color: "#94A3B8", fontSize: 12 }}>{i + 1}</td>
                  <td style={{ padding: "10px 16px", color: "#7C3AED", fontSize: 12, fontFamily: "monospace" }}>
                    {s.STUDENT_ID}
                  </td>
                  <td style={{ padding: "10px 16px", color: "#F8FAFC", fontSize: 13, fontWeight: 500 }}>
                    {s.FULL_NAME}
                  </td>
                  <td style={{ padding: "10px 16px", color: "#94A3B8", fontSize: 12 }}>{s.DEPT_NAME}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {STATUS_OPTIONS.map(({ value, icon: Icon, color }) => {
                        const active = records[s.STUDENT_ID] === value;
                        return (
                          <button
                            key={value}
                            onClick={() => handleStatusChange(s.STUDENT_ID, value)}
                            disabled={submitted}
                            style={{
                              background: active ? `${color}20` : "rgba(255,255,255,0.04)",
                              border: `1px solid ${active ? color + "60" : "rgba(255,255,255,0.08)"}`,
                              borderRadius: 8, padding: "5px 12px",
                              color: active ? color : "#94A3B8",
                              fontSize: 11, fontWeight: active ? 600 : 400,
                              cursor: submitted ? "not-allowed" : "pointer",
                              display: "flex", alignItems: "center", gap: 4,
                              transition: "all 0.15s",
                            }}
                          >
                            <Icon size={11}/> {value}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}
