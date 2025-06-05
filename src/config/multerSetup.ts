import multer, { FileFilterCallback } from "multer";
import type { Request } from "express";
import path from "path";

const imageFileFilter = (_req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  const allowedMimes = ["image/png", "image/jpeg", "image/jpg"];

  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    callback(null, true);
  } else {
    callback(new Error("Only .png, .jpg and .jpeg formats are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (_req: Request, file: Express.Multer.File, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = `${Date.now().toString()}-${Math.round(Math.random() * 1e6).toString()}`;
    const finalName = `${base}-${uniqueSuffix}${ext}`;
    callback(null, finalName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: imageFileFilter,
});
