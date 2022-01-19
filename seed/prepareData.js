const fs = require("fs");
const reverseGeo = require("./seed_helpers");
const { route } = require("express/lib/application");

/*
This is the module that is used to initially structure and prepare the data that will be later imported into the
database.
- it does reverse Geocoding using MapBox API to get the coordinates of the destinations visited in every tour
that will be needed later to display them on the map.
- after that it adds the prepared data to the main tours object and saves it to a file.
*/

const tours = JSON.parse(fs.readFileSync("./seed_files/bg_destinations.json"));
const tourRoutes = JSON.parse(
  fs.readFileSync("./seed_files/finalTourRoutes.json")
);

async function prepareRoutes() {
  for (let i = 0; i < tourRoutes.length; i++) {
    const tour = tours[i];
    const routes = tourRoutes[i].destinations;
    tourRoutes[i].geometry = [];
    for (let route of routes) {
      let res = await reverseGeo(route);
      res.name = route;
      tourRoutes[i].geometry.push(res);
    }
  }
}

prepareRoutes()
  .then(() => {
    fs.writeFile(
      "./finalTourRoutes.json",
      JSON.stringify(tourRoutes),
      (err) => {
        if (err) throw Error(err.message);
      }
    );
  })
  .catch((err) => {
    console.log(err);
  });

async function prepareTours() {
  for (let i = 0; i < tourRoutes.length; i++) {
    const tour = tours[i];
    const route = tourRoutes[i];
    tour.locations = route.geometry;
  }
}

prepareTours()
  .then(() => {
    fs.writeFile(
      "./bg_destinations_final.json",
      JSON.stringify(tours),
      (err) => {
        if (err) throw new Error(err.message);
      }
    );
  })
  .catch((err) => console.log(err));
