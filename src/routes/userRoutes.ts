import { upload } from "../config/multerSetup";
import { deleteCurrentUser, forgotPassword, getUserInfo, resetPassword, updatePassword, updateUser } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Router } from "express";
import { resizePhoto } from "../middlewares/resizePhoto";

const userRoutes = Router();

userRoutes.get("/", [isAuthenticated], getUserInfo);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password/:token", resetPassword);
userRoutes.post("/update-password", [isAuthenticated], updatePassword);
userRoutes.patch("/", [isAuthenticated, upload.single("avatar"), resizePhoto], updateUser);
userRoutes.delete("/delete", [isAuthenticated], deleteCurrentUser);

export default userRoutes;
