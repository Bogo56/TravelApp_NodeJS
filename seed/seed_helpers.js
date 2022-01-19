require("dotenv").config({ path: `${__dirname}/../.env` });
const fetch = require("node-fetch");

const searchApi =
  "https://api.mapbox.com/geocoding/v5/mapbox.places/";
const token = process.env.MAPBOX_TOKEN;

// Helper function that uses the MapBox API to do a reverse Geocoding of a destination

const reverseGeo = async (location) => {
  const url =
    searchApi + `${location}.json?access_token=` + token;
  const response = await fetch(url);
  const coordinates = await response.json();
  return coordinates.features[0].geometry;
};

module.exports = reverseGeo;
