const HttpError = require("../models/http-error");

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

const signup = (req, res, next) => {
  //create a new user
  const { id, name, email, password } = req.body;

  //check if the email address is already exists
  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user! Email already exists", 422);
  }
  const createdUser = {
    id,
    name,
    email,
    password,
  };

  //add the new user to DUMMY_USERS
  DUMMY_USERS.push(createdUser);

  //sendig a response
  res.status(201).json({ user: createdUser });
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
