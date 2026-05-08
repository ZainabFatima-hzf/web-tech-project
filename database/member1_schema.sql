-- ============================================================
-- MEMBER 1: Core Schema – Students, Departments
-- Oracle XE (XEPDB1) | app_user
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. DEPARTMENTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE Departments (
    dept_id    NUMBER PRIMARY KEY,
    dept_name  VARCHAR2(100) NOT NULL,
    dept_code  VARCHAR2(10)  UNIQUE NOT NULL
);

-- Seed departments
INSERT INTO Departments VALUES (1, 'Computer Science',   'CS');
INSERT INTO Departments VALUES (2, 'Software Engineering','SE');
INSERT INTO Departments VALUES (3, 'Information Technology','IT');
INSERT INTO Departments VALUES (4, 'Electrical Engineering','EE');
COMMIT;

-- ─────────────────────────────────────────────
-- 2. STUDENTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE Students (
    student_id   VARCHAR2(20)  PRIMARY KEY,          -- e.g. STU-2025-0001
    full_name    VARCHAR2(100) NOT NULL,
    email        VARCHAR2(150) UNIQUE NOT NULL,
    phone        VARCHAR2(20),
    dept_id      NUMBER        NOT NULL,
    enrollment_date DATE       DEFAULT SYSDATE,
    semester     NUMBER(2)     CHECK (semester BETWEEN 1 AND 8),
    status          VARCHAR2(10)  DEFAULT 'Active' CHECK (status IN ('Active','Inactive','Graduated'))
);
ALTER TABLE Students
ADD CONSTRAINT fk_student_dept FOREIGN KEY (dept_id)
REFERENCES Departments(dept_id);

-- ─────────────────────────────────────────────
-- 3. SEQUENCE  (used by trigger)
-- ─────────────────────────────────────────────
CREATE SEQUENCE student_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- ─────────────────────────────────────────────
-- 4. TRIGGER – Auto-generate student_id
--    Format:  STU-<YEAR>-<4-digit seq>
-- ─────────────────────────────────────────────
CREATE OR REPLACE TRIGGER trg_student_id
BEFORE INSERT ON Students
FOR EACH ROW
BEGIN
    IF :NEW.student_id IS NULL THEN
        :NEW.student_id := 'STU-' || TO_CHAR(SYSDATE, 'YYYY') || '-'
                           || LPAD(student_seq.NEXTVAL, 4, '0');
    END IF;
END;
/

-- ─────────────────────────────────────────────
-- 5. STORED PROCEDURE – Add Student
-- ─────────────────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_add_student (
    p_full_name  IN  Students.full_name%TYPE,
    p_email      IN  Students.email%TYPE,
    p_phone      IN  Students.phone%TYPE,
    p_dept_id    IN  Students.dept_id%TYPE,
    p_semester   IN  Students.semester%TYPE,
    p_student_id OUT Students.student_id%TYPE
)
AS
BEGIN
    INSERT INTO Students (student_id, full_name, email, phone, dept_id, semester)
    VALUES (NULL, p_full_name, p_email, p_phone, p_dept_id, p_semester)
    RETURNING student_id INTO p_student_id;

    COMMIT;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        RAISE_APPLICATION_ERROR(-20001, 'Email already exists: ' || p_email);
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END sp_add_student;
/

-- ─────────────────────────────────────────────
-- 6. DASHBOARD QUERIES (used by /dashboard API)
-- ─────────────────────────────────────────────

-- 6a. Overall attendance % per student
--     (depends on Attendance table from Member 2)
--     Kept as a view so Member 2 table is referenced at runtime
CREATE OR REPLACE VIEW vw_student_attendance AS
SELECT
    s.student_id,
    s.full_name,
    s.dept_id,
    s.semester,
    ROUND(
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0
        / NULLIF(COUNT(a.attendance_id), 0),
    2) AS attendance_pct
FROM Students s
LEFT JOIN Attendance a ON a.student_id = s.student_id
GROUP BY s.student_id, s.full_name, s.dept_id, s.semester;

-- 6b. Average marks per student
--     (depends on Grades / Marks table from Member 3)
CREATE OR REPLACE VIEW vw_student_avg_marks AS
SELECT
    s.student_id,
    s.full_name,
    ROUND(AVG(g.marks_obtained), 2)  AS avg_marks,
    COUNT(DISTINCT g.course_id)      AS courses_enrolled
FROM Students s
LEFT JOIN Grades g ON g.student_id = s.student_id
GROUP BY s.student_id, s.full_name;

-- 6c. At-Risk view  (attendance < 75 OR avg marks < 40)
CREATE OR REPLACE VIEW vw_at_risk_students AS
SELECT
    a.student_id,
    a.full_name,
    a.attendance_pct,
    m.avg_marks,
    CASE
        WHEN a.attendance_pct < 75 AND m.avg_marks < 40 THEN 'Critical'
        WHEN a.attendance_pct < 75                      THEN 'Low Attendance'
        WHEN m.avg_marks < 40                           THEN 'Low Marks'
        ELSE 'Watch'
    END AS risk_level
FROM vw_student_attendance a
JOIN vw_student_avg_marks  m ON m.student_id = a.student_id
WHERE a.attendance_pct < 75 OR m.avg_marks < 40;

-- 6d. Dashboard summary card numbers
CREATE OR REPLACE VIEW vw_dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM Students WHERE status = 'Active')           AS total_students,
    (SELECT ROUND(AVG(attendance_pct),2) FROM vw_student_attendance)  AS overall_attendance_pct,
    (SELECT ROUND(AVG(avg_marks),2)      FROM vw_student_avg_marks)   AS overall_avg_marks,
    (SELECT COUNT(*) FROM vw_at_risk_students)                        AS at_risk_count
FROM dual;
