const form = document.getElementById("login__form");
const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");

// Displaying Success or Fail messages
function displayMessage(type, message) {
  const el = document.createElement("div");
  el.classList.add("error__message", `error__message--${type}`);
  el.textContent = message;
  document.body.prepend(el);

  setTimeout(() => el.remove(), 5000);
}

// Fetching the API to require Access Token
async function logUserIn(email, password) {
  try {
    const response = await axios({
      method: "post",
      url: "http://localhost:3000/api/v1/users/login",
      data: { email, password },
    });
    displayMessage(response.data.status, "Login Successful");
    location.href = location.origin;
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Listening on form submition
form.addEventListener("submit", (e) => {
  e.preventDefault();

  logUserIn(emailField.value, passwordField.value);
});
