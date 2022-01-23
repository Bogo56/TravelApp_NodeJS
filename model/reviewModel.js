const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    text: String,
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name photo" });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
