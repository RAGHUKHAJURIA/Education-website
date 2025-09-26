import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar';
import { useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer'

const CoursesList = () => {

  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      input ? setFilteredCourse(
        tempCourses.filter(
          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      ) : setFilteredCourse(tempCourses)
    }
  }, [allCourses, input])

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left animate-fade-in-up'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <h1 className='text-4xl font-semibold text-gray-800 transition-colors duration-300 hover:text-blue-600'>Course List</h1>
            <p className='text-gray-500'>
              <span className='text-blue-600 cursor-pointer transition-colors duration-300 hover:text-blue-700' onClick={() => navigate('/')}>Home</span> / <span>CourseList</span>
            </p>
          </div>
          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <SearchBar data={input} />
          </div>
        </div>
        {
          input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-600 transition-all duration-300 hover:shadow-md animate-scale-in' style={{ animationDelay: '0.3s' }}>
            <p className="transition-colors duration-300 hover:text-blue-600">{input}</p>
            <img src={assets.cross_icon} alt="cross icon" className='cursor-pointer transition-transform duration-300 hover:scale-110' onClick={() => navigate('/course-list')} />
          </div>
        }

        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0'>
          {filteredCourse.map((course, index) => (
            <div key={index} className="animate-scale-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CoursesList