import { Webhook } from "svix";
import User from "../models/user.js";
import Stripe from "stripe";
import Purchase from "../models/purchase.js";
import Course from "../models/course.js";

// export const clerkWebhooks = async (req, res) => {
//     try {
//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//         await whook.verify(JSON.stringify(req.body), {
//             "svix-id": req.headers["svix-id"],
//             "svix-timestamp": req.headers["svix-timestamp"],
//             "svix-signature": req.headers["svix-signature"],
//         });



//         const { data, type } = req.body;

//         switch (type) {
//             case "user.created": {
//                 const userData = {
//                     _id: data.id,
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     imageUrl: data.imageUrl,
//                 };

//                 await User.create(userData);
//                 res.json({})
//                 break
//             }

//             case "user.updated": {
//                 const userData = {
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     imageUrl: data.imageUrl,
//                 };
//                 await User.findByIdAndUpdate(data.id, userData);
//                 res.json({})
//                 break;
//             }

//             case "user.deleted": {
//                 await User.findByIdAndDelete(data.id);
//                 res.json({})
//                 break;
//             }

//             default:
//                 break;
//         }
//     } catch (error) {

//         res.json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

export const clerkWebhooks = async (req, res) => {
  console.log('=== WEBHOOK DEBUG START ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    // Step 1: Check if webhook endpoint is being hit
    console.log('✅ Webhook endpoint hit');
    console.log('Method:', req.method);
    console.log('URL:', req.url);

    // Step 2: Check environment variables
    console.log('\n--- Environment Variables ---');
    console.log('CLERK_WEBHOOK_SECRET exists:', !!process.env.CLERK_WEBHOOK_SECRET);
    console.log('CLERK_WEBHOOK_SECRET length:', process.env.CLERK_WEBHOOK_SECRET?.length);
    console.log('MONGODB_URL exists:', !!process.env.MONGODB_URL);

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      throw new Error('CLERK_WEBHOOK_SECRET is not set');
    }

    // Step 3: Check headers
    console.log('\n--- Headers ---');
    console.log('svix-id:', req.headers['svix-id']);
    console.log('svix-timestamp:', req.headers['svix-timestamp']);
    console.log('svix-signature exists:', !!req.headers['svix-signature']);
    console.log('content-type:', req.headers['content-type']);

    // Step 4: Check request body
    console.log('\n--- Request Body ---');
    console.log('Body type:', typeof req.body);
    console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
    console.log('Full body:', JSON.stringify(req.body, null, 2));

    // Step 5: Webhook verification
    console.log('\n--- Webhook Verification ---');
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Try different verification methods
    let verificationSuccessful = false;
    const bodyString = JSON.stringify(req.body);

    try {
      await whook.verify(bodyString, {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
      console.log('✅ Webhook verification successful');
      verificationSuccessful = true;
    } catch (verifyError) {
      console.error('❌ Webhook verification failed:', verifyError.message);

      // Try with raw body if available
      if (req.rawBody) {
        try {
          await whook.verify(req.rawBody, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
          });
          console.log('✅ Webhook verification successful with raw body');
          verificationSuccessful = true;
        } catch (rawVerifyError) {
          console.error('❌ Raw body verification also failed:', rawVerifyError.message);
        }
      }

      if (!verificationSuccessful) {
        return res.status(400).json({
          success: false,
          message: 'Webhook verification failed',
          error: verifyError.message
        });
      }
    }

    // Step 6: Process webhook data
    const { data, type } = req.body;
    console.log('\n--- Webhook Processing ---');
    console.log('Event type:', type);
    console.log('Data exists:', !!data);
    console.log('Data keys:', data ? Object.keys(data) : 'No data');

    // Step 7: Database connection check
    console.log('\n--- Database Check ---');
    console.log('Mongoose connection state:', require('mongoose').connection.readyState);
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    switch (type) {
      case "user.created": {
        console.log('\n--- User Creation ---');
        console.log('User ID:', data.id);
        console.log('Email addresses:', data.email_addresses);
        console.log('First name:', data.first_name);
        console.log('Last name:', data.last_name);
        console.log('Image URL field check:', {
          image_url: data.image_url,
          profile_image_url: data.profile_image_url,
          imageUrl: data.imageUrl
        });

        // Build user data with more defensive checks
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address || '',
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Unknown',
          imageUrl: data.image_url || data.profile_image_url || data.imageUrl || '',
        };

        console.log('Constructed user data:', userData);

        // Check if user already exists
        const existingUser = await User.findById(data.id);
        if (existingUser) {
          console.log('User already exists:', existingUser);
          return res.status(200).json({
            success: true,
            message: 'User already exists',
            user: existingUser
          });
        }

        // Create new user
        console.log('Attempting to create user...');
        const newUser = await User.create(userData);
        console.log('✅ User created successfully:', newUser);

        res.status(200).json({ success: true, user: newUser });
        break;
      }

      case "user.updated": {
        console.log('\n--- User Update ---');
        const userData = {
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          imageUrl: data.image_url || data.profile_image_url || data.imageUrl || '',
        };

        console.log('Update data:', userData);
        const updatedUser = await User.findByIdAndUpdate(
          data.id,
          userData,
          { new: true }
        );
        console.log('✅ User updated:', updatedUser);

        res.status(200).json({ success: true, user: updatedUser });
        break;
      }

      case "user.deleted": {
        console.log('\n--- User Deletion ---');
        const deletedUser = await User.findByIdAndDelete(data.id);
        console.log('✅ User deleted:', deletedUser);

        res.status(200).json({ success: true });
        break;
      }

      default:
        console.log('Unhandled webhook type:', type);
        res.status(200).json({
          success: true,
          message: `Unhandled webhook type: ${type}`
        });
        break;
    }

  } catch (error) {
    console.error('\n=== ERROR DETAILS ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);

    // Specific error handling
    if (error.name === 'ValidationError') {
      console.error('Mongoose validation error:', error.errors);
    }

    if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyValue);
    }

    res.status(400).json({
      success: false,
      message: error.message,
      errorType: error.name,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        fullError: error
      })
    });
  }

  console.log('=== WEBHOOK DEBUG END ===\n');
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
