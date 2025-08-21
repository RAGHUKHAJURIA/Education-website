import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser, useSession } from '@clerk/clerk-react'

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setenrolledCourses] = useState([])

    const { getToken } = useAuth()
    const { user } = useUser()


    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }

    const navigate = useNavigate();

    // claculate the course rating
    const calculateRating = (course) => {
        if (course.courseRatings.lenght === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        })

        return totalRating / course.courseRatings.lenght;
    }

    const caluclateChapterTime = (chapter) => {
        let time = 0;
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map(chapter => chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    const calculateNoOfLectures = (course) => {
        let totalLecture = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLecture += chapter.chapterContent.length
            }
        });
        return totalLecture;
    }

    // fetch user enrolled courses
    const fetchUsedEnrolledCourses = async () => {
        setenrolledCourses(dummyCourses)
    }



    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateCourseDuration, calculateNoOfLectures, caluclateChapterTime, enrolledCourses, fetchUsedEnrolledCourses
    }





    useEffect(() => {
        fetchAllCourses();
        fetchUsedEnrolledCourses()
    }, [])

    const { session } = useSession()

    const logToken = async () => {

        console.log(await getToken());
        console.log(session);
    }

    useEffect(() => {
        if (user) {
            logToken();
        }
    }, [user])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}