import mongoose, { Document, Model, Schema } from "mongoose";

interface IProduct extends Document {
    image: string;
    name: string;
    price: number;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

const ProductModel: Model<IProduct> = mongoose.model("Product", productSchema);

export default ProductModel;
