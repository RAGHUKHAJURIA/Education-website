import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyCourses = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      data.success && setCourses(data.courses)
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }

  }, [isEducator]);

  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full animate-fade-in-up">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 transition-all duration-300 hover:shadow-lg">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {courses.map((course, index) => (
                <tr
                  key={course._id}
                  className="border-b border-gray-500/20 transition-all duration-300 hover:bg-gray-50 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Course thumbnail & title */}
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img
                      src={course.courseThumbnail}
                      alt="Course Image"
                      className="w-16 rounded-md transition-transform duration-300 hover:scale-105"
                    />
                    <span className="truncate hidden md:block transition-colors duration-300 hover:text-blue-600">
                      {course.courseTitle}
                    </span>
                  </td>

                  {/* Earnings */}
                  <td className="px-4 py-3 transition-colors duration-300 hover:text-green-600">
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                      (course.coursePrice -
                        (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  {/* Students */}
                  <td className="px-4 py-3 transition-colors duration-300 hover:text-blue-600">
                    {course.enrolledStudents.length}
                  </td>

                  {/* Published On */}
                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MyCourses;
