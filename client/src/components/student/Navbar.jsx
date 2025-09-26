import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { navigate, isEducator, setIsEducator, getToken, backendUrl } = useContext(AppContext);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator')
      }

      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 transition-all duration-500 animate-fade-in-down ${isCourseListPage ? "bg-white" : "bg-gradient-to-r from-cyan-100/70 to-blue-100/50"
        }`}
    >
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-3 hover-glow animate-float-slow"
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button
                onClick={becomeEducator}
                className="transition-all duration-300 hover:text-blue-600 hover:scale-105 hover:animate-pulse-subtle"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button> |{" "}
              <Link
                to="/my-enrollments"
                className="transition-all duration-300 hover:text-blue-600 hover:scale-105 hover:animate-pulse-subtle"
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>
        {user ? (
          <div className="transition-all duration-300 hover:scale-110">
            <UserButton />
          </div>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-full cursor-pointer transition-all duration-500 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-110 hover:animate-pulse-glow"
          >
            create Account
          </button>
        )}
      </div>
      {/* for phone screens */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-2 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button
                onClick={becomeEducator}
                className="transition-all duration-300 hover:text-blue-600 hover:scale-105"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button> |{" "}
              <Link
                to="/my-enrollments"
                className="transition-all duration-300 hover:text-blue-600 hover:scale-105"
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>
        {user ? (
          <div className="transition-all duration-300 hover:scale-110">
            <UserButton />
          </div>
        ) : (
          <button className="transition-all duration-300 hover:scale-125 hover:rotate-12">
            <img src={assets.user_icon} alt="" className="hover:animate-bounce" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
