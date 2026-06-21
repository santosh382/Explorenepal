const db = require("../config/db");

/* REGISTER */
exports.registerUser = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    /* CHECK EMAIL */
    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {

      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });

    }

    /* INSERT USER */
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};

/* LOGIN */
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password"
      });

    }

    res.json({
      success: true,
      user: rows[0]
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }

};