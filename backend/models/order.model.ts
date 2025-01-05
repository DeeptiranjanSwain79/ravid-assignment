import mongoose, { Document, Model, Schema } from "mongoose";

interface IOrder extends Document {
    orderItems: [
        {
            name: string;
            quantity: number;
            price: number;
            image: string;
            product: string | any;
        }
    ];
    user: Schema.Types.ObjectId;
    total: number;
}

const orderSchema = new Schema<IOrder>({
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default OrderModel;
