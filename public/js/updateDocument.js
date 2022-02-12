import { TourGridView, UserGridView } from "./templates.js";
import displayMessage from "./notifications.js";

const form = document.getElementById("edit__form");

// The grid container that will hold the grid elements
const tourGrid = document.getElementById("tour__minigrid");
const userGrid = document.getElementById("user__minigrid");

// Declaring global variables
const grid = tourGrid || userGrid;
let gridView;
let entity;

// Defining the gridView to use
if (tourGrid) {
  gridView = new TourGridView("tour__minigrid");
  entity = "tours";
}

if (userGrid) {
  gridView = new UserGridView("user__minigrid");
  entity = "users";
}

// Getting Tour Data
async function getDocuments() {
  try {
    const response = await axios({
      method: "GET",
      url: `http://localhost:3000/api/v1/${entity}`,
    });
    return response.data;
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Updating Data
async function updateDocument(id, data) {
  try {
    const response = await axios({
      method: "PATCH",
      url: `http://localhost:3000/api/v1/${entity}/${id}`,
      data,
    });
    loadData();
    displayMessage(response.data.status, response.data.msg);
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Runs on page load
async function loadData() {
  gridView.showSpinner();
  const data = await getDocuments();
  gridView.showView(data.data);
}

// Event Listeners

grid.addEventListener("click", (e) => {
  if (!["IMG", "P"].includes(e.target.tagName)) return;

  const id = e.target.dataset.id;

  gridView.hideView(id);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = e.currentTarget.dataset.id;
  let formData;

  if (tourGrid) {
    formData = new FormData(e.currentTarget);
  }

  if (userGrid) {
    formData = {
      role: document.getElementById("role").value,
      active: document.getElementById("active").value,
    };
  }

  await updateDocument(id, formData, entity);
});

loadData();

const backBtn = document.getElementById("back");
if (backBtn)
  backBtn.addEventListener("click", () => {
    loadData();
  });
