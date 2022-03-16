import displayMessage from "./notifications.js";

const form = document.getElementById("login__form");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const logOutBtn = document.getElementById("logout");

// Fetching the API to require Access Token
async function logUserIn(email, password) {
  try {
    const response = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: { email, password },
    });
    displayMessage(response.data.status, "Login Successful");
    location.href = location.origin;
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Invalidating access token
async function logUserOut() {
  try {
    const response = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    displayMessage(response.data.status, "Logout Successful");
    location.reload(true);
  } catch (err) {
    displayMessage("Error", err.response.data.msg);
  }
}

// Listening on form submition
if (form)
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    logUserIn(emailField.value, passwordField.value);
  });

// Listening on logout button
if (logOutBtn)
  logOutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    logUserOut();
  });
