// src/App.js  –  updated with Student Portal route
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard         from "./pages/Dashboard";
import Students          from "./pages/Students";
import MarksEntry        from "./pages/MarksEntry";
import PerformanceReport from "./pages/PerformanceReport";
import MarkAttendance    from "./pages/MarkAttendance";
import AttendanceView    from "./pages/AttendanceView";
import StudentPortal     from "./pages/StudentPortal";
import Courses          from "./pages/Courses";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Navigate to="/dashboard" replace />} />
        {/* Teacher interface */}
        <Route path="/dashboard"        element={<Dashboard />} />
        <Route path="/students"         element={<Students />} />
        <Route path="/marks"            element={<MarksEntry />} />
        <Route path="/reports"          element={<PerformanceReport />} />
        <Route path="/attendance"       element={<MarkAttendance />} />
        <Route path="/attendance/view"  element={<AttendanceView />} />
        <Route path="/courses"           element={<Courses />} />
        {/* Student interface */}
        <Route path="/student"          element={<StudentPortal />} />
      </Routes>
    </BrowserRouter>
  );
}