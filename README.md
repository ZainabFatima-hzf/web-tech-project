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
