import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);


        const payload = req.body.toString("utf8");



        await whook.verify(payload, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });



        const { data, type } = JSON.parse(payload);

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.profile_image_url,
                };
                await User.create(userData);
                return res.json({ success: true });
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.profile_image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                return res.json({ success: true });
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                return res.json({ success: true });
            }

            default:
                return res.json({ message: "Event ignored" });
        }
    } catch (error) {
        console.error("Webhook error:", error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_KEY);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'payment_intent.succeeded': {

            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const { purchaseId } = session.data[0].metadata;

            const purchaseData = await Purchase.findById(purchaseId);

            const userData = await User.findById(purchaseData.userId);
            const courseData = await Course.findById(purchaseData.courseId.toString());

            courseData.enrolledStudents.push(userData._id);
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            purchaseData.status = 'completed';
            await purchaseData.save();
            break;
        }
        case 'payment_method.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })

            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await Purchase.findById(purchaseId);
            purchaseData.status = 'failed';
            await purchaseData.save();
        }
        default:
            console.warn(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}
