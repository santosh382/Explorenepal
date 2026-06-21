const db = require("../config/db");

/* GET USERS */
exports.getUsers = async (req, res) => {
  const [rows] = await db.query(
    "SELECT id,name,email,role FROM users"
  );

  res.json(rows);
};

/* DELETE USER */
exports.deleteUser = async (req, res) => {
  await db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id]
  );

  res.json({
    success: true
  });
};

/* MAKE ADMIN */
exports.makeAdmin = async (req, res) => {
  await db.query(
    "UPDATE users SET role='admin' WHERE id=?",
    [req.params.id]
  );

  res.json({
    success: true
  });
};