import React, { useContext, useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const DashBoard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency, isEducator, getToken, backendUrl } = useContext(AppContext);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard-data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }

  }, [isEducator]);

  return dashboardData ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0 animate-fade-in-up">
      <div className="space-y-5">
        {/* Top cards */}
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card- border border-blue-400 p-4 w-56 rounded-lg transition-all duration-500 hover:shadow-2xl hover:scale-110 hover:border-blue-500 hover-lift hover-glow animate-scale-in-bounce" style={{ animationDelay: '0.1s' }}>
            <img src={assets.patients_icon} alt="" className="transition-all duration-500 hover:scale-125 hover:rotate-12 animate-float-slow" />
            <div>
              <p className="text-2xl font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:scale-105 animate-pulse-glow">
                {dashboardData.enrolledStudents.length}
              </p>
              <p className="text-base text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-105">Total Enrolments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card- border border-blue-400 p-4 w-56 rounded-lg transition-all duration-500 hover:shadow-2xl hover:scale-110 hover:border-blue-500 hover-lift hover-glow animate-scale-in-bounce" style={{ animationDelay: '0.2s' }}>
            <img src={assets.appointments_icon} alt="" className="transition-all duration-500 hover:scale-125 hover:rotate-12 animate-float-slow" />
            <div>
              <p className="text-2xl font-medium text-gray-600 transition-all duration-300 hover:text-blue-600 hover:scale-105 animate-pulse-glow">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-105">Total Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card- border border-blue-400 p-4 w-56 rounded-lg transition-all duration-500 hover:shadow-2xl hover:scale-110 hover:border-blue-500 hover-lift hover-glow animate-scale-in-bounce" style={{ animationDelay: '0.3s' }}>
            <img src={assets.earning_icon} alt="" className="transition-all duration-500 hover:scale-125 hover:rotate-12 animate-float-slow" />
            <div>
              <p className="text-2xl font-medium text-gray-600 transition-all duration-300 hover:text-green-600 hover:scale-105 animate-pulse-glow">
                {currency}
                {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-500 transition-all duration-300 hover:text-gray-700 hover:scale-105">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrolments Table */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="pb-4 text-lg font-medium transition-colors duration-300 hover:text-blue-600">Latest Enrolments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 transition-all duration-300 hover:shadow-lg">
            <table className="w-full text-left text-gray-600">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border-b">#</th>
                  <th className="px-4 py-3 border-b">Student name</th>
                  <th className="px-4 py-3 border-b">Course Title</th>

                </tr>
              </thead>
              <tbody>
                {dashboardData.enrolledStudents.map((enrol, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-all duration-300 animate-scale-in" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                    <td className="px-4 py-3 border-b transition-colors duration-300 hover:text-blue-600">{index + 1}</td>
                    <td className="px-4 py-3 border-b flex items-center gap-2">
                      <img
                        src={enrol.student.imageUrl}
                        alt={enrol.student.name}
                        className="w-8 h-8 rounded-full transition-transform duration-300 hover:scale-110"
                      />
                      <span className="transition-colors duration-300 hover:text-blue-600">{enrol.student.name}</span>
                    </td>
                    <td className="px-4 py-3 border-b transition-colors duration-300 hover:text-blue-600">{enrol.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default DashBoard;
