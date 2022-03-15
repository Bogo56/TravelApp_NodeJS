const mongoose = require("mongoose");
const TourModel = require("../model/tourModel.js");
const UserModel = require("../model/userModel.js");
const ReviewModel = require("../model/reviewModel.js");
const fs = require("fs");

const text =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat ";

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

// const superUser = JSON.parse(
//   fs.readFileSync(`${__dirname}/seed_files/superuser.json`)
// );

// userData.push(superUser[0]);

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
    // Create Tours
    const tours = await TourModel.create(tourData, {
      validateBeforeSave: false,
    });
    // Create Users
    const users = await UserModel.create(userData, {
      validateBeforeSave: false,
    });
    // Filter guides
    const guides = users
      .filter((usr) => usr.role === "guide")
      .map((usr) => usr.id);

    // Loop trough each Tour and add guides and reviews
    for (let tourId = 0; tourId < 11; tourId++) {
      await TourModel.findByIdAndUpdate(tours[tourId].id, { guides });

      for (let i = 0; i < 11; i++) {
        await ReviewModel.create(
          [
            {
              text,
              rating: Math.random() * (5 - 3.5) + 3.5,
              tour: tours[tourId].id,
              user: users[i].id,
            },
          ],
          { validateBeforeSave: false }
        );
      }
    }
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
