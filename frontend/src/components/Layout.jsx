// src/components/Layout.jsx  –  Member 1
// Shared sidebar + navbar. Import this in every page.
import { useState } from "react";
import { NavLink} from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  BarChart3, Settings, ChevronLeft, ChevronRight, GraduationCap
} from "lucide-react";

const NAV = [
  { to: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"   },
  { to: "/students",   icon: Users,            label: "Students"    },
  { to: "/courses",    icon: BookOpen,         label: "Courses"     },
  { to: "/attendance", icon: ClipboardList,    label: "Attendance"  },
  { to: "/reports",    icon: BarChart3,        label: "Reports"     },
  { to: "/settings",   icon: Settings,         label: "Settings"    },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#342534", fontFamily:"'Poppins', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 68 : 220,
        background: "#1e1329",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease",
        borderRight: "1px solid rgba(124,58,237,0.15)",
        position: "sticky", top: 0, height: "100vh",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 0" : "20px 18px",
          display: "flex", alignItems: "center", gap: 10,
          borderBottom: "1px solid rgba(124,58,237,0.15)",
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <div style={{
            background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
            borderRadius: 10, padding: 7, display:"flex",
          }}>
            <GraduationCap size={20} color="#fff" />
          </div>
          {!collapsed && (
            <div>
              <div style={{ color:"#F8FAFC", fontWeight:700, fontSize:13, lineHeight:1 }}>SPAI</div>
              <div style={{ color:"#94A3B8", fontSize:10 }}>Portal</div>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: "flex", alignItems: "center",
              gap: 12,
              padding: collapsed ? "11px 0" : "11px 18px",
              justifyContent: collapsed ? "center" : "flex-start",
              textDecoration: "none",
              color: isActive ? "#F8FAFC" : "#94A3B8",
              background: isActive ? "rgba(124,58,237,0.18)" : "transparent",
              borderLeft: isActive ? "3px solid #7C3AED" : "3px solid transparent",
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              transition: "all 0.15s",
            })}>
              <Icon size={17} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(c => !c)} style={{
          margin: "12px auto", background:"rgba(124,58,237,0.15)",
          border:"none", borderRadius:8, padding:"6px 10px",
          color:"#7C3AED", cursor:"pointer", display:"flex", alignItems:"center",
        }}>
          {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <header style={{
          background: "rgba(30,19,41,0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(124,58,237,0.1)",
          padding: "12px 28px",
          display: "flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:10,
        }}>
          <h2 style={{ color:"#F8FAFC", fontSize:15, fontWeight:600, margin:0 }}>
            Student Performance & Attendance Intelligence
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, overflowY:"auto", padding: "28px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
