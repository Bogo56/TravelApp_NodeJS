const mongoose = require("mongoose");
const { Schema } = mongoose;
const { format } = require("date-and-time");

const tourSchema = new Schema(
  {
    tourName: {
      type: String,
      required: [true, "Tour must have a name"],
      unique: true,
      max: [50, "Tour name can be maximum 100 characters"],
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
      required: [true, "Tour must have images"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 3,
        msg: "You must add exactly 3 image urls",
      },
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
      max: [100, "Summary can be maximum 100 characters"],
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
    ratingsAvg: {
      type: Number,
      default: 4.5,
      min: [1, "Rating cant be less than 1"],
      max: [5, "Rating must be 5 at maximum"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsNum: {
      type: Number,
      default: 0,
    },
    guides: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 1,
        msg: "Tour must have at least 2 guides",
      },
    },
    nextDate: {
      type: Date,
      default: Date.now() + 1000 * 60 * 60 * 24 * 30 * 10,
    },
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

tourSchema.methods.getFormatedDate = function () {
  return format(this.nextDate, "D MMM YYYY");
};

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
