const express = require("express");

const usersControllers = require("../controllers/users-controllers");
const { route } = require("./places-routes");

const router = express.Router();

router.get("/", usersControllers.getUsers);

router.post("/signup", usersControllers.signup);

router.post("/login", usersControllers.login);

module.exports = router;
