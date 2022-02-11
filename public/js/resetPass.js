import displayMessage from "./notifications.js";

const forgetForm = document.getElementById("forget__form");
const resetForm = document.getElementById("reset__form");

// Requesting password reset link on the provided email
async function sendResetLink(email) {
  try {
    const response = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/forgetPass",
      data: { email },
    });
    displayMessage(response.data.status, response.data.msg);
    setTimeout(() => (window.location.href = location.origin), 3000);
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

// Reseting password
async function resetPass(token, data) {
  try {
    const response = await axios({
      method: "PATCH",
      url: `http://localhost:3000/api/v1/users/resetPass/${token}`,
      data,
    });
    displayMessage(response.data.status, response.data.msg);
    setTimeout(
      () => (window.location.href = location.origin + "/me"),
      2000
    );
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

if (forgetForm)
  forgetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;

    sendResetLink(email);
  });

if (resetForm)
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {};
    const token = resetForm.dataset.token;
    data.password = document.getElementById("password").value;
    data.confirmPass = document.getElementById("confirmPass").value;

    resetPass(token, data);
  });
