
import { v2 as cloudinary } from 'cloudinary';
import { clerkClient } from '@clerk/express'
import Course from '../models/course.js';
import Purchase from '../models/purchase.js';
import User from '../models/user.js';

export const updateRoleToEducator = async (req, res) => {
    try {
        // Get userId from auth context - note it's a property, not a function
        const { userId } = req.auth;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator"
            }
        });

        res.json({ success: true, message: "User role updated to educator." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Add new Course

// export const addCourse = async (req, res) => {
//     try {
//         const { courseData } = req.body;
//         const imageFile = req.file
//         const { userId } = req.auth;

//         if (!imageFile) {
//             return res.json({ success: false, message: "Thumbnail not attached" });
//         }

//         const parsedCourseData = await JSON.parse(courseData);
//         parsedCourseData.educator = userId;
//         const newCourse = await Course.create(parsedCourseData)
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path)
//         newCourse.courseThumbnail = imageUpload.secure_url;
//         await newCourse.save();

//         res.json({ success: true, message: "Course added successfully." });

//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }


export const addCourse = async (req, res) => {
    try {
        console.log("REQ BODY:", req.body);
        console.log("REQ FILE:", req.file);

        const { courseData } = req.body;
        const imageFile = req.file;
        const { userId } = req.auth;

        if (!imageFile) {
            return res.json({ success: false, message: "Thumbnail not attached" });
        }

        // Upload image

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        console.log("Image uploaded:", imageUpload.secure_url);

        // Parse course data
        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = userId;
        parsedCourseData.courseThumbnail = imageUpload.secure_url;

        // Save to DB

        const newCourse = await Course.create(parsedCourseData);

        res.json({ success: true, message: "Course added successfully.", course: newCourse });

    } catch (error) {
        console.error("Error in addCourse:", error);
        res.json({ success: false, message: error.message });
    }
};


// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = req.auth;

        const courses = await Course.find({ educator: userId });
        res.json({ success: true, courses: courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// get educator dashboard data 

export const educatorDashboardData = async (req, res) => {
    try {
        const { userId } = req.auth;
        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;

        const coursesId = courses.map(course => course._id);

        // calculate total earnign 
        const purchase = await Purchase.find({
            coursesId: { $in: coursesId },
            status: 'completed'
        })

        const totalEarnings = purchase.reduce((sum, purchase) => sum + purchase.amount, 0);

        const enrolledStudents = [];
        for (const course of courses) {
            const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');
            students.forEach(student => {
                enrolledStudents.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalCourses,
                totalEarnings,
                enrolledStudents
            }
        });

    } catch (error) {

        res.json({ success: false, message: error.message });
    }
}

//get Enrolled student data 
export const getEnrolledStudents = async (req, res) => {
    try {
        const { userId } = req.auth;
        const courses = await Course.find({ educator: userId });
        const coursesId = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: coursesId },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt,
        }));

        res.json({ success: true, enrolledStudents });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
