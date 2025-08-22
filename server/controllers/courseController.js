import Course from "../models/course.js";

// get all Courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).select(['-enrolledStudents']).populate({ path: 'educator' })

        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//get course by id
export const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        if (Array.isArray(courseData.courseContent)) {
            courseData.courseContent.forEach(chapter => {
                if (Array.isArray(chapter.chapterContent)) {
                    chapter.chapterContent.forEach(lecture => {
                        if (!lecture.isPreviewFree) {
                            lecture.lectureUrl = "";
                        }
                    });
                }
            });
        }

        res.json({ success: true, courseData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}