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
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        {/* Top cards */}
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-card- border border-blue-400 p-4 w-56 rounded-md">
            <img src={assets.patients_icon} alt="" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.enrolledStudents.length}
              </p>
              <p className="text-base text-gray-500">Total Enrolments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card- border border-blue-400 p-4 w-56 rounded-md">
            <img src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shadow-card- border border-blue-400 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {currency}
                {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Latest Enrolments Table */}
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrolments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
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
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">{index + 1}</td>
                    <td className="px-4 py-3 border-b flex items-center gap-2">
                      <img
                        src={enrol.student.imageUrl}
                        alt={enrol.student.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {enrol.student.name}
                    </td>
                    <td className="px-4 py-3 border-b">{enrol.courseTitle}</td>
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
