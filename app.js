const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// this middleware is only reached if we have some request which didn't get a response
app.use((req, res, next) => {
  throw new HttpError("Could not find this route", 404);
});

app.use((error, req, res, next) => {
  // check if a response has already been sent
  if (res.headerSent) {
    return next(error);
  }
  //Sendig a reponse
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknon error occured!" });
});

//use mongoose to connect
mongoose
  .connect(
    "mongodb+srv://fedi:fedi1997@cluster0.tz7flyq.mongodb.net/demo?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
