import { upload } from "../config/multerSetup";
import { deleteCurrentUser, forgotPassword, getUserInfo, resetPassword, updatePassword, updateUser } from "../controllers/userController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { Router } from "express";
import { resizePhotos } from "../middlewares/resizePhotos";

const userRoutes = Router();

userRoutes.get("/", [isAuthenticated], getUserInfo);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/reset-password/:token", resetPassword);
userRoutes.post("/update-password", [isAuthenticated], updatePassword);
userRoutes.patch("/", [isAuthenticated, upload.single("avatar"), resizePhotos], updateUser);
userRoutes.delete("/delete", [isAuthenticated], deleteCurrentUser);

export default userRoutes;
