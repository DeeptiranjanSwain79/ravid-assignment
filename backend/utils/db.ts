import mongoose from "mongoose";

const dbUri: string = "mongodb+srv://admin:admin@temp.yc3yo.mongodb.net/?retryWrites=true&w=majority&appName=temp";

const connectDB = async () => {
    try {
        await mongoose.connect(dbUri).then((data: any) => {
            console.log(`Mongodb connected to ${data?.connection?.host}`);
        })
    } catch (error: any) {
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;