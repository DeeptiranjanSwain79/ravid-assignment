import express, { Request, Response } from 'express';
import connectDB from './utils/db';
import { ErrorMiddleWare } from './middleware/error';
import ProductModel from './models/product.model';
import orderRouter from './routes/order.routes';
import userRouter from './routes/user.routes';

const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
    res.status(200).send('API is working fine');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);

const PORT = 5000;

app.use(ErrorMiddleWare);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});