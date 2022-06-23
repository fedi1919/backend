const HttpError = require("../models/http-error");

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

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    return next(
      new HttpError("could not find  places for the provided id", 404)
    );
  }
  res.json({ places });
};

const createPlace = (req, res, next) => {
  // get Data from the request body
  const { id, title, decription, coordinates, address, creator } = req.body; // const title = req.body.title
  // create the new place
  const createdPlace = {
    id,
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

const updatePlaceById = (req, res, next) => {
  //get data from the request body
  const { title, description } = req.body;

  //get the id of the updated place
  const placeId = req.params.pid;

  //identify the place which being updated
  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  //update the place
  updatedPlace.title = title;
  updatedPlace.decription = description;

  //replace the old object with the new updated one
  DUMMY_PLACES[placeIndex] = updatedPlace;

  //sending a response
  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "deleted place..." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
