const db = require("../config/db");

exports.getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM bookings ORDER BY createdAt DESC"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      message: "Database query failed",
      error: error.message,
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [result] = await db.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Booking record not found",
      });
    }

    res.status(200).json({
      message: `Status updated to ${status} successfully!`,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};