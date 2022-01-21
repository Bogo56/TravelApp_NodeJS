const mongoose = require("mongoose");
const TourModel = require("../model/tourModel.js");
const UserModel = require("../model/userModel.js");
const ReviewModel = require("../model/reviewModel.js");
const fs = require("fs");

require("dotenv").config({
  path: `${__dirname}/../.env`,
});

const dbURL = process.env.DATABASE.replace(
  "<DB_PASSWORD>",
  process.env.DB_PASSWORD
);

const tourData = JSON.parse(
  fs.readFileSync(
    `${__dirname}/seed_files/bg_destinations_final.json`
  )
);

const userData = JSON.parse(
  fs.readFileSync(`${__dirname}/seed_files/users.json`)
);

const connectDB = async () => {
  await mongoose.connect(dbURL);
};

async function clearDB() {
  try {
    await TourModel.deleteMany();
    await UserModel.deleteMany();
    await ReviewModel.deleteMany();
    console.log("DB cleared");
  } catch (err) {
    throw new Error(err.message);
  }
}

async function seedDB() {
  try {
    await TourModel.create(tourData);
    await UserModel.create(userData, { validateBeforeSave: false });
    console.log("Database has been seeded Successfully");
  } catch (err) {
    throw new Error(err.message);
  }
}

connectDB()
  .then(async () => {
    await clearDB();
  })
  .then(async () => {
    await seedDB();
    process.exit();
  })
  .catch((err) => {
    console.log(err.message);
  });
