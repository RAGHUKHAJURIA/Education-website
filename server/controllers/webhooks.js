import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";

// export const clerkWebhooks = async (req, res) => {
//   console.log("Webhook received:", req.body);

//   try {
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     await whook.verify(JSON.stringify(req.body), {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     });



//     const { data, type } = req.body;

//     switch (type) {
//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//           imageUrl: data.image_url,
//         };

//         await User.create(userData);
//         res.json({ success: true });
//         break;
//       }


//       case "user.updated": {
//         const userData = {
//           email: data.email_addresses[0].email_address,
//           name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//           imageUrl: data.image_url,
//         };
//         await User.findByIdAndUpdate(data.id, userData);
//         res.json({ success: true });
//         break;
//       }

//       case "user.deleted": {
//         await User.findByIdAndDelete(data.id);
//         res.json({})
//         break;
//       }

//       default:
//         break;
//     }
//   } catch (error) {

//     res.json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



export const clerkWebhooks = async (req, res) => {
  console.log("📩 Clerk Webhook received:", req.body);
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString("utf8"); // raw body as string
    const evt = whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("✅ Clerk webhook event:", evt.type);

    const { data, type } = evt;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };

        await User.create(userData);
        console.log("👤 User created:", userData);
        return res.json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        console.log("👤 User updated:", data.id);
        return res.json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        return res.json({ success: true });
      }

      default:
        console.log("ℹ️ Unhandled webhook event:", type);
        return res.json({ success: true });
    }
  } catch (error) {
    console.error("❌ Clerk webhook error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};


// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const stripeWebhooks = async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_KEY);
//   } catch (err) {
//     console.error(`Webhook Error: ${err.message}`);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case 'payment_intent.succeeded': {

//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId
//       })

//       const { purchaseId } = session.data[0].metadata;

//       const purchaseData = await Purchase.findById(purchaseId);

//       const userData = await User.findById(purchaseData.userId);
//       const courseData = await Course.findById(purchaseData.courseId.toString());

//       courseData.enrolledStudents.push(userData._id);
//       await courseData.save();

//       userData.enrolledCourses.push(courseData._id);
//       await userData.save();

//       purchaseData.status = 'completed';
//       await purchaseData.save();
//       break;
//     }
//     case 'payment_method.payment_failed': {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;

//       const session = await stripeInstance.checkout.sessions.list({
//         payment_intent: paymentIntentId
//       })

//       const { purchaseId } = session.data[0].metadata;
//       const purchaseData = await Purchase.findById(purchaseId);
//       purchaseData.status = 'failed';
//       await purchaseData.save();
//     }
//     default:
//       console.warn(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// }

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    );
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
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());

      // Enroll user in course
      courseData.enrolledStudents.push(userData._id);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      // Mark purchase completed
      purchaseData.status = 'completed';
      await purchaseData.save();

      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = 'failed';
      await purchaseData.save();

      break;
    }

    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

