import { createContext, use, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser, useSession } from '@clerk/clerk-react'
import { toast } from 'react-toastify'
import axios from 'axios';


export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const currency = import.meta.env.VITE_CURRENCY;
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setenrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    const { getToken } = useAuth()
    const { user } = useUser()
    const navigate = useNavigate();


    const fetchAllCourses = async () => {
        try {
            const res = await axios.get(backendUrl + '/api/course/all');
            const data = res.data; // ✅ extract actual data

            if (data.success) {
                setAllCourses(data.courses);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    //fetch userData
    const fetchUserData = async () => {

        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true)
        }

        try {
            const token = await getToken()

            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


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
        try {
            const token = getToken()
            const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(data);

            if (data.success) {
                setenrolledCourses(data.enrolledCourses);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    useEffect(() => {
        fetchAllCourses();

    }, [])

    const { session } = useSession()

    const logToken = async () => {

        console.log(await getToken());
        console.log(session);
    }

    useEffect(() => {
        if (user) {
            console.log(getToken())
            logToken();
            fetchUserData()
            fetchUsedEnrolledCourses()
        }
    }, [user])

    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, calculateCourseDuration, calculateNoOfLectures, caluclateChapterTime, enrolledCourses, fetchUsedEnrolledCourses, backendUrl, userData, setUserData, getToken, fetchAllCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}