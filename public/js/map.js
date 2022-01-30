mapboxgl.accessToken =
  "pk.eyJ1IjoiYm9nbzkwIiwiYSI6ImNreTkyMDRydzAyNGwydW96NHB2OW4xNDIifQ.jt6TBSLnCr0u23qnm-SX1w";

// 1. Adding the map on the page
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v10",
  center: [25.4999693, 43.0861493],
  zoom: 5,
  scrollZoom: false,
});

// 2. Using MapBox JS SDK to make the requests for the resources
const mapBoxClient = mapboxSdk({
  accessToken:
    "pk.eyJ1IjoiYm9nbzkwIiwiYSI6ImNreTkyMDRydzAyNGwydW96NHB2OW4xNDIifQ.jt6TBSLnCr0u23qnm-SX1w",
});

// 3.Getting locations data from element data attribure
const coordinatesData = JSON.parse(
  document.querySelector("#map").dataset.coordinates
);

// 4.Creating an async function that fetches the data and displays the route
async function displayRoute(data) {
  // Get route data
  const result = await mapBoxClient.directions
    .getDirections({
      profile: "driving",
      waypoints: data,
      geometries: "geojson",
    })
    .send();

  const directions = result.body;

  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: directions.routes[0].geometry.coordinates,
    },
  };

  // Adding a layer to display the route from the fetched data
  map.addLayer({
    id: "route",
    type: "line",
    source: {
      type: "geojson",
      data: geojson,
    },
    layout: {
      "line-join": "miter",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#3887be",
      "line-width": 5,
      "line-opacity": 0.75,
    },
  });

  const bounds = new mapboxgl.LngLatBounds();

  // Adding markers for the stops on the map
  for (let i = 0; i < directions.waypoints.length; i++) {
    const el = document.createElement("div");
    el.className = "map__marker";
    new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat(directions.waypoints[i].location)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${data[i].name}`
        )
      )
      .addTo(map);
    bounds.extend(directions.waypoints[i].location);
  }

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      boottom: 300,
      left: 300,
      right: 300,
    },
  });
}

// Runing the function after the map has loaded
map.on("load", () => {
  displayRoute(coordinatesData);
});
