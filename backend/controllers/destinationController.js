const db = require("../config/db");

/* GET ALL DESTINATIONS */
exports.getDestinations = async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM destinations ORDER BY id DESC"
    );

    res.json(rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

/* GET SINGLE DESTINATION */
exports.getDestinationById = async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM destinations WHERE id=?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Destination not found"
      });
    }

    res.json(rows[0]);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

/* SEARCH DESTINATION */
exports.searchDestinations = async (req, res) => {
  try {

    const search = req.query.search || "";

    const [rows] = await db.query(
      `SELECT * FROM destinations
       WHERE name LIKE ?
       OR location LIKE ?
       OR category LIKE ?`,
      [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      ]
    );

    res.json(rows);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

/* ADD DESTINATION */
exports.addDestination = async (req, res) => {
  try {

    const {
      name,
      location,
      description,
      image_url,
      rating,
      category
    } = req.body;

    await db.query(
      `INSERT INTO destinations
      (
        name,
        location,
        description,
        image_url,
        rating,
        category
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        location,
        description,
        image_url,
        rating,
        category
      ]
    );

    res.json({
      success: true,
      message: "Destination Added"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

/* UPDATE DESTINATION */
exports.updateDestination = async (req, res) => {
  try {

    const {
      name,
      location,
      description,
      image_url,
      rating,
      category
    } = req.body;

    await db.query(
      `UPDATE destinations
       SET
       name=?,
       location=?,
       description=?,
       image_url=?,
       rating=?,
       category=?
       WHERE id=?`,
      [
        name,
        location,
        description,
        image_url,
        rating,
        category,
        req.params.id
      ]
    );

    res.json({
      success: true,
      message: "Destination Updated"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};

/* DELETE DESTINATION */
exports.deleteDestination = async (req, res) => {
  try {

    await db.query(
      "DELETE FROM destinations WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Destination Deleted"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};