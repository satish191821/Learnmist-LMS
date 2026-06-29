import React, { useEffect } from 'react'
import { FiEdit2, FiPlus, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'sonner';
import { setCreatorCourseData } from '../../redux/courseSlice';
import emptyImg from "../../assets/empty.jpg"

function Courses() {
  let navigate = useNavigate()
  let dispatch = useDispatch()
  const { creatorCourseData } = useSelector(state => state.course)

  useEffect(() => {
    const getCreatorData = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/course/getcreatorcourses", { withCredentials: true })
        dispatch(setCreatorCourseData(result.data))
      } catch (error) {
        toast.error(error.response?.data?.message)
      }
    }
    getCreatorData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 pt-16 lg:pt-20 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-amber-600 transition-colors">
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">My Courses</h1>
          </div>
          <button onClick={() => navigate("/createcourses")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 text-white font-medium text-sm
                     hover:bg-amber-700 hover:shadow-lg transition-all duration-300">
            <FiPlus className="w-4 h-4" /> New Course
          </button>
        </div>

        {creatorCourseData?.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FiPlus className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No courses yet</h3>
            <p className="text-sm text-slate-400 mb-6">Create your first course to get started</p>
            <button onClick={() => navigate("/createcourses")}
              className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-medium text-sm
                       hover:bg-amber-700 transition-all duration-300">
              Create Course
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-4 px-6 font-semibold text-slate-600">Course</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-600">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-600">Status</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorCourseData?.map((course) => (
                    <tr key={course._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <img src={course?.thumbnail || emptyImg} alt="" className="w-16 h-12 rounded-lg object-cover" />
                          <span className="font-medium text-slate-800">{course?.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">₹{course?.price || "NA"}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          course?.isPublished ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                        }`}>
                          {course?.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => navigate(`/addcourses/${course?._id}`)}
                          className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {creatorCourseData?.map((course) => (
                <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center gap-4">
                  <img src={course?.thumbnail || emptyImg} alt="" className="w-16 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">{course?.title}</h3>
                    <p className="text-xs text-slate-400">₹{course?.price || "NA"}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      course?.isPublished ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      {course?.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <button onClick={() => navigate(`/addcourses/${course?._id}`)}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all">
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Courses
