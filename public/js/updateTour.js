import { GridView } from "./templates.js";
import displayMessage from "./notifications.js";

const tourGrid = document.getElementById("tour__minigrid");
const tourForm = document.getElementById("tour__form");

const gridView = new GridView("tour__minigrid");

// Getting Tour Data
async function getTours() {
  try {
    const response = await axios({
      method: "GET",
      url: "http://localhost:3000/api/v1/tours",
    });
    return response.data;
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Updating Data
async function updateTour(id, data) {
  try {
    const response = await axios({
      method: "PATCH",
      url: `http://localhost:3000/api/v1/tours/${id}`,
      data,
    });
    displayMessage(response.data.status, response.data.msg);
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Runs on page load
async function loadTours() {
  const data = await getTours();
  gridView.showView(data.data);
}

// Event Listeners

tourGrid.addEventListener("click", (e) => {
  if (!["IMG", "P"].includes(e.target.tagName)) return;

  const id = e.target.dataset.id;
  gridView.hideView(id);
});

tourForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("tour__update--btn");
  btn.textContent = "Updating...";

  const id = e.currentTarget.dataset.id;
  const formData = new FormData(e.currentTarget);

  await updateTour(id, formData);

  btn.textContent = "Done";
});

loadTours();
