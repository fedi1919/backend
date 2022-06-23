const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError("could not find a place for the provided id", 404);
  }
  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    return next(
      new HttpError("could not find a place for the provided id", 404)
    );
  }
  res.json({ place });
};

const createPlace = (req, res, next) => {
  // get Data from the request body
  const { title, decription, coordinates, address, creator } = req.body; // const title = req.body.title
  // create the new place
  const createdPlace = {
    title,
    decription,
    location: coordinates,
    address,
    creator,
  };
  //add the created new place to DUMMY_PLACES
  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace) : created place ill be the first element
  //Sending back a response
  res.status(201).json({ createdPlace }); //201 if something new  was successfully created  on the server
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
