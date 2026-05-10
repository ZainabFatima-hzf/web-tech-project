// src/pages/StudentPortal.jsx
// Student-facing page — no sidebar, clean self-contained interface
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, AlertTriangle, XCircle,
  BookOpen, ClipboardList, TrendingUp, GraduationCap,
  ShieldAlert, ShieldCheck, Loader2
} from "lucide-react";

const API = "http://localhost:5000";

// ── helpers ──────────────────────────────────────────────
const attColor  = pct => pct == null ? "#94A3B8" : pct >= 75 ? "#22C55E" : pct >= 60 ? "#F59E0B" : "#EF4444";
const gradeColor = pct => pct == null ? "#94A3B8" : pct >= 60 ? "#22C55E" : pct >= 45 ? "#F59E0B" : "#EF4444";

function Ring({ pct, color, size = 80 }) {
  const r   = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = pct != null ? (pct / 100) * circ : 0;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill={color} fontSize={size * 0.18} fontWeight={700}
        style={{ transform: "rotate(90deg)", transformOrigin: "center", fontFamily: "'Poppins',sans-serif" }}>
        {pct != null ? `${pct}%` : "—"}
      </text>
    </svg>
  );
}

function WarningBanner({ type, message }) {
  const isRisk = type === "risk";
  return (
    <div style={{
      background: isRisk ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)",
      border: `1px solid ${isRisk ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
      borderRadius: 14, padding: "14px 18px",
      display: "flex", alignItems: "flex-start", gap: 12,
    }}>
      {isRisk
        ? <ShieldAlert size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }}/>
        : <ShieldCheck size={20} color="#22C55E" style={{ flexShrink: 0, marginTop: 1 }}/>
      }
      <p style={{ color: isRisk ? "#FCA5A5" : "#86EFAC", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
        {message}
      </p>
    </div>
  );
}

function CourseCard({ course, attendance, grades }) {
  const att     = attendance?.ATTENDANCE_PCT;
  const attBad  = att != null && att < 75;

  // avg % from grades for this course
  const courseGrades = grades.filter(g => g.COURSE_NAME === course);
  const avgPct = courseGrades.length > 0
    ? Math.round(courseGrades.reduce((s, g) => s + (g.MARKS_OBTAINED / g.TOTAL_MARKS * 100), 0) / courseGrades.length)
    : null;
  const gradeBad = avgPct != null && avgPct < 50;

  return (
    <div style={{
      background: (attBad || gradeBad) ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${(attBad || gradeBad) ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 16, padding: "20px 22px",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Course name + warning icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BookOpen size={15} color="#7C3AED"/>
          <span style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 600 }}>{course}</span>
        </div>
        {(attBad || gradeBad) && <AlertTriangle size={15} color="#EF4444"/>}
      </div>

      {/* Rings */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <Ring pct={att} color={attColor(att)} size={76}/>
          <span style={{ color: "#94A3B8", fontSize: 11 }}>Attendance</span>
          {attBad && (
            <span style={{ color: "#EF4444", fontSize: 10, fontWeight: 600, textAlign: "center" }}>
              ⚠ Below 75% — XF Risk
            </span>
          )}
        </div>

        <div style={{ width: 1, height: 80, background: "rgba(255,255,255,0.07)" }}/>

        <div style={{ flex: 1 }}>
          <div style={{ color: "#94A3B8", fontSize: 11, marginBottom: 8 }}>Recent Grades</div>
          {courseGrades.length === 0 ? (
            <span style={{ color: "#475569", fontSize: 12 }}>No grades recorded yet</span>
          ) : (
            courseGrades.slice(0, 3).map((g, i) => {
              const pct = Math.round(g.MARKS_OBTAINED / g.TOTAL_MARKS * 100);
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 5,
                }}>
                  <span style={{ color: "#94A3B8", fontSize: 11 }}>{g.EXAM_NAME} ({g.EXAM_TYPE})</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: gradeColor(pct), fontSize: 12, fontWeight: 600 }}>{pct}%</span>
                    <span style={{
                      background: `${gradeColor(pct)}20`, color: gradeColor(pct),
                      borderRadius: 6, padding: "1px 7px", fontSize: 11, fontWeight: 700,
                    }}>{g.GRADE_LETTER}</span>
                  </div>
                </div>
              );
            })
          )}
          {gradeBad && (
            <div style={{
              marginTop: 8, background: "rgba(239,68,68,0.1)",
              borderRadius: 8, padding: "6px 10px",
              color: "#FCA5A5", fontSize: 11,
            }}>
              ⚠ Average below 50% — low performance
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function StudentPortal() {
  const [inputId, setInputId]     = useState("");
  const [student, setStudent]     = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [searched, setSearched]   = useState(false);
  const navigate = useNavigate();
  const handleSearch = async () => {
    const id = inputId.trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const [stuRes, attRes, gradesRes] = await Promise.all([
        fetch(`${API}/students/${id}`),
        fetch(`${API}/attendance/summary?student_id=${id}`),
        fetch(`${API}/performance/marks?student_id=${id}`),
      ]);

      if (!stuRes.ok) throw new Error("Student ID not found. Please check and try again.");

      const [stu, att, gr] = await Promise.all([
        stuRes.json(), attRes.json(), gradesRes.json(),
      ]);

      setStudent(stu);
      setAttendance(Array.isArray(att) ? att : []);
      setGrades(Array.isArray(gr) ? gr : []);
    } catch (e) {
      setError(e.message);
      setStudent(null);
      setAttendance([]);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  // Derive risk flags
  const attRisk   = attendance.filter(a => a.ATTENDANCE_PCT != null && a.ATTENDANCE_PCT < 75);
  const gradeRisk = (() => {
    const byCourse = {};
    grades.forEach(g => {
      if (!byCourse[g.COURSE_NAME]) byCourse[g.COURSE_NAME] = [];
      byCourse[g.COURSE_NAME].push(g.MARKS_OBTAINED / g.TOTAL_MARKS * 100);
    });
    return Object.entries(byCourse)
      .filter(([, pcts]) => pcts.reduce((a, b) => a + b, 0) / pcts.length < 50)
      .map(([name]) => name);
  })();

  const allCourses = [...new Set([
    ...attendance.map(a => a.COURSE_NAME),
    ...grades.map(g => g.COURSE_NAME),
  ])];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0a1a",
      fontFamily: "'Poppins', sans-serif",
      padding: "0 0 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a0d2e 0%, #0f0a1a 100%)",
        borderBottom: "1px solid rgba(124,58,237,0.15)",
        padding: "28px 32px",
        display: "flex", alignItems: "center", gap: 14,
        justifyContent: "space-between",
      }}>
        <div style={{
          background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
          borderRadius: 12, padding: 10, display: "flex",
        }}>
          <GraduationCap size={22} color="#fff"/>
        </div>
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 18, fontWeight: 700, margin: 0 }}>
            Student Portal
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 12, margin: 0 }}>
            Check your attendance & academic standing
          </p>
        </div>
        <button
        onClick={() => navigate("/dashboard")}
        style={{
          background: "rgb(82, 113, 224)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "7px 16px",
          color: "#f7f8f9", fontSize: 12, fontWeight: 600,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
        }}
      >
        <GraduationCap size={14}/>
        ← Teacher Dashboard
      </button>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 0" }}>

        {/* ── Search ── */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: 18, padding: "28px 28px",
          marginBottom: 28,
        }}>
          <h2 style={{ color: "#F8FAFC", fontSize: 15, fontWeight: 600, margin: "0 0 6px" }}>
            Enter your Student ID
          </h2>
          <p style={{ color: "#94A3B8", fontSize: 12, margin: "0 0 18px" }}>
            e.g. STU-2025-0001
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <input
              style={{
                flex: 1, background: "#1a0d2e",
                border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10,
                color: "#F8FAFC", padding: "11px 16px", fontSize: 14,
                outline: "none", fontFamily: "'Poppins',sans-serif",
                letterSpacing: "0.05em",
              }}
              placeholder="STU-2025-XXXX"
              value={inputId}
              onChange={e => setInputId(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              onFocus={e => e.target.style.borderColor = "#7C3AED"}
              onBlur={e  => e.target.style.borderColor = "rgba(124,58,237,0.3)"}
            />
            <button onClick={handleSearch} disabled={loading} style={{
              background: "linear-gradient(135deg,#7C3AED,#5B21B6)",
              border: "none", borderRadius: 10, padding: "11px 22px",
              color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 7,
              boxShadow: "0 4px 18px rgba(124,58,237,0.35)",
            }}>
              {loading
                ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }}/> Checking…</>
                : <><Search size={15}/> Check Status</>
              }
            </button>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "14px 18px", color: "#FCA5A5",
            display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 20,
          }}>
            <XCircle size={16} color="#EF4444"/> {error}
          </div>
        )}

        {/* ── Results ── */}
        {student && (
          <>
            {/* Student info card */}
            <div style={{
              background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 16, padding: "18px 22px", marginBottom: 20,
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
            }}>
              <div>
                <div style={{ color: "#F8FAFC", fontSize: 17, fontWeight: 700 }}>{student.FULL_NAME}</div>
                <div style={{ color: "#94A3B8", fontSize: 12, marginTop: 3 }}>
                  {student.DEPT_NAME} · Semester {student.SEMESTER} · {student.STUDENT_ID}
                </div>
              </div>
              <span style={{
                background: student.STATUS === "Active" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                color: student.STATUS === "Active" ? "#22C55E" : "#EF4444",
                borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600,
              }}>{student.STATUS}</span>
            </div>

            {/* ── Overall warnings ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {attRisk.length === 0 && gradeRisk.length === 0 ? (
                <WarningBanner type="ok" message="✓ All good! Your attendance and grades are within acceptable limits across all courses."/>
              ) : (
                <>
                  {attRisk.length > 0 && (
                    <WarningBanner type="risk" message={
                      `⚠ ATTENDANCE WARNING: Your attendance is below 75% in ${attRisk.length} course(s): ` +
                      attRisk.map(a => `${a.COURSE_NAME} (${a.ATTENDANCE_PCT}%)`).join(", ") +
                      ". You may be barred from the final exam and receive an XF grade if this is not resolved."
                    }/>
                  )}
                  {gradeRisk.length > 0 && (
                    <WarningBanner type="risk" message={
                      `⚠ GRADE WARNING: Your average marks are below 50% in: ` +
                      gradeRisk.join(", ") +
                      ". Speak to your instructor or academic advisor as soon as possible."
                    }/>
                  )}
                </>
              )}
            </div>

            {/* ── Quick stats ── */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3,1fr)",
              gap: 12, marginBottom: 24,
            }}>
              {[
                { icon: ClipboardList, label: "Courses Tracked", value: allCourses.length, color: "#7C3AED" },
                { icon: AlertTriangle, label: "Attendance Alerts", value: attRisk.length,  color: attRisk.length > 0 ? "#EF4444" : "#22C55E" },
                { icon: TrendingUp,   label: "Grade Alerts",      value: gradeRisk.length, color: gradeRisk.length > 0 ? "#EF4444" : "#22C55E" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12, padding: "16px 18px",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{ background: `${color}20`, borderRadius: 8, padding: 8 }}>
                    <Icon size={16} color={color}/>
                  </div>
                  <div>
                    <div style={{ color: "#F8FAFC", fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{value}</div>
                    <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Per-course cards ── */}
            {allCourses.length === 0 ? (
              <div style={{
                background: "rgba(255,255,255,0.02)", borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "50px 20px", textAlign: "center", color: "#94A3B8", fontSize: 13,
              }}>
                No attendance or grade records found yet. Check back after classes begin.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <h3 style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", margin: 0 }}>
                  COURSE BREAKDOWN
                </h3>
                {allCourses.map(course => (
                  <CourseCard
                    key={course}
                    course={course}
                    attendance={attendance.find(a => a.COURSE_NAME === course)}
                    grades={grades}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {searched && !loading && !student && !error && (
          <div style={{ color: "#94A3B8", textAlign: "center", fontSize: 13 }}>
            No results found.
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
