import { isAuthenticated } from './../middleware/auth';
import { Router } from "express";
import { getAllProducts, getUserDetails, loginUser, registerUser, updateUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.route("/register").post(registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/me").get(isAuthenticated, getUserDetails);

userRouter.route("/products").get(getAllProducts);

userRouter.route("/update").post(isAuthenticated, updateUser);

export default userRouter;