import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import UserModel from "../models/user.model";
import OrderModel from '../models/order.model';
import ProductModel from '../models/product.model';

export const JWT_SECRET = `koeUNh,gIP;OQz:8A}c%(L0Mkkn"Hs[mut8jV&|W}r,-3.9Jn]`;

export const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) throw new Error("Please fill all the required fields");

        const userExists = await UserModel.findOne({
            email: email,
        });

        if (userExists) throw new Error("Email ID already exists in our database, Please try again with a different email");

        const user = await UserModel.create({
            name,
            email,
            password
        });

        const token = jwt.sign(
            {
                id: user._id
            },
            JWT_SECRET,
            {
                expiresIn: '150d',
            },
        );

        res.status(201).json({
            message: "User registered successfully",
            user,
            token
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

//Login user
interface ILoginRequest {
    email: string;
    password: string;
}

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as ILoginRequest;

        if (!email || !password) return next(new ErrorHandler('Please enter email and password', 400));

        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) return next(new ErrorHandler('Invalid credentials', 400));

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) return next(new ErrorHandler('Invalid Password', 400));

        const token = jwt.sign(
            {
                id: user._id
            },
            JWT_SECRET,
            {
                expiresIn: '150d',
            },
        );

        res.status(200).json({
            message: "User logged in successfully",
            user,
            token
        });
    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
});

export const getUserDetails = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const orders = await OrderModel.find({
            user: req.user._id
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: req.user,
            orders
        });
    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
});

export const getAllProducts = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const products = await ProductModel.find()

        res.status(200).json({
            products
        });
    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
});

export const updateUser = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, { name })

        res.status(200).json({
            message: "User updated successfully",
            updatedUser
        });
    } catch (error: any) {
        console.log(error)
        return next(new ErrorHandler(error.message, 400))
    }
});