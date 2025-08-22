import express from 'express';
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudents, updateRoleToEducator } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducatorRoute } from '../middlewares/authmiddleware.js';

const educatorRouter = express.Router();

// add educator role
educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image'), protectEducatorRoute, addCourse);
educatorRouter.get('/courses', protectEducatorRoute, getEducatorCourses)
educatorRouter.get('/dashboard-data', protectEducatorRoute, educatorDashboardData)
educatorRouter.get('/enrolled-student', protectEducatorRoute, getEnrolledStudents)



export default educatorRouter;  