import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const CourseCard = ({ course }) => {

  const { currency, calculateRating } = useContext(AppContext)


  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className="block bg-white border-2 border-gray-200 pb-6 overflow-hidden rounded-2xl transition-all duration-700 hover:shadow-2xl hover:shadow-blue-300/40 hover:border-blue-500 hover:-translate-y-3 group animate-scale-in-bounce hover-lift hover-glow"
    >
      <div className="overflow-hidden relative">
        <img
          className="w-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
          src={course.courseThumbnail}
          alt="thumbnail"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
          View Course
        </div>
      </div>
      <div className="p-4 text-left">
        <h3 className="text-lg font-bold transition-all duration-300 group-hover:text-blue-600 group-hover:scale-105 mb-2">{course.courseTitle}</h3>
        <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800 mb-3 font-medium">{course.educator?.name || 'Unknown Educator'}</p>
        <div className="flex items-center mb-3">
          <p className="transition-colors duration-300 group-hover:text-yellow-500 font-semibold mr-1">4.5</p>
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={assets.star}
                alt=""
                className="h-4 w-4 transition-all duration-300 hover:scale-125 hover:rotate-12 group-hover:animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <p className="text-gray-500 transition-colors duration-300 group-hover:text-gray-700 text-sm">(22 reviews)</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-105">
            {currency}{((course.coursePrice || 0) - (course.discount || 0) * (course.coursePrice || 0) / 100).toFixed(2)}
          </p>
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
            Enroll Now
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
