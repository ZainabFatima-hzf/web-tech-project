// src/pages/Students.jsx  –  Member 1
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { UserPlus, Search, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const API = "http://localhost:5000";

const INPUT_STYLE = {
  width:"100%", background:"#1e1329",
  border:"1px solid rgba(124,58,237,0.25)", borderRadius:8,
  color:"#F8FAFC", padding:"10px 14px", fontSize:13,
  outline:"none", boxSizing:"border-box",
  fontFamily:"'Poppins', sans-serif",
};

function FormField({ label, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ color:"#94A3B8", fontSize:12, fontWeight:500 }}>{label}</label>
      {children}
    </div>
  );
}

export default function Students() {
  const [students, setStudents]     = useState([]);
  const [depts, setDepts]           = useState([]);
  const [search, setSearch]         = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState(null);   // { type, msg }

  const [form, setForm] = useState({
    full_name:"", email:"", phone:"", dept_id:"", semester:"",
  });
  const [errors, setErrors] = useState({});

  // ── Fetch students & departments ────────────────────────
  const loadStudents = () => {
    fetch(`${API}/students`)
      .then(r => r.json())
      .then(setStudents)
      .catch(() => showToast("error", "Failed to load students."));
  };

  useEffect(() => {
    loadStudents();
    fetch(`${API}/students/departments/all`)
      .then(r => r.json())
      .then(setDepts)
      .catch(() => {});
  }, []);

  // ── Toast helper ─────────────────────────────────────────
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Form validation ──────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.email.trim())     e.email     = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.dept_id)          e.dept_id   = "Select a department";
    if (!form.semester)         e.semester  = "Select a semester";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/students`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register.");
      showToast("success", `Student registered! ID: ${data.student_id}`);
      setForm({ full_name:"", email:"", phone:"", dept_id:"", semester:"" });
      setShowForm(false);
      loadStudents();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Filtered list ────────────────────────────────────────
  const filtered = students.filter(s =>
    s.FULL_NAME?.toLowerCase().includes(search.toLowerCase()) ||
    s.STUDENT_ID?.toLowerCase().includes(search.toLowerCase()) ||
    s.EMAIL?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:999,
          background: toast.type === "success" ? "#22C55E15" : "#EF444415",
          border:`1px solid ${toast.type === "success" ? "#22C55E40":"#EF444440"}`,
          borderRadius:12, padding:"12px 18px",
          color: toast.type === "success" ? "#22C55E":"#EF4444",
          display:"flex", alignItems:"center", gap:8, fontSize:13,
          boxShadow:"0 8px 30px rgba(0,0,0,0.4)",
        }}>
          {toast.type === "success" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
          {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <h1 style={{ color:"#F8FAFC", fontSize:22, fontWeight:700, margin:0 }}>Students</h1>
          <p style={{ color:"#94A3B8", fontSize:13, marginTop:4 }}>
            {students.length} registered student{students.length !== 1 ? "s":""}
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{
          background:"linear-gradient(135deg,#7C3AED,#5B21B6)",
          border:"none", borderRadius:10, padding:"10px 18px",
          color:"#fff", fontSize:13, fontWeight:600,
          cursor:"pointer", display:"flex", alignItems:"center", gap:6,
          boxShadow:"0 4px 14px rgba(124,58,237,0.4)",
        }}>
          <UserPlus size={16}/> Add Student
        </button>
      </div>

      {/* ── Registration Form ── */}
      {showForm && (
        <div style={{
          background:"#37284e", borderRadius:16, padding:26,
          border:"1px solid rgba(124,58,237,0.2)",
          marginBottom:24,
          boxShadow:"0 8px 40px rgba(0,0,0,0.4)",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
            <h2 style={{ color:"#F8FAFC", fontSize:16, fontWeight:600, margin:0 }}>
              Register New Student
            </h2>
            <button onClick={() => setShowForm(false)} style={{ background:"none", border:"none", color:"#94A3B8", cursor:"pointer" }}>
              <X size={18}/>
            </button>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <FormField label="Full Name *">
              <input
                style={{ ...INPUT_STYLE, borderColor: errors.full_name ? "#EF4444" : "rgba(124,58,237,0.25)" }}
                placeholder="e.g. Zainab Fatima"
                value={form.full_name}
                onChange={e => setForm(f => ({...f, full_name:e.target.value}))}
                onFocus={e => e.target.style.borderColor="#7C3AED"}
                onBlur={e => e.target.style.borderColor=errors.full_name?"#EF4444":"rgba(124,58,237,0.25)"}
              />
              {errors.full_name && <span style={{color:"#EF4444",fontSize:11}}>{errors.full_name}</span>}
            </FormField>

            <FormField label="Email *">
              <input
                type="email"
                style={{ ...INPUT_STYLE, borderColor: errors.email ? "#EF4444":"rgba(124,58,237,0.25)" }}
                placeholder="student@university.edu"
                value={form.email}
                onChange={e => setForm(f => ({...f, email:e.target.value}))}
                onFocus={e => e.target.style.borderColor="#7C3AED"}
                onBlur={e => e.target.style.borderColor=errors.email?"#EF4444":"rgba(124,58,237,0.25)"}
              />
              {errors.email && <span style={{color:"#EF4444",fontSize:11}}>{errors.email}</span>}
            </FormField>

            <FormField label="Phone">
              <input
                style={INPUT_STYLE}
                placeholder="+92 300 0000000"
                value={form.phone}
                onChange={e => setForm(f => ({...f, phone:e.target.value}))}
                onFocus={e => e.target.style.borderColor="#7C3AED"}
                onBlur={e => e.target.style.borderColor="rgba(124,58,237,0.25)"}
              />
            </FormField>

            <FormField label="Department *">
              <select
                style={{ ...INPUT_STYLE, borderColor: errors.dept_id?"#EF4444":"rgba(124,58,237,0.25)" }}
                value={form.dept_id}
                onChange={e => setForm(f => ({...f, dept_id:e.target.value}))}
                onFocus={e => e.target.style.borderColor="#7C3AED"}
                onBlur={e => e.target.style.borderColor=errors.dept_id?"#EF4444":"rgba(124,58,237,0.25)"}
              >
                <option value="">Select department…</option>
                {depts.map(d => (
                  <option key={d.DEPT_ID} value={d.DEPT_ID}>{d.DEPT_NAME} ({d.DEPT_CODE})</option>
                ))}
              </select>
              {errors.dept_id && <span style={{color:"#EF4444",fontSize:11}}>{errors.dept_id}</span>}
            </FormField>

            <FormField label="Semester *">
              <select
                style={{ ...INPUT_STYLE, borderColor: errors.semester?"#EF4444":"rgba(124,58,237,0.25)" }}
                value={form.semester}
                onChange={e => setForm(f => ({...f, semester:e.target.value}))}
                onFocus={e => e.target.style.borderColor="#7C3AED"}
                onBlur={e => e.target.style.borderColor=errors.semester?"#EF4444":"rgba(124,58,237,0.25)"}
              >
                <option value="">Select semester…</option>
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>Semester {n}</option>
                ))}
              </select>
              {errors.semester && <span style={{color:"#EF4444",fontSize:11}}>{errors.semester}</span>}
            </FormField>
          </div>

          <div style={{ display:"flex", gap:12, marginTop:20, justifyContent:"flex-end" }}>
            <button onClick={() => setShowForm(false)} style={{
              background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:8, padding:"9px 18px", color:"#94A3B8",
              cursor:"pointer", fontSize:13,
            }}>Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} style={{
              background:"linear-gradient(135deg,#7C3AED,#5B21B6)",
              border:"none", borderRadius:8, padding:"9px 20px",
              color:"#fff", fontSize:13, fontWeight:600,
              cursor: submitting ? "not-allowed":"pointer",
              opacity: submitting ? 0.7 : 1,
              display:"flex", alignItems:"center", gap:6,
            }}>
              {submitting ? <><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> Registering…</> : "Register Student"}
            </button>
          </div>
        </div>
      )}

      {/* ── Search ── */}
      <div style={{ position:"relative", marginBottom:20, maxWidth:360 }}>
        <Search size={15} color="#94A3B8" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
        <input
          style={{ ...INPUT_STYLE, paddingLeft:36 }}
          placeholder="Search by name, ID, or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={e => e.target.style.borderColor="#7C3AED"}
          onBlur={e => e.target.style.borderColor="rgba(124,58,237,0.25)"}
        />
      </div>

      {/* ── Students Table ── */}
      <div style={{
        background:"#37284e", borderRadius:16,
        border:"1px solid rgba(124,58,237,0.15)", overflow:"hidden",
      }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"rgba(0,0,0,0.25)" }}>
              {["Student ID","Name","Email","Department","Semester","Status","Enrolled"].map(h => (
                <th key={h} style={{
                  color:"#94A3B8", fontSize:11, fontWeight:600, letterSpacing:"0.05em",
                  padding:"12px 16px", textAlign:"left",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ color:"#94A3B8", padding:"40px 16px", textAlign:"center", fontSize:13 }}>
                  {search ? "No students match your search." : "No students registered yet."}
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.STUDENT_ID}
                  style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(124,58,237,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <td style={{ padding:"11px 16px", color:"#7C3AED", fontSize:12, fontFamily:"monospace" }}>{s.STUDENT_ID}</td>
                  <td style={{ padding:"11px 16px", color:"#F8FAFC", fontSize:13, fontWeight:500 }}>{s.FULL_NAME}</td>
                  <td style={{ padding:"11px 16px", color:"#94A3B8", fontSize:12 }}>{s.EMAIL}</td>
                  <td style={{ padding:"11px 16px", color:"#F8FAFC", fontSize:12 }}>{s.DEPT_NAME}</td>
                  <td style={{ padding:"11px 16px", color:"#F8FAFC", fontSize:12, textAlign:"center" }}>
                    <span style={{
                      background:"rgba(124,58,237,0.15)", color:"#a78bfa",
                      borderRadius:20, padding:"2px 10px", fontSize:11,
                    }}>Sem {s.SEMESTER}</span>
                  </td>
                  <td style={{ padding:"11px 16px" }}>
                    <span style={{
                      background: s.STATUS === "Active" ? "#22C55E20":"#EF444420",
                      color: s.STATUS === "Active" ? "#22C55E":"#EF4444",
                      borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:600,
                    }}>{s.STATUS}</span>
                  </td>
                  <td style={{ padding:"11px 16px", color:"#94A3B8", fontSize:12 }}>{s.ENROLLMENT_DATE}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </Layout>
  );
}
