-- ============================================================
-- MEMBER 3: Performance & Exams Schema
-- Oracle XE (XEPDB1) | app_user
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. COURSES TABLE (needed as FK reference)
-- ─────────────────────────────────────────────
CREATE TABLE Courses (
    course_id    NUMBER PRIMARY KEY,
    course_name  VARCHAR2(150) NOT NULL,
    course_code  VARCHAR2(20)  UNIQUE NOT NULL,
    credit_hours NUMBER(1)     DEFAULT 3,
    dept_id      NUMBER,
    CONSTRAINT fk_course_dept FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);

CREATE SEQUENCE course_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_course_id
BEFORE INSERT ON Courses
FOR EACH ROW
BEGIN
    IF :NEW.course_id IS NULL THEN
        :NEW.course_id := course_seq.NEXTVAL;
    END IF;
END;
/

-- Seed courses
INSERT INTO Courses (course_id, course_name, course_code, credit_hours, dept_id) VALUES (1, 'Data Structures', 'CS-301', 3, 1);
INSERT INTO Courses (course_id, course_name, course_code, credit_hours, dept_id) VALUES (2, 'Database Systems', 'CS-401', 3, 1);
INSERT INTO Courses (course_id, course_name, course_code, credit_hours, dept_id) VALUES (3, 'Web Technologies', 'SE-302', 3, 2);
INSERT INTO Courses (course_id, course_name, course_code, credit_hours, dept_id) VALUES (4, 'Operating Systems', 'CS-402', 3, 1);
INSERT INTO Courses (course_id, course_name, course_code, credit_hours, dept_id) VALUES (5, 'Software Engineering', 'SE-401', 3, 2);
COMMIT;

-- ─────────────────────────────────────────────
-- 2. EXAMS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE Exams (
    exam_id      NUMBER PRIMARY KEY,
    exam_name    VARCHAR2(100) NOT NULL,
    exam_type    VARCHAR2(20)  CHECK (exam_type IN ('Midterm','Final','Quiz','Assignment')),
    course_id    NUMBER        NOT NULL,
    exam_date    DATE          DEFAULT SYSDATE,
    total_marks  NUMBER(5,2)   DEFAULT 100,
    CONSTRAINT fk_exam_course FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

CREATE SEQUENCE exam_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_exam_id
BEFORE INSERT ON Exams
FOR EACH ROW
BEGIN
    IF :NEW.exam_id IS NULL THEN
        :NEW.exam_id := exam_seq.NEXTVAL;
    END IF;
END;
/

-- ─────────────────────────────────────────────
-- 3. GRADES TABLE
-- ─────────────────────────────────────────────
CREATE TABLE Grades (
    grade_id       NUMBER PRIMARY KEY,
    student_id     VARCHAR2(20)  NOT NULL,
    course_id      NUMBER        NOT NULL,
    exam_id        NUMBER        NOT NULL,
    marks_obtained NUMBER(5,2)   CHECK (marks_obtained >= 0),
    total_marks    NUMBER(5,2)   DEFAULT 100,
    grade_letter   VARCHAR2(2),
    grade_points   NUMBER(3,1),
    created_at     DATE          DEFAULT SYSDATE,
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) REFERENCES Students(student_id),
    CONSTRAINT fk_grade_course  FOREIGN KEY (course_id)  REFERENCES Courses(course_id),
    CONSTRAINT fk_grade_exam    FOREIGN KEY (exam_id)    REFERENCES Exams(exam_id),
    CONSTRAINT uq_grade         UNIQUE (student_id, exam_id)
);

CREATE SEQUENCE grade_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

CREATE OR REPLACE TRIGGER trg_grade_id
BEFORE INSERT ON Grades
FOR EACH ROW
BEGIN
    IF :NEW.grade_id IS NULL THEN
        :NEW.grade_id := grade_seq.NEXTVAL;
    END IF;
END;
/

-- ─────────────────────────────────────────────
-- 4. TRIGGER – Auto-calculate grade letter & points after marks entry
-- ─────────────────────────────────────────────
CREATE OR REPLACE TRIGGER trg_auto_grade
BEFORE INSERT OR UPDATE OF marks_obtained ON Grades
FOR EACH ROW
DECLARE
    v_pct NUMBER;
BEGIN
    IF :NEW.total_marks > 0 THEN
        v_pct := (:NEW.marks_obtained / :NEW.total_marks) * 100;
    ELSE
        v_pct := 0;
    END IF;

    IF    v_pct >= 90 THEN :NEW.grade_letter := 'A+'; :NEW.grade_points := 4.0;
    ELSIF v_pct >= 85 THEN :NEW.grade_letter := 'A';  :NEW.grade_points := 4.0;
    ELSIF v_pct >= 80 THEN :NEW.grade_letter := 'A-'; :NEW.grade_points := 3.7;
    ELSIF v_pct >= 75 THEN :NEW.grade_letter := 'B+'; :NEW.grade_points := 3.3;
    ELSIF v_pct >= 70 THEN :NEW.grade_letter := 'B';  :NEW.grade_points := 3.0;
    ELSIF v_pct >= 65 THEN :NEW.grade_letter := 'B-'; :NEW.grade_points := 2.7;
    ELSIF v_pct >= 60 THEN :NEW.grade_letter := 'C+'; :NEW.grade_points := 2.3;
    ELSIF v_pct >= 55 THEN :NEW.grade_letter := 'C';  :NEW.grade_points := 2.0;
    ELSIF v_pct >= 50 THEN :NEW.grade_letter := 'C-'; :NEW.grade_points := 1.7;
    ELSIF v_pct >= 45 THEN :NEW.grade_letter := 'D';  :NEW.grade_points := 1.0;
    ELSE                    :NEW.grade_letter := 'F';  :NEW.grade_points := 0.0;
    END IF;
END;
/

-- ─────────────────────────────────────────────
-- 5. STORED PROCEDURE – Insert Marks
-- ─────────────────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_insert_marks (
    p_student_id     IN  Grades.student_id%TYPE,
    p_course_id      IN  Grades.course_id%TYPE,
    p_exam_id        IN  Grades.exam_id%TYPE,
    p_marks_obtained IN  Grades.marks_obtained%TYPE,
    p_total_marks    IN  Grades.total_marks%TYPE,
    p_grade_id       OUT Grades.grade_id%TYPE
)
AS
BEGIN
    -- Upsert: update if exists, insert if not
    BEGIN
        UPDATE Grades
        SET    marks_obtained = p_marks_obtained,
               total_marks    = p_total_marks
        WHERE  student_id = p_student_id
          AND  exam_id    = p_exam_id
        RETURNING grade_id INTO p_grade_id;

        IF SQL%ROWCOUNT = 0 THEN
            INSERT INTO Grades (student_id, course_id, exam_id, marks_obtained, total_marks)
            VALUES (p_student_id, p_course_id, p_exam_id, p_marks_obtained, p_total_marks)
            RETURNING grade_id INTO p_grade_id;
        END IF;

        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE;
    END;
END sp_insert_marks;
/

-- ─────────────────────────────────────────────
-- 6. AGGREGATION VIEWS – GPA & Average Calculation
-- ─────────────────────────────────────────────

-- Per-student GPA (weighted by credit hours)
CREATE OR REPLACE VIEW vw_student_gpa AS
SELECT
    g.student_id,
    s.full_name,
    d.dept_name,
    s.semester,
    ROUND(
        SUM(g.grade_points * c.credit_hours) /
        NULLIF(SUM(c.credit_hours), 0),
    2) AS gpa,
    ROUND(AVG(g.marks_obtained / g.total_marks * 100), 2) AS avg_percentage,
    COUNT(DISTINCT g.course_id) AS courses_taken
FROM   Grades  g
JOIN   Students  s ON s.student_id = g.student_id
JOIN   Courses   c ON c.course_id  = g.course_id
JOIN   Departments d ON d.dept_id  = s.dept_id
GROUP  BY g.student_id, s.full_name, d.dept_name, s.semester;

-- Per-exam stats
CREATE OR REPLACE VIEW vw_exam_stats AS
SELECT
    e.exam_id,
    e.exam_name,
    e.exam_type,
    c.course_name,
    e.total_marks,
    COUNT(g.grade_id)                                   AS students_appeared,
    ROUND(AVG(g.marks_obtained), 2)                     AS avg_marks,
    MAX(g.marks_obtained)                               AS highest_marks,
    MIN(g.marks_obtained)                               AS lowest_marks,
    COUNT(CASE WHEN g.grade_letter = 'F' THEN 1 END)   AS failed_count,
    COUNT(CASE WHEN g.grade_points >= 3.0 THEN 1 END)  AS distinction_count
FROM   Exams   e
JOIN   Courses c ON c.course_id = e.course_id
LEFT JOIN Grades g ON g.exam_id = e.exam_id
GROUP  BY e.exam_id, e.exam_name, e.exam_type, c.course_name, e.total_marks;

-- Grade distribution per course
CREATE OR REPLACE VIEW vw_grade_distribution AS
SELECT
    c.course_id,
    c.course_name,
    g.grade_letter,
    COUNT(*) AS count
FROM   Grades  g
JOIN   Courses c ON c.course_id = g.course_id
WHERE  g.grade_letter IS NOT NULL
GROUP  BY c.course_id, c.course_name, g.grade_letter
ORDER  BY c.course_id, g.grade_letter;
