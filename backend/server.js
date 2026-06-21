const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* MIDDLEWARE SETUP */
app.use(cors());
app.use(express.json({ limit: "50mb" })); // 🌟 CRITICAL: Base64 massive image size allow garna body parser thapeko
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* ROUTES CONFIGURATION LOADING */
const destinationRoutes = require("./routes/destinationRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const bookingRoutes = require("./routes/bookingRoutes.js"); 

/* API ROUTE REDIRECTIONS */
app.use("/api/destinations", destinationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes); // 🌟 Links /api/bookings safely

/* HOME ENGINE ENTRY POINT */
app.get("/", (req, res) => {
  res.send("Explore Nepal API Running flawlessly...");
});

/* ENGINE PORTS INITIALIZATION */
const PORT = process.env.PORT || 5000;

/* RUN SERVER INSTANCE */
app.listen(PORT, () => {
  console.log(`🚀 System Server running flawlessly on port ${PORT}`);
});