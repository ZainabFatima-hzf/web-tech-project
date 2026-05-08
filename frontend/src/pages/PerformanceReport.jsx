// src/pages/PerformanceReport.jsx  –  Member 3
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  BarChart3, TrendingUp, Award, Search,
  ChevronDown, ChevronUp, User
} from "lucide-react";

const API = "http://localhost:5000";

// ── GPA Pill ─────────────────────────────────
function GpaPill({ gpa }) {
  const num = Number(gpa);
  let color = "#EF4444";
  if (num >= 3.7) color = "#22C55E";
  else if (num >= 3.0) color = "#06B6D4";
  else if (num >= 2.0) color = "#F59E0B";
  return (
    <span style={{
      background: `${color}20`, color, border: `1px solid ${color}40`,
      borderRadius: 8, padding: "3px 11px", fontWeight: 700, fontSize: 13,
    }}>
      {num.toFixed(2)}
    </span>
  );
}

// ── Progress bar ─────────────────────────────
function Bar({ pct, color = "#7C3AED" }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 20, height: 6, overflow: "hidden", minWidth: 80 }}>
      <div style={{
        width: `${Math.min(pct, 100)}%`, height: "100%",
        background: `linear-gradient(90deg,${color},${color}99)`,
        borderRadius: 20, transition: "width 0.8s ease",
      }} />
    </div>
  );
}

// ── Expandable detail drawer ──────────────────
function StudentDetail({ studentId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/performance/report/${studentId}`)
      .then(r => r.json()).then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) return (
    <tr><td colSpan={6} style={{ padding: "20px 22px", color: "#94A3B8", fontSize: 12 }}>Loading…</td></tr>
  );
  if (!data) return null;

  return (
    <tr>
      <td colSpan={6} style={{ padding: 0 }}>
        <div style={{
          background: "rgba(0,0,0,0.25)", borderTop: "1px solid rgba(124,58,237,0.12)",
          padding: "16px 24px",
        }}>
          <div style={{ display: "flex", gap: 18, overflowX: "auto" }}>
            {data.grades?.map(g => (
              <div key={g.GRADE_ID} style={{
                background: "#37284e", borderRadius: 10,
                border: "1px solid rgba(124,58,237,0.15)",
                padding: "12px 16px", minWidth: 180, flexShrink: 0,
              }}>
                <div style={{ color: "#94A3B8", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", marginBottom: 4 }}>
                  {g.EXAM_TYPE?.toUpperCase()}
                </div>
                <div style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 12, marginBottom: 2 }}>{g.COURSE_NAME}</div>
                <div style={{ color: "#94A3B8", fontSize: 11, marginBottom: 8 }}>{g.EXAM_NAME}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#F8FAFC", fontSize: 13, fontWeight: 600 }}>
                    {g.MARKS_OBTAINED}/{g.TOTAL_MARKS}
                  </span>
                  <span style={{
                    background: gradeColor(g.GRADE_LETTER) + "22",
                    color: gradeColor(g.GRADE_LETTER),
                    borderRadius: 6, padding: "1px 8px", fontSize: 12, fontWeight: 700,
                  }}>{g.GRADE_LETTER}</span>
                </div>
                <Bar pct={g.PERCENTAGE} color={gradeColor(g.GRADE_LETTER)} />
              </div>
            ))}
            {(!data.grades || data.grades.length === 0) && (
              <span style={{ color: "#94A3B8", fontSize: 12 }}>No grades on record.</span>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

function gradeColor(letter) {
  if (!letter) return "#94A3B8";
  if (letter.startsWith("A")) return "#22C55E";
  if (letter.startsWith("B")) return "#06B6D4";
  if (letter.startsWith("C")) return "#F59E0B";
  if (letter === "D") return "#F97316";
  return "#EF4444";
}

// ── Main Report ───────────────────────────────
export default function PerformanceReport() {
  const [report,  setReport]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState("GPA");
  const [sortAsc, setSortAsc] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch(`${API}/performance/report`)
      .then(r => { if (!r.ok) throw new Error("Failed to load report"); return r.json(); })
      .then(setReport)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => setExpanded(p => p === id ? null : id);

  const toggleSort = key => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(false); }
  };

  const sorted = [...report]
    .filter(r =>
      !search ||
      r.FULL_NAME?.toLowerCase().includes(search.toLowerCase()) ||
      r.STUDENT_ID?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  // Aggregate stats
  const avgGpa  = report.length ? (report.reduce((s, r) => s + Number(r.GPA || 0), 0) / report.length).toFixed(2) : "—";
  const topGpa  = report.reduce((m, r) => Math.max(m, Number(r.GPA || 0)), 0).toFixed(2);
  const failCount = report.filter(r => Number(r.GPA) < 2.0).length;

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === col ? 1 : 0.3 }}>
      {sortKey === col && !sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    </span>
  );

  return (
    <Layout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ color: "#F8FAFC", fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <BarChart3 size={22} color="#7C3AED" /> Performance Report
        </h1>
        <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>
          GPA, averages, and detailed grade breakdowns for every student.
        </p>
      </div>

      {/* ── KPI row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { icon: TrendingUp, label: "Average GPA",   value: avgGpa,              color: "#7C3AED" },
          { icon: Award,      label: "Highest GPA",   value: topGpa,              color: "#22C55E" },
          { icon: User,       label: "Below 2.0 GPA", value: failCount,           color: "#EF4444" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{
            background: "#37284e", borderRadius: 14, padding: "18px 20px",
            border: `1px solid ${color}22`, display: "flex", gap: 14, alignItems: "center",
          }}>
            <div style={{ background: `${color}20`, borderRadius: 10, padding: 9, display: "flex" }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 22, lineHeight: 1 }}>{value}</div>
              <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 3 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Report Table ── */}
      <div style={{
        background: "#37284e", borderRadius: 16,
        border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden",
      }}>
        {/* Header toolbar */}
        <div style={{
          padding: "14px 22px", borderBottom: "1px solid rgba(124,58,237,0.12)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={16} color="#7C3AED" />
            <span style={{ color: "#F8FAFC", fontWeight: 600, fontSize: 14 }}>All Students</span>
            <span style={{
              background: "rgba(124,58,237,0.2)", color: "#A78BFA",
              borderRadius: 20, padding: "1px 9px", fontSize: 11,
            }}>{sorted.length}</span>
          </div>
          <div style={{ position: "relative" }}>
            <Search size={13} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search student…"
              style={{
                background: "#1e1329", border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 8, padding: "7px 10px 7px 30px",
                color: "#F8FAFC", fontSize: 12, outline: "none",
                fontFamily: "'Poppins', sans-serif", width: 200,
              }}
            />
          </div>
        </div>

        {loading && (
          <div style={{ color: "#94A3B8", textAlign: "center", padding: 60, fontSize: 14 }}>
            Loading performance data…
          </div>
        )}
        {error && (
          <div style={{
            background: "#EF444415", border: "1px solid #EF444440",
            margin: 18, borderRadius: 10, padding: "12px 16px",
            color: "#EF4444", fontSize: 13,
          }}>⚠ {error}</div>
        )}

        {!loading && !error && (
          <>
            {sorted.length === 0 ? (
              <div style={{ color: "#94A3B8", padding: "40px 22px", textAlign: "center", fontSize: 13 }}>
                No records found.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(0,0,0,0.2)" }}>
                      {[
                        { key: "STUDENT_ID",     label: "Student ID" },
                        { key: "FULL_NAME",       label: "Name" },
                        { key: "DEPT_NAME",       label: "Department" },
                        { key: "COURSES_TAKEN",   label: "Courses" },
                        { key: "AVG_PERCENTAGE",  label: "Avg %" },
                        { key: "GPA",             label: "GPA" },
                      ].map(({ key, label }) => (
                        <th key={key}
                          onClick={() => toggleSort(key)}
                          style={{
                            color: sortKey === key ? "#A78BFA" : "#94A3B8",
                            fontSize: 11, fontWeight: 600,
                            padding: "10px 14px", textAlign: "left",
                            letterSpacing: "0.05em", cursor: "pointer",
                            userSelect: "none",
                          }}
                        >
                          {label}<SortIcon col={key} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map(row => (
                      <>
                        <tr key={row.STUDENT_ID}
                          onClick={() => toggle(row.STUDENT_ID)}
                          style={{
                            borderTop: "1px solid rgba(255,255,255,0.04)",
                            cursor: "pointer",
                            background: expanded === row.STUDENT_ID ? "rgba(124,58,237,0.1)" : "transparent",
                          }}
                          onMouseEnter={e => { if (expanded !== row.STUDENT_ID) e.currentTarget.style.background = "rgba(124,58,237,0.06)"; }}
                          onMouseLeave={e => { if (expanded !== row.STUDENT_ID) e.currentTarget.style.background = "transparent"; }}
                        >
                          <td style={{ padding: "11px 14px", color: "#7C3AED", fontSize: 12, fontFamily: "monospace" }}>
                            {row.STUDENT_ID}
                          </td>
                          <td style={{ padding: "11px 14px", color: "#F8FAFC", fontSize: 13, fontWeight: 500 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {row.FULL_NAME}
                              {expanded === row.STUDENT_ID
                                ? <ChevronUp size={13} color="#7C3AED" />
                                : <ChevronDown size={13} color="#94A3B8" />}
                            </div>
                          </td>
                          <td style={{ padding: "11px 14px", color: "#94A3B8", fontSize: 12 }}>{row.DEPT_NAME}</td>
                          <td style={{ padding: "11px 14px", color: "#F8FAFC", fontSize: 13, textAlign: "center" }}>
                            {row.COURSES_TAKEN ?? "—"}
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#F8FAFC", fontSize: 13, minWidth: 36 }}>
                                {row.AVG_PERCENTAGE != null ? `${row.AVG_PERCENTAGE}%` : "—"}
                              </span>
                              {row.AVG_PERCENTAGE != null && (
                                <Bar pct={row.AVG_PERCENTAGE} color="#06B6D4" />
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <GpaPill gpa={row.GPA} />
                          </td>
                        </tr>
                        {expanded === row.STUDENT_ID && (
                          <StudentDetail key={`detail-${row.STUDENT_ID}`} studentId={row.STUDENT_ID} />
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
