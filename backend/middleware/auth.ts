import jwt, { JwtPayload } from 'jsonwebtoken';
import { catchAsyncError } from './catchAsyncError';
import { NextFunction } from 'express';
import UserModel from '../models/user.model';
import { JWT_SECRET } from '../controllers/user.controller';

//check if user is authenticated or not
export const isAuthenticated = catchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['token'];
    if (token === null || token === "null") throw new Error(`No token`);

    if (!token) {
        throw new Error('Unauthorized No Token');
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    if (!decoded) throw new Error('Invalid access token');

    const user = await UserModel.findById(decoded.id);
    if (!user) throw new Error('Please login to access this resource');

    req.user = user;

    next();
})