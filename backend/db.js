const oracledb = require("oracledb");

async function connectDB() {
  try {
    const connection = await oracledb.getConnection({
      user: "app_user",
      password: "app123",
    connectString: "localhost:1521/XEPDB1"
    });

    console.log("Database connected!");
    return connection;

  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

module.exports = connectDB;