const express = require("express");
const router = express.Router();

const {
  getUsers,
  deleteUser,
  makeAdmin
} = require("../controllers/userController");

router.get("/", getUsers);
router.delete("/:id", deleteUser);
router.put("/make-admin/:id", makeAdmin);

module.exports = router;