import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';

const CourseDetails = () => {

  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const { allCourses, calculateCourseDuration, calculateNoOfLectures, caluclateChapterTime } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id)
    setCourseData(findCourse)
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses, id])

  return courseData ? (
    <>
      <div className='relative min-h-screen flex md:flex-row flex-col-reverse gap-10 items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>

        {/* Full-page gradient background */}
        <div className='absolute inset-0 -z-10 bg-gradient-to-b from-cyan-100 via-white to-gray-200'></div>

        {/* left column */}
        <div className='max-w-x- z-10 text-gray-500'>
          <h1 className='md:text-[36px] text-[26px] font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          {courseData?.courseDescription && (
            <p className='pt-4 md:text-base text-sm max-w-[500px] break-words'
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription.replace(/(?:\r\n|\r|\n)/g, "<br />").slice(0, 200)
              }}
            ></p>
          )}

          <div className="flex items-center pt-3 pb-1 text-sm">
            <p>4.5</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (<img key={i} src={assets.star} alt="" className='h-3.5 w-3.5' />))}
            </div>
            <p className="text-blue-500 pl-1">(22 ratings)</p>
            <p className='p-3'> {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>

            <p className='text-sm'>Course By <span className='text-blue-600 underline'>Krish</span></p>

          </div>
          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-blue-50 mb-2 rounded'>
                  <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'>
                    <div className='flex items-center gap-2'>
                      <img src={assets.down_arrow_icon} alt="down arrow" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {caluclateChapterTime(chapter)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right column */}
        <div></div>
      </div>
    </>
  ) : <Loading />
}

export default CourseDetails
