import { isAuthenticated } from './../middleware/auth';
import { Router } from "express";
import { confirmOrder, createPaymentIntent, getSingleOrder, getUserOrders } from "../controllers/order.controller";
import { updateUser } from '../controllers/user.controller';

const orderRouter = Router();

orderRouter.route("/payment-intent").post(isAuthenticated, createPaymentIntent);

orderRouter.route("/confirm").post(isAuthenticated, confirmOrder);

orderRouter.route("/me").get(isAuthenticated, getUserOrders);

orderRouter.route("/:orderId").get(isAuthenticated, updateUser);

export default orderRouter;