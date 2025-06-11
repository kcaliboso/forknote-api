import type { Request, Response, NextFunction } from "express";
import sharp from "sharp";

export const resizePhotos = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    next();
    return;
  }

  const uniqueSuffix = `${Date.now().toString()}-${Math.round(Math.random() * 1e6).toString()}`;
  const finalName = `file-${uniqueSuffix}.jpeg`;

  req.file.filename = finalName;

  // toFormat will format whatever your image to jpeg
  // jpeg() with quality option will make your photo
  // a bit lighter for storage, but the quality will go down
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 80,
    })
    .toFile(`${__dirname}/../uploads/${req.file.filename}`);

  next();
};
