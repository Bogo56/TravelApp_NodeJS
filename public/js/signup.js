import displayMessage from "./notifications.js";

const signupForm = document.getElementById("signup__form");

// Sending new user data
async function registerUser(data) {
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/signup",
      data,
    });
    displayMessage(response.data.status, response.data.msg);
    location.href = location.origin + "/me";
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

if (signupForm)
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {};
    data.name = document.getElementById("name").value;
    data.email = document.getElementById("email").value;
    data.password = document.getElementById("password").value;
    data.confirmPass = document.getElementById("confirmPass").value;

    registerUser(data);
  });
