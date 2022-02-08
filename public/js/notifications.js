// Displaying Success or Fail messages
function displayMessage(type, message) {
  const el = document.createElement("div");
  el.classList.add("display__message", `display__message--${type}`);
  el.textContent = message;
  document.body.prepend(el);

  setTimeout(() => el.remove(), 5000);
}

export default displayMessage;
