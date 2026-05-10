# Member 2 – Attendance Management Module

## What's Included

| Layer    | File | Purpose |
|----------|------|---------|
| Database | `database/member2_schema.sql` | Attendance table, trigger, views |
| Backend  | `backend/routes/attendance.js` | `/attendance` routes |
| Backend  | `backend/server.js` | Updated server — replace existing |
| Frontend | `frontend/src/pages/MarkAttendance.jsx` | Mark attendance for a class |
| Frontend | `frontend/src/pages/AttendanceView.jsx` | View records + summary |
| Frontend | `frontend/src/App.js` | Updated routes — replace existing |

---

## Step 1 – Database Setup

> ⚠️ Run Member 1 and Member 3 schemas FIRST before this one.
> The Attendance table references Students (Member 1) and Courses (Member 3).

Connect as app_user in SQL*Plus:
```
sqlplus app_user/app123@localhost:1521/XEPDB1
```

Then run:
```sql
@C:\full\path\to\database\member2_schema.sql
```

You should see:
- Table created (Attendance)
- 2x Alter table succeeded (FK constraints)
- Unique constraint added
- Sequence created
- 2x Trigger created (trg_attendance_id, trg_prevent_duplicate_attendance)
- 2x View created (vw_attendance_by_course, vw_student_attendance)

Verify:
```sql
DESC Attendance;
SELECT object_name, object_type, status FROM user_objects
WHERE object_name IN ('TRG_ATTENDANCE_ID','TRG_PREVENT_DUPLICATE_ATTENDANCE',
                      'VW_ATTENDANCE_BY_COURSE','VW_STUDENT_ATTENDANCE');
```

---

## Step 2 – Backend Setup

Copy `backend/routes/attendance.js` into the `backend/routes/` folder.
Replace `backend/server.js` with the updated version.

### API Endpoints (Member 2)

| Method | Route | Description |
|--------|-------|-------------|
| POST   | `/attendance` | Mark single attendance record |
| POST   | `/attendance/bulk` | Mark entire class at once |
| GET    | `/attendance` | Fetch records (filter by student_id, course_id, date) |
| GET    | `/attendance/summary` | Attendance % per student per course |
| GET    | `/attendance/courses` | List all courses (for dropdowns) |

---

## Step 3 – Frontend Setup

Copy the two page files:
```
frontend/src/pages/MarkAttendance.jsx   ← new file
frontend/src/pages/AttendanceView.jsx   ← new file
```

Replace `frontend/src/App.js` with the updated version (adds attendance routes).

---

## Advanced DB Concepts Covered ✅

- **Primary Key** – `Attendance.attendance_id`
- **Foreign Keys** – `student_id → Students`, `course_id → Courses`
- **UNIQUE constraint** – `(student_id, course_id, attend_date)` prevents duplicates
- **Sequence** – `attendance_seq` for auto-numbering
- **Trigger 1** – `trg_attendance_id` auto-generates attendance_id
- **Trigger 2** – `trg_prevent_duplicate_attendance` blocks duplicate entries with friendly error
- **View 1** – `vw_attendance_by_course` — attendance % per student per course
- **View 2** – `vw_student_attendance` — overall attendance % per student (used by Member 1 dashboard)

---

## ⚠️ Tell Member 1 After You're Done

Once your schema is running, tell Member 1 to run the remaining dashboard views
from `member1_schema.sql` (the ones that were skipped earlier):
- `vw_student_attendance` — now provided by this schema
- `vw_at_risk_students`
- `vw_dashboard_summary`

And restore `backend/routes/dashboard.js` to its original version.
