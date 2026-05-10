// src/pages/AttendanceView.jsx  –  Member 2
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Search, Filter, TrendingDown, CheckCircle, XCircle, Clock } from "lucide-react";

const API = "http://localhost:5000";

const INPUT_STYLE = {
  width: "100%", background: "#1e1329",
  border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8,
  color: "#F8FAFC", padding: "9px 14px", fontSize: 13,
  outline: "none", boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
};

function PctBadge({ pct }) {
  const color = pct === null ? "#94A3B8"
    : pct >= 75 ? "#22C55E"
    : pct >= 60 ? "#F59E0B"
    : "#EF4444";
  return (
    <span style={{
      background: `${color}20`, color, borderRadius: 20,
      padding: "2px 10px", fontSize: 12, fontWeight: 600,
    }}>
      {pct != null ? `${pct}%` : "—"}
    </span>
  );
}

export default function AttendanceView() {
  const [summary, setSummary]   = useState([]);
  const [records, setRecords]   = useState([]);
  const [courses, setCourses]   = useState([]);
  const [tab, setTab]           = useState("summary");   // "summary" | "records"
  const [filters, setFilters]   = useState({ student_id: "", course_id: "", date: "" });
  const [loading, setLoading]   = useState(false);

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  // Load courses for filter dropdown
  useEffect(() => {
    fetch(`${API}/attendance/courses`)
      .then(r => r.json()).then(setCourses).catch(() => {});
  }, []);

  // Load summary
  useEffect(() => {
    if (tab !== "summary") return;
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.student_id) params.set("student_id", filters.student_id);
    if (filters.course_id)  params.set("course_id",  filters.course_id);
    fetch(`${API}/attendance/summary?${params}`)
      .then(r => r.json()).then(setSummary).catch(() => setSummary([]))
      .finally(() => setLoading(false));
  }, [tab, filters.student_id, filters.course_id]);

  // Load records
  useEffect(() => {
    if (tab !== "records") return;
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.student_id) params.set("student_id", filters.student_id);
    if (filters.course_id)  params.set("course_id",  filters.course_id);
    if (filters.date)       params.set("date",        filters.date);
    fetch(`${API}/attendance?${params}`)
      .then(r => r.json()).then(setRecords).catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [tab, filters.student_id, filters.course_id, filters.date]);

  const tabStyle = (active) => ({
    padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
    border: "none", cursor: "pointer",
    background: active ? "linear-gradient(135deg,#7C3AED,#5B21B6)" : "rgba(255,255,255,0.05)",
    color: active ? "#fff" : "#94A3B8",
    transition: "all 0.15s",
  });

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, margin: 0 }}>Attendance</h1>
        <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
          View attendance records and summaries.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button style={tabStyle(tab === "summary")} onClick={() => setTab("summary")}>
          Summary by Student
        </button>
        <button style={tabStyle(tab === "records")} onClick={() => setTab("records")}>
          Detailed Records
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: "#37284e", borderRadius: 14, padding: "16px 20px",
        border: "1px solid rgba(124,58,237,0.15)", marginBottom: 20,
        display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap",
      }}>
        <Filter size={15} color="#94A3B8"/>

        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={13} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}/>
          <input
            style={{ ...INPUT_STYLE, paddingLeft: 30 }}
            placeholder="Student ID…"
            value={filters.student_id}
            onChange={e => setFilter("student_id", e.target.value.toUpperCase())}
            onFocus={e => e.target.style.borderColor = "#7C3AED"}
            onBlur={e  => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
          />
        </div>

        <select
          style={{ ...INPUT_STYLE, flex: 1, minWidth: 180 }}
          value={filters.course_id}
          onChange={e => setFilter("course_id", e.target.value)}
          onFocus={e => e.target.style.borderColor = "#7C3AED"}
          onBlur={e  => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
        >
          <option value="">All courses</option>
          {courses.map(c => (
            <option key={c.COURSE_ID} value={c.COURSE_ID}>{c.COURSE_NAME}</option>
          ))}
        </select>

        {tab === "records" && (
          <input
            type="date"
            style={{ ...INPUT_STYLE, flex: 1, minWidth: 160 }}
            value={filters.date}
            onChange={e => setFilter("date", e.target.value)}
            onFocus={e => e.target.style.borderColor = "#7C3AED"}
            onBlur={e  => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
          />
        )}

        {(filters.student_id || filters.course_id || filters.date) && (
          <button
            onClick={() => setFilters({ student_id: "", course_id: "", date: "" })}
            style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 8, padding: "8px 14px", color: "#EF4444",
              fontSize: 12, cursor: "pointer",
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Summary Tab ── */}
      {tab === "summary" && (
        <div style={{
          background: "#37284e", borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.25)" }}>
                {["Student ID","Name","Course","Total","Present","Absent","Late","Attendance %"].map(h => (
                  <th key={h} style={{
                    color: "#94A3B8", fontSize: 11, fontWeight: 600,
                    padding: "12px 14px", textAlign: "left", letterSpacing: "0.05em",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ color: "#94A3B8", padding: "40px", textAlign: "center", fontSize: 13 }}>
                  Loading…
                </td></tr>
              ) : summary.length === 0 ? (
                <tr><td colSpan={8} style={{ color: "#94A3B8", padding: "40px", textAlign: "center", fontSize: 13 }}>
                  No attendance records found.
                </td></tr>
              ) : summary.map(r => (
                <tr key={`${r.STUDENT_ID}-${r.COURSE_ID}`}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px 14px", color: "#7C3AED", fontSize: 12, fontFamily: "monospace" }}>{r.STUDENT_ID}</td>
                  <td style={{ padding: "10px 14px", color: "#F8FAFC", fontSize: 13 }}>{r.FULL_NAME}</td>
                  <td style={{ padding: "10px 14px", color: "#94A3B8", fontSize: 12 }}>{r.COURSE_NAME}</td>
                  <td style={{ padding: "10px 14px", color: "#F8FAFC", fontSize: 13, textAlign: "center" }}>{r.TOTAL_CLASSES}</td>
                  <td style={{ padding: "10px 14px", color: "#22C55E", fontSize: 13, textAlign: "center" }}>{r.PRESENT_COUNT}</td>
                  <td style={{ padding: "10px 14px", color: "#EF4444", fontSize: 13, textAlign: "center" }}>{r.ABSENT_COUNT}</td>
                  <td style={{ padding: "10px 14px", color: "#F59E0B", fontSize: 13, textAlign: "center" }}>{r.LATE_COUNT}</td>
                  <td style={{ padding: "10px 14px" }}><PctBadge pct={r.ATTENDANCE_PCT}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Records Tab ── */}
      {tab === "records" && (
        <div style={{
          background: "#37284e", borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.25)" }}>
                {["Date","Student ID","Name","Course","Status","Remarks","Marked At"].map(h => (
                  <th key={h} style={{
                    color: "#94A3B8", fontSize: 11, fontWeight: 600,
                    padding: "12px 14px", textAlign: "left", letterSpacing: "0.05em",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ color: "#94A3B8", padding: "40px", textAlign: "center", fontSize: 13 }}>
                  Loading…
                </td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={7} style={{ color: "#94A3B8", padding: "40px", textAlign: "center", fontSize: 13 }}>
                  No records found.
                </td></tr>
              ) : records.map(r => (
                <tr key={r.ATTENDANCE_ID}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px 14px", color: "#94A3B8", fontSize: 12 }}>{r.ATTEND_DATE}</td>
                  <td style={{ padding: "10px 14px", color: "#7C3AED", fontSize: 12, fontFamily: "monospace" }}>{r.STUDENT_ID}</td>
                  <td style={{ padding: "10px 14px", color: "#F8FAFC", fontSize: 13 }}>{r.FULL_NAME}</td>
                  <td style={{ padding: "10px 14px", color: "#94A3B8", fontSize: 12 }}>{r.COURSE_NAME}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{
                      display: "flex", alignItems: "center", gap: 5,
                      color: r.STATUS === "Present" ? "#22C55E" : r.STATUS === "Absent" ? "#EF4444" : "#F59E0B",
                      fontSize: 12, fontWeight: 600,
                    }}>
                      {r.STATUS === "Present" ? <CheckCircle size={12}/>
                        : r.STATUS === "Absent" ? <XCircle size={12}/>
                        : <Clock size={12}/>}
                      {r.STATUS}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#94A3B8", fontSize: 12 }}>{r.REMARKS || "—"}</td>
                  <td style={{ padding: "10px 14px", color: "#94A3B8", fontSize: 11 }}>{r.MARKED_AT}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
