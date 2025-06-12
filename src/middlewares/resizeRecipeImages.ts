import type { ParamsDictionary } from "express-serve-static-core";
import sharp from "sharp";
import { catchAsync } from "../utils/catchAsync";
import ApiResponse from "../types/responses/ApiResponse";
import { RecipeDocument } from "../types/models/Recipe";

interface RecipeImages {
  cover?: Express.Multer.File[];
  images?: Express.Multer.File[];
}

export const resizeRecipeImages = catchAsync<ParamsDictionary, ApiResponse<null>, RecipeDocument>(async (req, _res, next) => {
  const files = req.files as RecipeImages;
  if (!files.cover || !files.images) {
    next();
    return;
  }

  // cover images first
  const uniqueSuffix = `${Date.now().toString()}-${Math.round(Math.random() * 1e6).toString()}`;
  const coverImageName = `recipe-cover-${uniqueSuffix}.jpeg`;

  await sharp(files.cover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({
      quality: 80,
    })
    .toFile(`${__dirname}/../uploads/images/recipes/${coverImageName}`);

  req.body.cover = coverImageName;
  req.body.images = [];

  // other images
  // we do this await Promise.all because using async await
  // inside a loop will not work.
  await Promise.all(
    files.images.map(async (file, index) => {
      const filename = `recipe-images-${(index + 1).toString()}-${uniqueSuffix}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({
          quality: 80,
        })
        .toFile(`${__dirname}/../uploads/images/recipes/${filename}`);

      req.body.images?.push(filename);
    }),
  );

  next();
});
