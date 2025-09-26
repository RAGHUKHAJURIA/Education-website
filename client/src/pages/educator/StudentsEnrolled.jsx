import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudent] = useState(null);

  const fetchEnrolledStudent = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/enrolled-student', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        setEnrolledStudent(data.enrolledStudents.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudent()
    }

  }, [isEducator])

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 animate-fade-in-up">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 transition-all duration-300 hover:shadow-lg">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className="border-b border-gray-500/20 transition-all duration-300 hover:bg-gray-50 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <td className="px-4 py-3 text-center hidden sm:table-cell transition-colors duration-300 hover:text-blue-600">{index + 1}</td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={item.student.imageUrl}
                    alt={item.student.name}
                    className="w-9 h-9 rounded-full transition-transform duration-300 hover:scale-110"
                  />
                  <span className="truncate transition-colors duration-300 hover:text-blue-600">{item.student.name}</span>
                </td>
                <td className="px-4 py-3 truncate transition-colors duration-300 hover:text-blue-600">{item.courseTitle}</td>
                <td className="px-4 py-3 hidden sm:table-cell transition-colors duration-300 hover:text-gray-700">
                  {new Date(item.purchaseDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default StudentsEnrolled
