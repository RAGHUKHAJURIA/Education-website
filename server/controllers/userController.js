import { populate } from "dotenv";
import User from "../models/user.js";
import Course from "../models/course.js";
import Purchase from "../models/purchase.js";
import Stripe from "stripe";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth;
        console.log("User ID:", userId);
        const user = await User.findById(userId);
        console.log("User Data:", user);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// user enrolled courses

export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth;
        const userData = await User.findById(userId).populate('enrolledCourses');

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//PAYMENT CONTROLLER

export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const { userId } = req.auth;
        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: "User or Course not found" });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
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