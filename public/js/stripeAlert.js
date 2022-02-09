import displayMessage from "./notifications.js";

const stripeAlert = document.getElementById("stripe_alert");

if (stripeAlert) {
  displayMessage("Success", stripeAlert.dataset.alertMsg);
  setTimeout(() => stripeAlert.remove(), 10000);
}
