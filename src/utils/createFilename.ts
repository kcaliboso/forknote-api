import type { Request } from "express";

export const createFilename = (req: Request) => {
  return `${req.protocol}://${req.get("host") ?? "localhost"}/uploads/${req.file?.filename ?? "filename.filetype"}`;
};
