import mongoose from "mongoose";

// connected to mongodb database

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DataBase Connected');
    })

    await mongoose.connect(`${process.env.MONGODB_URL}/lms`)
}

export default connectDB