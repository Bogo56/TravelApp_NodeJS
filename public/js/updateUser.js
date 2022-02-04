import displayMessage from "./notifications.js";

const infoForm = document.getElementById("info__form");
const passForm = document.getElementById("password__form");

// Sending the updated info to the API
async function updateUserInfo(data) {
  try {
    const response = await axios({
      method: "PATCH",
      url: "http://localhost:3000/api/v1/users/updateMyInfo",
      data,
    });
    displayMessage(response.data.status, response.data.msg);
    location.reload(true);
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Sending the updated password to the API
async function updateUserPass(oldPass, password, confirmPass) {
  try {
    const response = await axios({
      method: "PATCH",
      url: "http://localhost:3000/api/v1/users/updateMyPass",
      data: { oldPass, password, confirmPass },
    });
    displayMessage(response.data.status, response.data.msg);
    location.reload(true);
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

infoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // const email = document.getElementById("email").value;
  // const name = document.getElementById("name").value;

  const formData = new FormData(infoForm);

  updateUserInfo(formData);
});

passForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const oldPass = document.getElementById("oldPass").value;
  const password = document.getElementById("password").value;
  const confirmPass = document.getElementById("confirmPass").value;

  updateUserPass(oldPass, password, confirmPass);
});
