import displayMessage from "./notifications.js";

const infoForm = document.getElementById("info__form");
const passForm = document.getElementById("password__form");

// Sending the updated info to the API
async function updateUserInfo(data) {
  try {
    const response = await axios({
      method: "PATCH",
      url: `/api/v1/users/updateMyInfo`,
      data,
    });
    displayMessage(response.data.status, response.data.msg);
    location.reload(true);
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Sending the updated password to the API
async function updateUserPass(data) {
  try {
    const response = await axios({
      method: "PATCH",
      url: `/api/v1/users/updateMyPass`,
      data,
    });
    displayMessage(response.data.status, response.data.msg);
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

infoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(infoForm);

  updateUserInfo(formData);
});

passForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {};
  data.oldPass = document.getElementById("oldPass").value;
  data.password = document.getElementById("password").value;
  data.confirmPass = document.getElementById("confirmPass").value;

  updateUserPass(data);
});
