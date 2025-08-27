import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [isPublished, setIsPublished] = useState(true);

  // Chapters & Lecture Details
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [chapterId, setChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addChapter = () => {
    const newChapter = {
      chapterId: generateId(),
      chapterOrder: chapters.length + 1,
      chapterTitle: `Chapter ${chapters.length + 1}`,
      chapterContent: []
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapterTitle = (chapterId, newTitle) => {
    setChapters(chapters.map(chapter =>
      chapter.chapterId === chapterId
        ? { ...chapter, chapterTitle: newTitle }
        : chapter
    ));
  };

  const deleteChapter = (chapterId) => {
    setChapters(chapters.filter(chapter => chapter.chapterId !== chapterId));
  };

  const openLecturePopup = (chapterId) => {
    setChapterId(chapterId);
    setShowPopup(true);
  };

  const addLecture = () => {
    const newLecture = {
      lectureId: generateId(),
      lectureTitle: lectureDetails.lectureTitle,
      lectureDuration: Number(lectureDetails.lectureDuration),
      lectureUrl: lectureDetails.lectureUrl,
      isPreviewFree: lectureDetails.isPreviewFree,
      lectureOrder: 0 // Will be updated based on chapter's current lectures
    };

    setChapters(chapters.map(chapter => {
      if (chapter.chapterId === chapterId) {
        const updatedLecture = {
          ...newLecture,
          lectureOrder: chapter.chapterContent.length + 1
        };
        return {
          ...chapter,
          chapterContent: [...chapter.chapterContent, updatedLecture]
        };
      }
      return chapter;
    }));

    // Reset form
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
    setShowPopup(false);
  };

  const deleteLecture = (chapterId, lectureId) => {
    setChapters(chapters.map(chapter => {
      if (chapter.chapterId === chapterId) {
        return {
          ...chapter,
          chapterContent: chapter.chapterContent.filter(lecture => lecture.lectureId !== lectureId)
        };
      }
      return chapter;
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!image) {
        toast.error("Please upload a course thumbnail");
        return;
      }

      const courseData = {
        courseTitle,
        courseDescription, // ✅ now from textarea state
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCourseDescription('') // ✅ reset textarea
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Course</h2>

      <div className="flex flex-col gap-4">
        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Course Title</label>
          <input
            type="text"
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-gray-500"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
        </div>

        {/* Course Description */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Course Description</label>
          <textarea
            placeholder="Enter course description..."
            className="outline-none py-2 px-3 rounded border border-gray-500 h-32 resize-vertical"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
          />
        </div>

        {/* Course Price */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Course Price</label>
          <input
            type="number"
            placeholder="0"
            className="outline-none py-2 px-3 rounded border border-gray-500 w-40"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            required
          />
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Discount (%)</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            max="100"
            className="outline-none py-2 px-3 rounded border border-gray-500 w-40"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        {/* Course Thumbnail */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="py-1"
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Thumbnail Preview"
              className="h-20 w-auto rounded border"
            />
          )}
        </div>

        {/* Is Published */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <label htmlFor="isPublished" className="font-medium">Publish Course</label>
        </div>

        {/* Chapters Section */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="font-medium text-lg">Course Content (Chapters)</label>
            <button
              type="button"
              onClick={addChapter}
              className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              Add Chapter
            </button>
          </div>

          {chapters.map((chapter, index) => (
            <div key={chapter.chapterId} className="border rounded p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <input
                  type="text"
                  value={chapter.chapterTitle}
                  onChange={(e) => updateChapterTitle(chapter.chapterId, e.target.value)}
                  className="outline-none py-1 px-2 rounded border border-gray-400 bg-white flex-1 mr-2"
                  placeholder="Chapter Title"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openLecturePopup(chapter.chapterId)}
                    className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 text-sm"
                  >
                    Add Lecture
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteChapter(chapter.chapterId)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Lectures in this chapter */}
              <div className="pl-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div key={lecture.lectureId} className="flex justify-between items-center py-2 border-b border-gray-300">
                    <div>
                      <span className="font-medium">{lecture.lectureTitle}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({lecture.lectureDuration} min)
                        {lecture.isPreviewFree && <span className="text-green-600 ml-1">[Free Preview]</span>}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteLecture(chapter.chapterId, lecture.lectureId)}
                      className="bg-red-400 text-white py-1 px-2 rounded hover:bg-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {chapter.chapterContent.length === 0 && (
                  <p className="text-gray-500 italic py-2">No lectures added yet</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          ADD
        </button>
      </div>

      {/* Lecture Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add Lecture</h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Lecture Title"
                className="outline-none py-2 px-3 rounded border border-gray-500"
                value={lectureDetails.lectureTitle}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                required
              />

              <input
                type="number"
                placeholder="Duration (minutes)"
                className="outline-none py-2 px-3 rounded border border-gray-500"
                value={lectureDetails.lectureDuration}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                required
              />

              <input
                type="url"
                placeholder="Lecture URL"
                className="outline-none py-2 px-3 rounded border border-gray-500"
                value={lectureDetails.lectureUrl}
                onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                required
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPreviewFree"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                />
                <label htmlFor="isPreviewFree">Free Preview</label>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={addLecture}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex-1"
              >
                Add Lecture
              </button>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
