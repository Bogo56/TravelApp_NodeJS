const app = require("./app.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const dbURL = process.env.DATABASE.replace(
  "<DB_PASSWORD>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Conn to DB failed"));

const port = process.env.PORT || 3000;

app.listen(port);
