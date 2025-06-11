import sharp from "sharp";
import { catchAsync } from "../utils/catchAsync";

import type { ParamsDictionary } from "express-serve-static-core";
import ApiResponse from "../types/responses/ApiResponse";
import { UserDocument } from "../types/models/User";

export const resizePhoto = catchAsync<ParamsDictionary, ApiResponse<null>, UserDocument>(async (req, _res, next) => {
  if (!req.file) {
    next();
    return;
  }

  const uniqueSuffix = `${Date.now().toString()}-${Math.round(Math.random() * 1e6).toString()}`;
  const finalName = `user-${uniqueSuffix}.jpeg`;

  req.file.filename = finalName;
  req.body.avatar = finalName;

  // toFormat will format whatever your image to jpeg
  // jpeg() with quality option will make your photo
  // a bit lighter for storage, but the quality will go down
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 80,
    })
    .toFile(`${__dirname}/../uploads/images/user/${req.file.filename}`);

  next();
});
