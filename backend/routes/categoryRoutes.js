const router = require("express").Router();
const db = require("../db");

// GET ALL CATEGORIES
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.json(data);
  });
});

module.exports = router;