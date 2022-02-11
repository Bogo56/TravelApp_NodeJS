import displayMessage from "./notifications.js";
const stripe = Stripe(
  "pk_test_51KQmrBJL6fvrCbibZuFwCfSaAsJCH3DkNVPQEKd0wLiaWD3TxctQqK6eS1WXvOsKYQv11TcCiGXsxziKDkZ3DVll00R6x3AYev"
);

const bookBtn = document.getElementById("cta__btn");

// Starting a checkout session on Stripe
async function beginCheckout(tourId) {
  try {
    const response = await axios({
      method: "POST",
      url: `http://localhost:3000/api/v1/bookings/create-checkout-session/${tourId}`,
    });

    // Redirect user to payment window
    await stripe.redirectToCheckout({
      sessionId: response.data.session.id,
    });
  } catch (err) {
    displayMessage(err.response.data.status, err.response.data.msg);
  }
}

if (bookBtn)
  bookBtn.addEventListener("click", async (e) => {
    //   Get tourId stored on the button data attribute
    const tourId = e.target.dataset.tourId;
    e.target.textContent = "Processing...";

    // Start a Stripe checkout session
    await beginCheckout(tourId);
  });
