// src/pages/Dashboard.jsx  –  Member 1
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  Users, TrendingUp, AlertTriangle, Activity,
  ArrowUpRight, BookOpen
} from "lucide-react";

const API = "http://localhost:5000";

// ── Reusable KPI card ───────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, color, glow }) {
  return (
    <div style={{
      background: "#37284e",
      borderRadius: 16,
      padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 8,
      boxShadow: glow ? `0 0 18px ${glow}30` : "0 4px 20px rgba(0,0,0,0.3)",
      border: `1px solid ${color}25`,
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${color}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = glow ? `0 0 18px ${glow}30` : "0 4px 20px rgba(0,0,0,0.3)"; }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ background:`${color}20`, borderRadius:10, padding:9, display:"flex" }}>
          <Icon size={20} color={color} />
        </div>
        <ArrowUpRight size={14} color="#94A3B8" />
      </div>
      <div style={{ fontSize:30, fontWeight:700, color:"#F8FAFC", lineHeight:1 }}>
        {value ?? "—"}
      </div>
      <div style={{ color:"#94A3B8", fontSize:12 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:color }}>{sub}</div>}
    </div>
  );
}

// ── Risk badge ───────────────────────────────────────────
function RiskBadge({ level }) {
  const map = {
    Critical:       { bg:"#EF444420", color:"#EF4444" },
    "Low Attendance":{ bg:"#F59E0B20", color:"#F59E0B" },
    "Low Marks":     { bg:"#EC489920", color:"#EC4899" },
    Watch:          { bg:"#06B6D420", color:"#06B6D4" },
  };
  const style = map[level] || map.Watch;
  return (
    <span style={{
      background: style.bg, color: style.color,
      borderRadius: 20, padding:"2px 10px", fontSize:11, fontWeight:600,
    }}>{level}</span>
  );
}

// ── Main Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/dashboard`)
      .then(r => { if (!r.ok) throw new Error("Failed to load dashboard"); return r.json(); })
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const summary = data?.summary || {};

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ color:"#F8FAFC", fontSize:22, fontWeight:700, margin:0 }}>Dashboard</h1>
        <p style={{ color:"#94A3B8", fontSize:13, marginTop:4 }}>
          Real-time overview of student performance & attendance.
        </p>
      </div>

      {loading && (
        <div style={{ color:"#94A3B8", textAlign:"center", padding:60, fontSize:14 }}>
          Loading dashboard data…
        </div>
      )}

      {error && (
        <div style={{
          background:"#EF444415", border:"1px solid #EF444440",
          borderRadius:12, padding:"16px 20px", color:"#EF4444", fontSize:13
        }}>
          ⚠ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── KPI Cards ── */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",
            gap:18, marginBottom:28,
          }}>
            <KpiCard
              icon={Users} label="Total Students"
              value={summary.TOTAL_STUDENTS}
              sub="Active enrolments"
              color="#7C3AED" glow="#7C3AED"
            />
            <KpiCard
              icon={Activity} label="Avg Attendance"
              value={summary.OVERALL_ATTENDANCE_PCT != null ? `${summary.OVERALL_ATTENDANCE_PCT}%` : "—"}
              sub={summary.OVERALL_ATTENDANCE_PCT >= 75 ? "✓ Above threshold" : "⚠ Below 75%"}
              color="#22C55E" glow="#22C55E"
            />
            <KpiCard
              icon={TrendingUp} label="Avg Marks"
              value={summary.OVERALL_AVG_MARKS != null ? `${summary.OVERALL_AVG_MARKS}` : "—"}
              sub="Out of 100"
              color="#06B6D4" glow="#06B6D4"
            />
            <KpiCard
              icon={AlertTriangle} label="At-Risk Students"
              value={summary.AT_RISK_COUNT}
              sub="Require attention"
              color="#EF4444" glow="#EF4444"
            />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:18, alignItems:"start" }}>

            {/* ── At-Risk Table ── */}
            <div style={{
              background:"#37284e", borderRadius:16,
              border:"1px solid rgba(124,58,237,0.15)",
              overflow:"hidden",
            }}>
              <div style={{
                padding:"16px 22px", borderBottom:"1px solid rgba(124,58,237,0.12)",
                display:"flex", alignItems:"center", gap:10,
              }}>
                <AlertTriangle size={16} color="#EF4444" />
                <span style={{ color:"#F8FAFC", fontWeight:600, fontSize:14 }}>At-Risk Students</span>
              </div>
              {data?.at_risk?.length === 0 ? (
                <div style={{ color:"#94A3B8", padding:"30px 22px", fontSize:13, textAlign:"center" }}>
                  🎉 No at-risk students right now.
                </div>
              ) : (
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"rgba(0,0,0,0.2)" }}>
                      {["Student ID","Name","Attendance","Avg Marks","Risk"].map(h => (
                        <th key={h} style={{
                          color:"#94A3B8", fontSize:11, fontWeight:600,
                          padding:"10px 14px", textAlign:"left", letterSpacing:"0.05em",
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.at_risk || []).map((s, i) => (
                      <tr key={s.STUDENT_ID}
                        style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={e=>e.currentTarget.style.background="rgba(124,58,237,0.07)"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      >
                        <td style={{ padding:"10px 14px", color:"#7C3AED", fontSize:12, fontFamily:"monospace" }}>{s.STUDENT_ID}</td>
                        <td style={{ padding:"10px 14px", color:"#F8FAFC", fontSize:13 }}>{s.FULL_NAME}</td>
                        <td style={{ padding:"10px 14px", color: s.ATTENDANCE_PCT < 75 ? "#EF4444":"#22C55E", fontSize:13 }}>
                          {s.ATTENDANCE_PCT != null ? `${s.ATTENDANCE_PCT}%` : "—"}
                        </td>
                        <td style={{ padding:"10px 14px", color: s.AVG_MARKS < 40 ? "#EF4444":"#22C55E", fontSize:13 }}>
                          {s.AVG_MARKS ?? "—"}
                        </td>
                        <td style={{ padding:"10px 14px" }}><RiskBadge level={s.RISK_LEVEL} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── Dept Breakdown ── */}
            <div style={{
              background:"#37284e", borderRadius:16,
              border:"1px solid rgba(124,58,237,0.15)",
              overflow:"hidden",
            }}>
              <div style={{
                padding:"16px 22px", borderBottom:"1px solid rgba(124,58,237,0.12)",
                display:"flex", alignItems:"center", gap:10,
              }}>
                <BookOpen size={16} color="#06B6D4" />
                <span style={{ color:"#F8FAFC", fontWeight:600, fontSize:14 }}>By Department</span>
              </div>
              <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
                {(data?.by_department || []).map(d => {
                  const pct = d.STUDENT_COUNT && summary.TOTAL_STUDENTS
                    ? Math.round(d.STUDENT_COUNT / summary.TOTAL_STUDENTS * 100) : 0;
                  return (
                    <div key={d.DEPT_NAME}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ color:"#F8FAFC", fontSize:12 }}>{d.DEPT_NAME}</span>
                        <span style={{ color:"#94A3B8", fontSize:12 }}>{d.STUDENT_COUNT}</span>
                      </div>
                      <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:20, height:6, overflow:"hidden" }}>
                        <div style={{
                          width:`${pct}%`, height:"100%",
                          background:"linear-gradient(90deg,#7C3AED,#06B6D4)",
                          borderRadius:20, transition:"width 0.8s ease",
                        }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </>
      )}
    </Layout>
  );
}
