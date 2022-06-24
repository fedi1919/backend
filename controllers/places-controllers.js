const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    decription: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  //Find an existing place with the given id
  let place;
  try {
    place = await Place.findById(placeId);
    //findById() does not return a Promise. add exec() to transforme it to a real Promise
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not find a place",
      500
    );
    return next(error);
  }

  //check if the place exists
  if (!place) {
    const error = new HttpError(
      "could not find a place for the provided id",
      404
    );
    return next(error);
  }

  //Sending back a response
  //use toObject to turn it to a normal javaScript object, set getters to true to get rid of the _ before the id
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  //find an existing place with the given user id
  let places;
  try {
    places = await Place.find({ creator: userId }); // find() returns an array
  } catch (err) {
    const error = new HttpError(
      "could not find a place for the provided id",
      404
    );
    return next(error);
  }

  //check if there's places created by the provided user id
  if (!places || places.length === 0) {
    return next(
      new HttpError("could not find  places for the provided id", 404)
    );
  }

  //Sending back a response
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  //validating the request object
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  // get Data from the request body
  const { title, description, coordinates, address, creator } = req.body; // const title = req.body.title

  // create the new place with mongoose model
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://marvel-b1-cdn.bc0a.com/f00000000179470/www.esbnyc.com/sites/default/files/styles/small_feature/public/2019-10/home_banner-min.jpg?itok=uZt-03Vw",
    creator,
  });

  //save the model
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  //Sending back a response
  res.status(201).json({ createdPlace }); //201 if something new  was successfully created  on the server
};

const updatePlaceById = async (req, res, next) => {
  //validating the request object
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }

  //get data from the request body
  const { title, description } = req.body;

  //get the id of the place which will be updated
  const placeId = req.params.pid;

  //identify the place which being updated
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not update the place",
      500
    );
    return next(error);
  }

  //update the place
  place.title = title;
  place.description = description;

  //Storing the updated place
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not update the place",
      500
    );
    return next(error);
  }

  //sending a response
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  //find the place to be deleted
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not delete the place",
      500
    );
    return next(error);
  }

  //delete the place
  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not delete the place",
      500
    );
    return next(error);
  }

  //ending back a response
  res.status(200).json({ message: "deleted place..." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
