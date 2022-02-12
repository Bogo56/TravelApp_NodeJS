// Displaying Success or Fail messages
function displayMessage(type, message) {
  const prevMsg = document.getElementById("alertMsg");
  if (prevMsg) prevMsg.remove();

  const el = document.createElement("div");
  el.classList.add("display__message", `display__message--${type}`);
  el.id = "alertMsg";
  el.textContent = message;
  document.body.prepend(el);

  setTimeout(() => el.remove(), 5000);
}

export default displayMessage;
