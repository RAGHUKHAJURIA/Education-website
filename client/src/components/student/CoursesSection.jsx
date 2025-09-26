import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { AppContext } from "../../context/AppContext";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)
  return (
    <div className="py-16 md:px-40 px-8 bg-transparent">
      <div className="animate-fade-in-up">
        <h2 className="text-3xl font-medium text-gray-800">
          Learn From the Best
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-3">
          An online learning platform offering high-quality courses across various
          subjects. <br /> Learn at your own pace and gain skills to boost your career or
          education.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-6">
        {allCourses.slice(0, 4).map((course, index) => (
          <div
            key={index}
            className="animate-scale-in-bounce"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>
      <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <Link
          to={"/course-list"}
          onClick={() => scrollTo(0, 0)}
          className="inline-block text-gray-500 border-2 border-gray-300 px-10 py-3 rounded-xl transition-all duration-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:scale-105"
        >
          Show All Courses
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;
