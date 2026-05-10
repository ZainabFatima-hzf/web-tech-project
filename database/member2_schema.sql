-- ============================================================
-- MEMBER 2: Attendance Management Schema
-- Oracle XE (XEPDB1) | app_user
-- ============================================================
-- NOTE: Courses table already created by Member 3.
--       Do NOT recreate it. Attendance references it as FK.
-- Run this AFTER member1_schema.sql and member3_schema.sql.
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. ATTENDANCE TABLE
-- ─────────────────────────────────────────────
CREATE TABLE Attendance (
    attendance_id  NUMBER        PRIMARY KEY,
    student_id     VARCHAR2(20)  NOT NULL,
    course_id      NUMBER        NOT NULL,
    attend_date    DATE          NOT NULL,
    status         VARCHAR2(10)  DEFAULT 'Present' CHECK (status IN ('Present','Absent','Late')),
    remarks        VARCHAR2(200),
    marked_at      DATE          DEFAULT SYSDATE
);

ALTER TABLE Attendance
ADD CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES Students(student_id);

ALTER TABLE Attendance
ADD CONSTRAINT fk_att_course FOREIGN KEY (course_id) REFERENCES Courses(course_id);

ALTER TABLE Attendance
ADD CONSTRAINT uq_att_student_course_date UNIQUE (student_id, course_id, attend_date);

-- ─────────────────────────────────────────────
-- 2. SEQUENCE
-- ─────────────────────────────────────────────
CREATE SEQUENCE attendance_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- ─────────────────────────────────────────────
-- 3. TRIGGER – Auto-generate attendance_id
-- ─────────────────────────────────────────────
CREATE OR REPLACE TRIGGER trg_attendance_id
BEFORE INSERT ON Attendance
FOR EACH ROW
BEGIN
    IF :NEW.attendance_id IS NULL THEN
        :NEW.attendance_id := attendance_seq.NEXTVAL;
    END IF;
END;
/

-- ─────────────────────────────────────────────
-- 4. TRIGGER – Prevent duplicate attendance entry
--    (same student, same course, same date)
--    The UNIQUE constraint handles this at DB level,
--    this trigger gives a friendly error message.
-- ─────────────────────────────────────────────
CREATE OR REPLACE TRIGGER trg_prevent_duplicate_attendance
BEFORE INSERT ON Attendance
FOR EACH ROW
DECLARE
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM   Attendance
    WHERE  student_id  = :NEW.student_id
    AND    course_id   = :NEW.course_id
    AND    attend_date = :NEW.attend_date;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(
            -20002,
            'Attendance already marked for student ' || :NEW.student_id ||
            ' in this course on ' || TO_CHAR(:NEW.attend_date, 'YYYY-MM-DD')
        );
    END IF;
END;
/

-- ─────────────────────────────────────────────
-- 5. VIEW – Attendance % per student per course
-- ─────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_attendance_by_course AS
SELECT
    s.student_id,
    s.full_name,
    c.course_id,
    c.course_name,
    COUNT(a.attendance_id) AS total_classes,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS present_count,
    COUNT(CASE WHEN a.status = 'Absent'  THEN 1 END) AS absent_count,
    COUNT(CASE WHEN a.status = 'Late'    THEN 1 END) AS late_count,
    ROUND(
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0
        / NULLIF(COUNT(a.attendance_id), 0),
    2) AS attendance_pct
FROM Students s
JOIN Attendance a ON a.student_id = s.student_id
JOIN Courses    c ON c.course_id  = a.course_id
GROUP BY s.student_id, s.full_name, c.course_id, c.course_name;

-- ─────────────────────────────────────────────
-- 6. VIEW – Overall attendance summary per student
--    (used by Member 1 dashboard views)
-- ─────────────────────────────────────────────
CREATE OR REPLACE VIEW vw_student_attendance AS
SELECT
    s.student_id,
    s.full_name,
    s.dept_id,
    s.semester,
    COUNT(a.attendance_id) AS total_classes,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS present_count,
    ROUND(
        COUNT(CASE WHEN a.status = 'Present' THEN 1 END) * 100.0
        / NULLIF(COUNT(a.attendance_id), 0),
    2) AS attendance_pct
FROM Students s
LEFT JOIN Attendance a ON a.student_id = s.student_id
GROUP BY s.student_id, s.full_name, s.dept_id, s.semester;
