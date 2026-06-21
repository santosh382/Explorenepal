const db = require("../db");

exports.add = (req, res) => {
  const { user_id, destination_id } = req.body;

  db.query(
    "INSERT INTO favorites (user_id,destination_id) VALUES (?,?)",
    [user_id, destination_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Added ❤️");
    }
  );
};

exports.get = (req, res) => {
  db.query(
    "SELECT * FROM favorites WHERE user_id=?",
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      res.json(data);
    }
  );
};