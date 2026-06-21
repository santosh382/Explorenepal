const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * @route   GET /api/destinations
 * @desc    Fetch and serve all destinations catalog records
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM destinations ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Database lookup crash.", error: error.message });
  }
});

/**
 * @route   POST /api/destinations
 * @desc    [FIXED] Handles data validation parsing to stop 500 error logs
 */
router.post("/", async (req, res) => {
  try {
    const name = req.body.name || "";
    const location = req.body.location || "";
    const description = req.body.description || "";
    const image_url = req.body.image_url || ""; // Base64 handling enabled
    const rating = req.body.rating ? parseFloat(req.body.rating) : 0.0;
    const category_id = req.body.category_id ? parseInt(req.body.category_id, 10) : 1;
    const budget = req.body.budget || "";
    const difficulty = req.body.difficulty || "";
    const weather = req.body.weather || "";
    const hotels = req.body.hotels || "";
    const restaurants = req.body.restaurants || "";
    const travel_tips = req.body.travel_tips || "";

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location fields are mandatory." });
    }

    const queryStr = `
      INSERT INTO destinations 
      (name, location, description, image_url, rating, category_id, budget, difficulty, weather, hotels, restaurants, travel_tips) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, location, description, image_url, rating, category_id, budget, difficulty, weather, hotels, restaurants, travel_tips];

    const [result] = await db.query(queryStr, values);
    res.status(201).json({ id: result.insertId, name, location });
  } catch (error) {
    console.error("❌ Backend post engine operation crashed:", error);
    res.status(500).json({ message: "SQL entry failed", error: error.message });
  }
});

/**
 * @route   PUT /api/destinations/:id
 * @desc    [FIXED] Handles updates validation parsing to stop 500 error logs
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const name = req.body.name || "";
    const location = req.body.location || "";
    const description = req.body.description || "";
    const image_url = req.body.image_url || "";
    const rating = req.body.rating ? parseFloat(req.body.rating) : 0.0;
    const category_id = req.body.category_id ? parseInt(req.body.category_id, 10) : 1;
    const budget = req.body.budget || "";
    const difficulty = req.body.difficulty || "";
    const weather = req.body.weather || "";
    const hotels = req.body.hotels || "";
    const restaurants = req.body.restaurants || "";
    const travel_tips = req.body.travel_tips || "";

    const queryStr = `
      UPDATE destinations SET 
      name = ?, location = ?, description = ?, image_url = ?, rating = ?, 
      category_id = ?, budget = ?, difficulty = ?, weather = ?, hotels = ?, 
      restaurants = ?, travel_tips = ? 
      WHERE id = ?
    `;
    const values = [name, location, description, image_url, rating, category_id, budget, difficulty, weather, hotels, restaurants, travel_tips, id];

    const [result] = await db.query(queryStr, values);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Itinerary not found" });

    res.status(200).json({ message: "Updated successfully!" });
  } catch (error) {
    console.error("❌ Backend put engine modification crashed:", error);
    res.status(500).json({ message: "SQL modification failed", error: error.message });
  }
});

/**
 * @route   DELETE /api/destinations/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM destinations WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Wiped successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete crashed", error: error.message });
  }
});

module.exports = router;