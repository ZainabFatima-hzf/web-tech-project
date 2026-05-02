Run this script before starting backend
open cmd
//run the following commands
sqlplus / as sysdba
SHOW CON_NAME;  // if it's CDB$ROOT then change it by running following command
ALTER SESSION SET CONTAINER = XEPDB1;
// then create this user
CREATE USER app_user IDENTIFIED BY app123;
GRANT CONNECT, RESOURCE TO app_user;
ALTER USER app_user QUOTA UNLIMITED ON USERS;

🎨 Frontend Design Guidelines (Modern Student Style)

🎯 Design Direction

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
