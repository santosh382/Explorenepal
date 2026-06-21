const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Adjust path based on your config directory

/**
 * @route   GET /api/bookings
 * @desc    Fetch all user reservations from database context
 */
router.get("/", async (req, res) => {
  try {
    // Safely reads raw storage structures sorted by newest records
    const [rows] = await db.query("SELECT * FROM bookings ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Failed logging pull queries from bookings database context:", error);
    res.status(500).json({ message: "Internal Server database lookup crash.", error: error.message });
  }
});

/**
 * @route   PUT /api/bookings/:id
 * @desc    Allows admin to change verification states (Confirmed/Cancelled)
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    if (!status) {
      return res.status(400).json({ message: "Payload missing 'status' string value" });
    }

    const [result] = await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Target booking profile record not found." });
    }

    res.status(200).json({ message: `Status shifted to ${status}!` });
  } catch (error) {
    console.error("❌ Failed patching database entries updates:", error);
    res.status(500).json({ message: "Internal server error executing status shifts.", error: error.message });
  }
});

module.exports = router;