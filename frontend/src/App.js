// src/App.js  –  Member 1
// Wire up routes. Add other members' pages to the router as they build them.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Students  from "./pages/Students";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students"  element={<Students />} />
        {/* Members 2 & 3 add their routes below */}
        {/* <Route path="/attendance" element={<Attendance />} /> */}
        {/* <Route path="/courses"    element={<Courses />} /> */}
        {/* <Route path="/reports"    element={<Reports />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
