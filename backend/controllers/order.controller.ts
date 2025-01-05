import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel from "../models/order.model";
import Stripe from "stripe";

interface ICreateOrderRequest {
    items: [
        {
            name: string;
            quantity: number;
            price: number;
            image: string;
            product: string;
        }
    ],
    total: number;
}

const stripe = new Stripe("sk_test_51LUVg8SJg6C6AJ2fp9njBNvIraLIS8YVl1vfejtMEgee3MM98BZGrO2apdmiYsfhe5PjYffphSzS84MRspuEK9O800Cr2ugasI");

// Route to create a payment intent
export const createPaymentIntent = catchAsyncError(
    async (req: any, res: Response, next: NextFunction) => {
        const { items, total }: { items: any[]; total: number } = req.body;

        // Ensure items and total are valid
        if (!items || items.length === 0 || !total) {
            return next(new ErrorHandler("Invalid order data", 400));
        }

        try {
            let description = items.reduce(
                (total, item) => total + `${item.name}, `,
                ""
            );
            // Create a payment intent
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(total * 100), // Convert to smallest currency unit (e.g., paise)
                currency: "INR",
                description: `Order for ${description}`,

                automatic_payment_methods: {
                    enabled: true,
                },
                shipping: {
                    name: req?.user.name,
                    address: {
                        line1: "Line 1",
                        postal_code: "752002",
                        city: "Puri",
                        state: "Odisha",
                        country: 'IN',
                    },
                },
            });

            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

// Route to handle order creation after payment success
export const confirmOrder = catchAsyncError(
    async (req: any, res: Response, next: NextFunction) => {
        const { items, total } = req.body as ICreateOrderRequest;

        if (!items || !total) {
            return next(new ErrorHandler("Missing required data", 400));
        }

        try {
            // Create order in the database
            const order = await OrderModel.create({
                orderItems: items,
                user: req.user._id,
                total,
            });

            res.status(201).json({
                message: "Order created successfully",
                order,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
);

export const getUserOrders = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const orders = await OrderModel.find({
            user: req.user._id
        });

        res.status(200).json({
            orders
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

export const getSingleOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (!id) throw new Error("Please provide an Order ID")
        const order = await OrderModel.findById(id);

        if (!order) throw new Error("Order not found");

        res.status(200).json({
            order
        })
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});