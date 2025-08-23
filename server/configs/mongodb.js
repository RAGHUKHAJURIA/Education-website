// import mongoose from "mongoose";

// // connected to mongodb database

// const connectDB = async () => {
//     mongoose.connection.on('connected', () => {
//         console.log('DataBase Connected');
//     })

//     await mongoose.connect(`${process.env.MONGODB_URL}/lms`)
// }

// export default connectDB

import mongoose from "mongoose";

// connect to mongodb database
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB Connected:", mongoose.connection.name);
  });

  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: "lms", // 👈 this is the actual database name
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
