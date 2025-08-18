import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);

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

  // Initialize Quill editor for course description
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseData = {
      id: uniqid(),
      title: courseTitle,
      price: coursePrice,
      discount,
      description: quillRef.current.root.innerHTML,
      thumbnail: image,
      chapters,
    };
    console.log("New Course Added:", courseData);
    alert("Course Added Successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4">Add Course</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <div ref={editorRef} className="h-40 border rounded p-2"></div>
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
          />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Thumbnail Preview"
              className="h-20 w-auto rounded border"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
