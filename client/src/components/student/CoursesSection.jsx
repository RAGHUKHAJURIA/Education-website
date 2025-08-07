import React from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">
        Learn From the Best
      </h2>
      <p className="text-sm md:text-base text-gray-500 mt-3">
        An online learning platform offering high-quality courses across various
        subjects. Learn at your own pace and gain skills to boost your career or
        education.
      </p>

      <CourseCard />

      <Link
        to={"/course-list"}
        onClick={() => scrollTo(0, 0)}
        className="text-gray-500 border border-gray-500/20 px-10 py-3 rounded "
      >
        Show All Courses
      </Link>
    </div>
  );
};

export default CoursesSection;
