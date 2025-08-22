import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true,
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],

    }, { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User;


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//     {
//         // Clerk's user id (e.g. "user_31XzNeFqcMT88g7FrYaVGPvFqw1")
//         clerkId: {
//             type: String,
//             required: true,
//             unique: true, // one-to-one mapping with Clerk
//         },

//         // Basic profile info
//         name: {
//             type: String,
//             required: true,
//         },
//         imageUrl: {
//             type: String,
//             required: true,
//         },

//         // Courses this user has enrolled in
//         enrolledCourses: [
//             {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Course", // references Course model
//             },
//         ],
//     },
//     { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);

// export default User;
