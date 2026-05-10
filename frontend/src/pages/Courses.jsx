// src/pages/Courses.jsx  –  Member 2
// Displays all courses. Data comes from Member 3's /courses endpoint.
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { BookOpen, Search, Hash, Clock, Building2 } from "lucide-react";

const API = "http://localhost:5000";

const INPUT_STYLE = {
  width: "100%", background: "#1e1329",
  border: "1px solid rgba(124,58,237,0.25)", borderRadius: 8,
  color: "#F8FAFC", padding: "9px 14px", fontSize: 13,
  outline: "none", boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
};

const DEPT_COLORS = {
  1: { bg: "rgba(124,58,237,0.12)", color: "#a78bfa" },
  2: { bg: "rgba(6,182,212,0.12)",  color: "#22d3ee" },
  3: { bg: "rgba(34,197,94,0.12)",  color: "#4ade80" },
  4: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24" },
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch(`${API}/performance/courses`)
      .then(r => { if (!r.ok) throw new Error("Failed to load courses."); return r.json(); })
      .then(data => setCourses(data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.COURSE_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    c.COURSE_CODE?.toLowerCase().includes(search.toLowerCase())
  );

  // group by dept_id for summary
  const deptCount = courses.reduce((acc, c) => {
    acc[c.DEPT_ID] = (acc[c.DEPT_ID] || 0) + 1;
    return acc;
  }, {});

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, margin: 0 }}>Courses</h1>
          <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
            {courses.length} course{courses.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {/* Summary cards */}
      {!loading && !error && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 14, marginBottom: 24,
        }}>
          <div style={{
            background: "#37284e", borderRadius: 14, padding: "16px 18px",
            border: "1px solid rgba(124,58,237,0.15)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ background: "rgba(124,58,237,0.15)", borderRadius: 8, padding: 8 }}>
              <BookOpen size={16} color="#7C3AED"/>
            </div>
            <div>
              <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{courses.length}</div>
              <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>Total Courses</div>
            </div>
          </div>
          <div style={{
            background: "#37284e", borderRadius: 14, padding: "16px 18px",
            border: "1px solid rgba(124,58,237,0.15)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ background: "rgba(6,182,212,0.15)", borderRadius: 8, padding: 8 }}>
              <Clock size={16} color="#06B6D4"/>
            </div>
            <div>
              <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                {courses.reduce((s, c) => s + (Number(c.CREDIT_HOURS) || 0), 0)}
              </div>
              <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>Total Credit Hours</div>
            </div>
          </div>
          <div style={{
            background: "#37284e", borderRadius: 14, padding: "16px 18px",
            border: "1px solid rgba(124,58,237,0.15)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ background: "rgba(34,197,94,0.15)", borderRadius: 8, padding: 8 }}>
              <Building2 size={16} color="#22C55E"/>
            </div>
            <div>
              <div style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                {Object.keys(deptCount).length}
              </div>
              <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>Departments</div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 360, marginBottom: 20 }}>
        <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}/>
        <input
          style={{ ...INPUT_STYLE, paddingLeft: 34 }}
          placeholder="Search by name or code…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={e => e.target.style.borderColor = "#7C3AED"}
          onBlur={e  => e.target.style.borderColor = "rgba(124,58,237,0.25)"}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 12, padding: "14px 18px", color: "#FCA5A5", fontSize: 13,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ color: "#94A3B8", textAlign: "center", padding: 60, fontSize: 13 }}>
          Loading courses…
        </div>
      )}

      {/* Courses table */}
      {!loading && !error && (
        <div style={{
          background: "#37284e", borderRadius: 16,
          border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.25)" }}>
                {["#", "Course Name", "Code", "Credit Hours", "Department"].map(h => (
                  <th key={h} style={{
                    color: "#94A3B8", fontSize: 11, fontWeight: 600,
                    padding: "12px 16px", textAlign: "left", letterSpacing: "0.05em",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ color: "#94A3B8", padding: "40px", textAlign: "center", fontSize: 13 }}>
                    {search ? "No courses match your search." : "No courses found."}
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => {
                  const deptStyle = DEPT_COLORS[c.DEPT_ID] || { bg: "rgba(124,58,237,0.12)", color: "#a78bfa" };
                  return (
                    <tr key={c.COURSE_ID}
                      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.07)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "11px 16px", color: "#475569", fontSize: 12 }}>{i + 1}</td>
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ background: "rgba(124,58,237,0.12)", borderRadius: 6, padding: 5, display: "flex" }}>
                            <BookOpen size={13} color="#7C3AED"/>
                          </div>
                          <span style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 500 }}>{c.COURSE_NAME}</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{
                          background: "rgba(124,58,237,0.12)", color: "#a78bfa",
                          borderRadius: 6, padding: "3px 10px", fontSize: 12,
                          fontFamily: "monospace", fontWeight: 600,
                        }}>
                          <Hash size={10} style={{ display: "inline", marginRight: 3 }}/>{c.COURSE_CODE}
                        </span>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Clock size={12} color="#94A3B8"/>
                          <span style={{ color: "#F8FAFC", fontSize: 13 }}>{c.CREDIT_HOURS} hrs</span>
                        </div>
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span style={{
                          background: deptStyle.bg, color: deptStyle.color,
                          borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 600,
                        }}>
                          Dept {c.DEPT_ID}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}