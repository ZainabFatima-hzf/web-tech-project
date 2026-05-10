-- ─────────────────────────────────────────────
-- 1. STUDENTS  (trigger auto-generates student_id)
-- ─────────────────────────────────────────────
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Zainab Fatima',
           'zainab@uni.edu',
           '0301-1111111',
           1,
           5 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Ayesha Noor',
           'ayesha@uni.edu',
           '0302-2222222',
           1,
           5 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Ali Hassan',
           'ali@uni.edu',
           '0303-3333333',
           2,
           3 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Sara Khan',
           'sara@uni.edu',
           '0304-4444444',
           2,
           3 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Umar Farooq',
           'umar@uni.edu',
           '0305-5555555',
           3,
           7 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Hina Malik',
           'hina@uni.edu',
           '0306-6666666',
           3,
           7 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Bilal Ahmed',
           'bilal@uni.edu',
           '0307-7777777',
           4,
           1 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Fatima Zahra',
           'fatima@uni.edu',
           '0308-8888888',
           1,
           6 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Hamza Tariq',
           'hamza@uni.edu',
           '0309-9999999',
           2,
           4 );
insert into students (
   full_name,
   email,
   phone,
   dept_id,
   semester
) values ( 'Maryam Siddiqui',
           'maryam@uni.edu',
           '0310-1010101',
           4,
           2 );
commit;
-- Zainab Fatima STU-2026-0001 (high performer)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0001',
           1,
           1,
           88,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0001',
           1,
           2,
           91,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0001',
           2,
           3,
           85,
           100 );

-- Ayesha Noor STU-2026-0002 (good)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0002',
           1,
           1,
           76,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0002',
           1,
           2,
           80,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0002',
           2,
           3,
           72,
           100 );

-- Ali Hassan STU-2026-0003 (average)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0003',
           2,
           3,
           58,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0003',
           2,
           4,
           62,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0003',
           3,
           5,
           55,
           100 );

-- Sara Khan STU-2026-0004 (at-risk)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0004',
           2,
           3,
           35,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0004',
           2,
           4,
           30,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0004',
           3,
           5,
           28,
           100 );

-- Umar Farooq STU-2026-0005 (good)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0005',
           3,
           5,
           79,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0005',
           3,
           6,
           83,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0005',
           1,
           2,
           77,
           100 );

-- Hina Malik STU-2026-0006 (average)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0006',
           3,
           5,
           61,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0006',
           3,
           6,
           57,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0006',
           2,
           4,
           64,
           100 );

-- Bilal Ahmed STU-2026-0007 (at-risk)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0007',
           1,
           1,
           32,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0007',
           1,
           2,
           38,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0007',
           3,
           5,
           41,
           100 );

-- Fatima Zahra STU-2026-0008 (high performer)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0008',
           1,
           1,
           94,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0008',
           1,
           2,
           90,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0008',
           2,
           4,
           87,
           100 );

-- Hamza Tariq STU-2026-0009 (average)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0009',
           2,
           3,
           66,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0009',
           2,
           4,
           70,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0009',
           3,
           6,
           68,
           100 );

-- Maryam Siddiqui STU-2026-0010 (good)
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0010',
           3,
           5,
           82,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0010',
           3,
           6,
           78,
           100 );
insert into grades (
   student_id,
   course_id,
   exam_id,
   marks_obtained,
   total_marks
) values ( 'STU-2026-0010',
           1,
           1,
           75,
           100 );

commit;
-- Exams (assumes course_ids 1–5 exist)
insert into exams (
   exam_name,
   exam_type,
   course_id,
   exam_date,
   total_marks
) values ( 'Midterm Exam',
           'Midterm',
           1,
           date '2025-03-15',
           100 );
insert into exams (
   exam_name,
   exam_type,
   course_id,
   exam_date,
   total_marks
) values ( 'Final Exam',
           'Final',
           1,
           date '2025-05-20',
           100 );
insert into exams (
   exam_name,
   exam_type,
   course_id,
   exam_date,
   total_marks
) values ( 'Midterm Exam',
           'Midterm',
           2,
           date '2025-03-16',
           100 );
insert into exams (
   exam_name,
   exam_type,
   course_id,
   exam_date,
   total_marks
) values ( 'Final Exam',
           'Final',
           2,
           date '2025-05-21',
           100 );
insert into exams (
   exam_name,
   exam_type,
   course_id,
   exam_date,
   total_marks
) values ( 'Midterm Exam',
           'Midterm',
           3,
           date '2025-03-17',
           100 );
insert into exams (
   exam_name,
   exam_type,
   course_id,
   exam_date,
   total_marks
) values ( 'Final Exam',
           'Final',
           3,
           date '2025-05-22',
           100 );
insert into exams (
   exam_id,
   exam_name,
   exam_type,
   course_id,
   total_marks,
   exam_date
) values ( 7,
           'Mid Term',
           'Midterm',
           4,
           100,
           to_date('2026-03-18','YYYY-MM-DD') );
insert into exams (
   exam_id,
   exam_name,
   exam_type,
   course_id,
   total_marks,
   exam_date
) values ( 8,
           'Final Exam',
           'Final',
           4,
           100,
           to_date('2026-05-23','YYYY-MM-DD') );
insert into exams (
   exam_id,
   exam_name,
   exam_type,
   course_id,
   total_marks,
   exam_date
) values ( 9,
           'Mid Term',
           'Midterm',
           5,
           100,
           to_date('2026-03-19','YYYY-MM-DD') );
insert into exams (
   exam_id,
   exam_name,
   exam_type,
   course_id,
   total_marks,
   exam_date
) values ( 10,
           'Final Exam',
           'Final',
           5,
           100,
           to_date('2026-05-24','YYYY-MM-DD') );
commit;
-- ─────────────────────────────────────────────
-- ATTENDANCE
-- ─────────────────────────────────────────────

-- Zainab (STU-2026-0001) - CS courses, good attendance
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0001',
           1,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0001',
           1,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0001',
           1,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0001',
           2,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0001',
           2,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0001',
           2,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Absent' );

-- Ayesha (STU-2026-0002) - at risk attendance in course 1
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0002',
           1,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0002',
           1,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0002',
           1,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0002',
           1,
           to_date('2026-04-09','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0002',
           2,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0002',
           2,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );

-- Ali (STU-2026-0003) - mixed attendance
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0003',
           3,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0003',
           3,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Late' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0003',
           3,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0003',
           5,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0003',
           5,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0003',
           5,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0003',
           5,
           to_date('2026-04-09','YYYY-MM-DD'),
           'Present' );

-- Sara (STU-2026-0004) - good attendance
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0004',
           3,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0004',
           3,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0004',
           3,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0004',
           5,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0004',
           5,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0004',
           5,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Late' );

-- Umar (STU-2026-0005) - at risk in both courses
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           4,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           4,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           4,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           4,
           to_date('2026-04-09','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           2,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           2,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           2,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0005',
           2,
           to_date('2026-04-09','YYYY-MM-DD'),
           'Absent' );

-- Hina (STU-2026-0006) - good attendance
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0006',
           4,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0006',
           4,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0006',
           4,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Late' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0006',
           4,
           to_date('2026-04-09','YYYY-MM-DD'),
           'Present' );

-- Bilal (STU-2026-0007) - at risk
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0007',
           1,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0007',
           1,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0007',
           1,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0007',
           1,
           to_date('2026-04-09','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0007',
           1,
           to_date('2026-04-11','YYYY-MM-DD'),
           'Absent' );

-- Fatima (STU-2026-0008) - good attendance
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0008',
           2,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0008',
           2,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0008',
           2,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0008',
           3,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0008',
           3,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Late' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0008',
           3,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );

-- Hamza (STU-2026-0009) - mixed
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0009',
           5,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0009',
           5,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Absent' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0009',
           5,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0009',
           3,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0009',
           3,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0009',
           3,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Absent' );

-- Maryam (STU-2026-0010) - good attendance
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0010',
           4,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0010',
           4,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0010',
           4,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0010',
           1,
           to_date('2026-04-01','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0010',
           1,
           to_date('2026-04-03','YYYY-MM-DD'),
           'Present' );
insert into attendance (
   student_id,
   course_id,
   attend_date,
   status
) values ( 'STU-2026-0010',
           1,
           to_date('2026-04-07','YYYY-MM-DD'),
           'Late' );

commit;