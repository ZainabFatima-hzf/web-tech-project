// src/App.js  –  updated by Member 3 (wire in performance & marks routes)
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard        from "./pages/Dashboard";
import Students         from "./pages/Students";
import MarksEntry       from "./pages/MarksEntry";
import PerformanceReport from "./pages/PerformanceReport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/students"    element={<Students />} />
        {/* Member 3 */}
        <Route path="/marks"       element={<MarksEntry />} />
        <Route path="/reports"     element={<PerformanceReport />} />
        {/* Members 2 add their routes below */}
        {/* <Route path="/attendance" element={<Attendance />} /> */}
        {/* <Route path="/courses"    element={<Courses />} /> */}
      </Routes>
    </BrowserRouter>
  );
}