## 🚀 Getting Started (All Members)

### 1. Clone the repo
git clone https://github.com/ZainabFatima-hzf/web-tech-project.git

### 2. Backend Setup
cd backend
npm install
node server.js
→ Runs on http://localhost:5000

Packages installed automatically:
- express, cors, dotenv, oracledb

### 3. Frontend Setup
cd frontend
npm install
npm start
→ Runs on http://localhost:3000

Packages installed automatically:
- react, react-dom, react-router-dom
- lucide-react (icons)
- react-scripts, web-vitals, testing-library

⚠️ If you get "Module not found" errors, run manually:
npm install react-router-dom lucide-react

### 4. Database Setup
- Make sure Oracle XE is installed and running
- Open cmd (not PowerShell) and connect:
  sqlplus / as sysdba
  SHOW CON_NAME;
  (if CDB$ROOT): ALTER SESSION SET CONTAINER = XEPDB1;
  CREATE USER app_user IDENTIFIED BY app123;
  GRANT CONNECT, RESOURCE TO app_user;
  ALTER USER app_user QUOTA UNLIMITED ON USERS;
- Then reconnect as app_user:
  sqlplus app_user/app123@localhost:1521/XEPDB1
- Run your schema file:
  @C:\full\path\to\database\your_schema.sql
- Member 1 schema already done: database/member1_schema.sql

## 📁 Project Structure
web-tech-project/
  backend/
    routes/
      students.js     ← Member 1
      dashboard.js    ← Member 1
      (add yours here)
    server.js         ← register your routes here
    db.js
  frontend/
    src/
      components/
        Layout.jsx    ← SHARED, import this in every page
      pages/
        Dashboard.jsx ← Member 1
        Students.jsx  ← Member 1
        (add yours here)
      App.js          ← add your route here
  database/
    member1_schema.sql
    (add your schema file here)

---
## ⚠️ Important Notes for Members 2 & 3

1. Always import Layout in your pages:
   import Layout from "../components/Layout";
   export default function YourPage() {
     return <Layout> ... </Layout>;
   }

2. Add your route in frontend/src/App.js

3. Add your Express router in backend/server.js:
   const yourRouter = require("./routes/yourfile");
   app.use("/yourpath", yourRouter);

4. Member 1 dashboard will auto-update once you create:
   - Member 2: Attendance table (attendance_id, student_id, course_id, status, date)
   - Member 3: Grades table (student_id, course_id, marks_obtained)
   Then tell Member 1 to run the remaining views in member1_schema.sql
🎨 Frontend Design Guidelines (Modern Student Style)

🎯 **Design Direction**

Modern, slightly bold, not corporate
Dark-accented UI with vibrant highlights
Clean but visually engaging (not boring dashboard)
Think: tech startup / student-built product
🎨 Color Palette (Dark + Vibrant)
Purpose	Color	Code
Background	Dark Slate	 #342534
Card Background	Soft Dark	#37284e
Primary	Purple	#7C3AED
Secondary	Cyan	#06B6D4
Accent	Pink	#EC4899
Text Primary	White	#F8FAFC
Text Secondary	Gray	#94A3B8
Success	Green	#22C55E
Warning	Amber	#F59E0B
Danger	Red	#EF4444

👉 This gives a modern, dev-tool / startup vibe

🔤 Typography
Font: Inter / Poppins
Headings:
Bold, slightly larger
Body:
Clean and readable
Avoid too many font styles
🧱 Layout Structure (Same for All Pages)
Top Navbar (minimal)
Left Sidebar (icons + labels)
Main Content (cards/grid)
✨ Visual Style Rules
🔹 Cards
Dark background (#1E293B)
Rounded corners (12px–16px)
Subtle glow or shadow
Slight hover lift effect
🔹 Buttons
Gradient style (IMPORTANT for uniqueness)

Example:

background: linear-gradient(135deg, #342534, #1f2836);
border-radius: 8px;
Hover → slightly brighter
🔹 Inputs & Forms
Dark input fields
Border: subtle gray
Focus → glow (purple or cyan)
🔹 Tables
Dark theme
Row hover highlight
Keep spacing clean
🌈 UI Highlights (What makes it attractive)
Use gradients (not flat colors everywhere)
Use icons (Lucide / FontAwesome)
Add hover animations (very subtle)
Use colored tags:
🟢 Good
🟡 Warning
🔴 Risk
📊 Dashboard Styling (VERY IMPORTANT)
Cards like:
Attendance %
Average Marks
At-Risk Students

Each card:

Icon + title + big number
Colored indicator (green/yellow/red)
⚠️ Strict Rules
❌ No plain white pages
❌ No default Bootstrap look
❌ No mixing different styles
❌ No random colors outside palette
✅ Recommended Stack
Tailwind CSS (best for speed)
Icons: Lucide React

**IMPORTANT: import the layout in other frontend pages for consistency.**
