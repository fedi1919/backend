const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();

app.use("/api/places", placesRoutes);

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
app.listen(5000);
