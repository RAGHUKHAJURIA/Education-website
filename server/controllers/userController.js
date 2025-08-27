import { populate } from "dotenv";
import User from "../models/user.js";
import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import Stripe from "stripe";
import CourseProgress from "../models/courseProgress.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth;
        // console.log("User ID:", userId);
        const user = await User.findById(userId);
        // console.log("User Data:", 
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user: user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// user enrolled courses

export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth;
        // console.log(req)
        // console.log(userId)
        const userData = await User.findById(userId).populate("enrolledCourses");
        // console.log(userData.enrolledCourses)

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}




//PAYMENT CONTROLLER

export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        // console.log("course id: ", courseId)
        const { origin } = req.headers;
        const { userId } = req.auth;
        // console.log("userId: ", userId)
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: "User or Course not found" });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
            status: 'pending'
        }

        const newPurchase = await Purchase.create(purchaseData);

        // stripe gateway initilize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase();

        //creating line items for stripe
        const lineItems = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle,

                    },
                    unit_amount: Math.floor(newPurchase.amount) * 100, // amount in cents
                },
                quantity: 1,
            },
        ];

        const session = await stripeInstance.checkout.sessions.create({
            mode: 'payment',
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// update user Controller function for the progress


export const updateCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { courseId, lectureId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Lecture already marked as completed" });
            }

            progressData.lectureCompleted.push(lectureId);
            await progressData.save();

        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({ success: true, message: "Course progress updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//get user Course Progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth;
        // const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId });

        res.json({ success: true, progressData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// add userRating to Course
export const addUserRating = async (req, res) => {
    const { userId } = req.auth;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Invalid data provided" })
    }

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }

        const user = await User.findById(userId);
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: "User not purchased this course" });
        }

        const existingRatingIndex = course.courseRating.findIndex(r => r.userId == userId);

        if (existingRatingIndex > -1) {
            course.courseRating[existingRatingIndex].rating = rating;
        } else {
            course.courseRating.push({ userId, rating });
        }

        await course.save();

        res.json({ success: true, message: "Rating added successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}