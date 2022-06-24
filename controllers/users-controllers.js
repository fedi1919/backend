const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Hammami Fedi",
    email: "fedi1997@gmail.com",
    password: "123456",
  },
];

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
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
    existingUser = await User.findOne({ email });
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

const login = (req, res, next) => {
  //extract data from the body of the request
  const { email, password } = req.body;

  //identify the user
  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user. Credentials seem to be wrong",
      401
    );
  }

  //sending a response
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
