const mongoose = require("mongoose");
const { Schema } = mongoose;
const tourModel = require("./tourModel");

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      maxlength: 280,
      required: [true, "A review must have a text"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "A review must be have a rating"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A review must be associated with an user"],
    },
    tour: {
      type: Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "A review must be associated with a tour"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Create unique compound index that prevents multiple reviews
// from a user on the same route
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Calculating averages for reviews on particular tour
reviewSchema.statics.calculateAvgRating = async function (tourId) {
  const result = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        ratingsAvg: { $avg: "$rating" },
        ratingsNum: { $sum: 1 },
      },
    },
  ]);
  return result;
};

// Update the tour statistics on every new review
reviewSchema.post("save", async function () {
  const result = await this.constructor.calculateAvgRating(this.tour);
  if (!result) return;
  let { ratingsAvg, ratingsNum } = result[0];
  ratingsAvg = parseFloat(ratingsAvg).toFixed(2);

  await tourModel.findByIdAndUpdate(this.tour, {
    ratingsAvg,
    ratingsNum,
  });
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});

// Update the tour statistics on every review update
reviewSchema.post(/^findOneAnd/, async function () {
  const review = await this.model.findOne(this.getQuery());
  if (!review) return;

  const result = await this.model.calculateAvgRating(review.tour);
  if (result.length < 0) return;

  const { ratingsAvg, ratingsNum } = result[0];

  await tourModel.findByIdAndUpdate(review.tour, {
    ratingsAvg,
    ratingsNum,
  });
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
