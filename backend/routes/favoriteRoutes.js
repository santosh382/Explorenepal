const express = require("express");
const router = express.Router();
const db = require("../db");

// ADD TO FAVORITES
router.post("/", (req, res) => {
  const { user_id, destination_id } = req.body;

  db.query(
    "INSERT INTO favorites (user_id, destination_id) VALUES (?, ?)",
    [user_id, destination_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Added to favorites ❤️" });
    }
  );
});

// GET FAVORITES
router.get("/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  db.query(
    `SELECT d.* 
     FROM favorites f
     JOIN destinations d ON f.destination_id = d.id
     WHERE f.user_id = ?`,
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

module.exports = router;