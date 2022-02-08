const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../errors/customErrors.js");
const catchAsyncError = require("../errorHandlers/catchAsync.js");

function fileFilter(req, file, cb) {
  if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
    cb(new AppError("File must be jpg or png", 400));
  } else {
    cb(null, true);
  }
}

exports.upload = multer({
  limits: { fileSize: 3145728 },
  fileFilter,
});

// Resizing single user photo
exports.resizeImage = catchAsyncError(async function (
  req,
  res,
  next
) {
  const input = req.file;

  if (!input) return next();

  const filename = `/img/users/${req.user.id}.jpg`;

  await sharp(input.buffer)
    .resize(300, 300, {
      fit: "cover",
    })
    .jpeg({ quality: 90 })
    .toFile(`public/${filename}`);

  req.body.photo = filename;
  next();
});

// Resizing tour images in bulk
exports.resizeImages = catchAsyncError(async function (
  req,
  res,
  next
) {
  const input = req.files;

  if (!input) return next();

  if (input.images) {
    req.body.images = [];

    // Check if all images are valid
    await Promise.all(
      input.images.map(async (el, i) => {
        const image = sharp(el.buffer);
        const meta = await image.metadata();
        if (meta.width / meta.height < 1.5 || meta.width < 600)
          throw new AppError(
            "Image must have 2:1 dimensions and width of 600px or more",
            400
          );
        return image;
      })
    ).then(async (images) => {
      // If valid - save them
      await Promise.all(
        images.map(async (img, i) => {
          const filename = `/img/tours/${req.params.id}_${i}.jpg`;

          await img
            .resize(700, 340, {
              fit: "cover",
            })
            .jpeg({ quality: 90 })
            .toFile(`public${filename}`);

          // Attach image path to the req body - to save it to DB
          req.body.images.push(filename);
        })
      );
    });
  }

  if (input.imageCover) {
    const image = sharp(input.imageCover[0].buffer);
    const meta = await image.metadata();
    if (meta.width / meta.height < 1.5 || meta.width < 600)
      throw new AppError(
        "Cover image must have 2:1 dimensions and width of 600px or more",
        400
      );

    await image
      .resize(700, 340, {
        fit: "cover",
      })
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.params.id}_cover.jpg`);

    req.body.imageCover = `/img/tours/${req.params.id}_cover.jpg`;
  }

  next();
});
