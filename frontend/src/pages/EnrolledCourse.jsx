import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlay } from "react-icons/fi"
import emptyImg from "../assets/empty.jpg"

function EnrolledCourse() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const courses = userData?.enrolledCourses || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 pt-16 lg:pt-20 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">My Enrolled Courses</h1>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FiPlay className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No courses yet</h3>
            <p className="text-sm text-slate-400">You haven't enrolled in any course yet.</p>
            <button onClick={() => navigate("/allcourses")}
              className="mt-6 inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-2xl font-medium text-sm
                       hover:bg-amber-700 hover:shadow-lg transition-all duration-300">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-wrap gap-6">
            {courses.map((course) => (
              <div key={course._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-amber-200/20 border border-slate-100 hover:border-amber-100 
                           hover:scale-[1.03] hover:z-10 relative transition-all duration-300 overflow-hidden w-full max-w-sm">
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img src={course.thumbnail || emptyImg} alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-amber-600 bg-amber-50 rounded-full mb-2">
                    {course.category}
                  </span>
                  <h2 className="text-base font-semibold text-slate-900 mb-1">{course.title}</h2>
                  <p className="text-xs text-slate-400 mb-4">{course.level}</p>
                  <button
                    onClick={() => navigate(`/viewlecture/${course._id}`)}
                    className="w-full py-3 rounded-xl bg-amber-600 text-white text-sm font-medium 
                             hover:bg-amber-700 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                    <FiPlay className="w-4 h-4" /> Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EnrolledCourse
