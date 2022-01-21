const mongoose = require("mongoose");
const { Schema } = mongoose;

const tourSchema = new Schema(
  {
    tourName: {
      type: String,
      required: [true, "Tour must have a name"],
      unique: true,
    },
    imageCover: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Tour must have a cover image"],
    },
    images: {
      type: [String],
      lowercase: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Tour must have a duration"],
    },
    price: {
      type: Number,
      required: [true, "Tour must have a price"],
    },
    summary: {
      type: String,
      trim: true,
      default: "This is an amazing tour. Don't Miss",
    },
    description: {
      type: String,
      trim: true,
      default: "Default Description",
    },
    locations: [
      {
        type: {
          type: String,
          enum: ["Point"],
          required: [
            true,
            "Location coordinates must have a type property: 'Point' ",
          ],
        },
        coordinates: [
          {
            type: [Number],
            required: [true, "Location must have coordinates"],
          },
        ],
        name: {
          type: String,
        },
      },
    ],
    difficulty: {
      type: String,
      default: "medium",
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Choose between easy,medium,hard",
      },
    },
    hidden: {
      type: Boolean,
      default: false,
      select: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, "Rating cant be less than 1"],
      max: [5, "Rating must be 5 at maximum"],
    },
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Middleware, that prevents hidden(Special) tours to be discovered on search
// Using regex to apply to all find operation (findOne,findById ...)
tourSchema.pre(/^find/, function (next) {
  this.find({ hidden: false });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({ path: "guides", select: "name photo" });
  next();
});

tourSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "tour",
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
