const catchAsyncError = require("../errorHandlers/catchAsync.js");
const factory = require("./handlerFactories.js");
const TourModel = require("../model/tourModel.js");
const Stripe = require("stripe");
const bookingModel = require("../model/bookingModel.js");
const AppError = require("../errors/customErrors.js");

exports.createBookingSession = catchAsyncError(async function (
  req,
  res,
  next
) {
  // 1.Get Product Data
  const tour = await TourModel.findById(req.params.tourId);

  if (!tour) throw new AppError("This tour does not exist", 404);

  // 2.Create Stripe Payment Session
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  let session;

  try {
    session = await stripe.checkout.sessions.create({
      // Removed :3000 - so it works on the server
      success_url: `${req.protocol}://${req.hostname}/?alert=booking`,
      cancel_url: `${req.protocol}://${req.hostname}/`,
      customer_email: req.user.email,
      client_reference_id: req.user.id,
      line_items: [
        {
          price_data: {
            unit_amount: tour.price * 100,
            currency: "bgn",
            product_data: {
              name: tour.tourName,
              description: tour.summary,
              images: [
                `${req.protocol}://${req.hostname}${tour.imageCover}`,
              ],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      metadata: { tourId: tour.id },
    });
  } catch (err) {
    throw new Error(err.message);
  }

  // 3.Redirect user to Strype Checkout page

  res.status(200).json({
    status: "Success",
    session,
  });
});

// Creating Webhook that receives the event from Stripe
exports.receivePaymentHook = catchAsyncError(async function (
  req,
  res
) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_HOOK_SECRET;
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed")
    await finishBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
});

// Create the booking after Stripe sends the purchase event to the webhook
finishBookingCheckout = async function (session) {
  const user = session.client_reference_id;
  const tour = session.metadata.tourId;
  const price = session.amount_total / 100;

  await bookingModel.create({ user, tour, price });
};

// Controllers accessible by admins

exports.createBooking = factory.createOne(bookingModel, {
  filterData: ["tour", "user", "price"],
});

exports.getAllBookings = factory.getAll(bookingModel);

exports.deleteBooking = factory.deleteOne(bookingModel);
