const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // return only the name and the email, exclude the password
  } catch (err) {
    const error = new HttpError("Fetching users failed. Please try again", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  //adding validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  //create a new user
  const { name, email, password, places } = req.body;

  //check if the email address is already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed. Please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please log in instead.",
      422
    );
    return next(error);
  }

  //if we don't have an existing user, let's create one
  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://media-exp1.licdn.com/dms/image/C4D1BAQEVG7dYA79gWA/company-background_10000/0/1560684767266?e=2147483647&v=beta&t=lTG1xQnPRDPTiIFzyTLqf3cUHio1AHq3xOFOh2Az8f0",
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed. Please try again.", 500);
    return next(error);
  }

  //sendig a response
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  //extract data from the body of the request
  const { email, password } = req.body;

  //check if the email address is already exists
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed. Please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials. Could not log you in",
      401
    );
    return next(error);
  }

  //sending a response
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
