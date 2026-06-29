import React from 'react'
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiDollarSign, FiBookOpen, FiUsers } from "react-icons/fi";

function Dashboard() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);

  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    lectures: course.lectures.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    enrolled: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    return sum + (course.price ? course.price * studentCount : 0);
  }, 0) || 0;

  const totalStudents = creatorCourseData?.reduce((sum, c) => sum + (c.enrolledStudents?.length || 0), 0) || 0;

  const stats = [
    { label: 'Total Courses', value: creatorCourseData?.length || 0, icon: FiBookOpen, color: 'bg-amber-50 text-amber-600' },
    { label: 'Total Students', value: totalStudents, icon: FiUsers, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Earnings', value: `₹${totalEarnings.toLocaleString()}`, icon: FiDollarSign, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 pt-16 lg:pt-20 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Welcome */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-amber-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 ring-4 ring-amber-100">
            {userData?.photoUrl ? <img src={userData.photoUrl} className="w-full h-full object-cover" alt={userData.name} /> : userData?.name?.slice(0, 1) || "E"}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-slate-900">Welcome, {userData?.name || "Educator"}</h1>
            <p className="text-slate-500 text-sm mt-1">{userData?.description || "Start creating amazing courses for your students!"}</p>
          </div>
          <button onClick={() => navigate("/courses")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 text-white font-medium text-sm
                     hover:bg-amber-700 hover:shadow-lg transition-all duration-300">
            <FiPlus className="w-4 h-4" /> Create Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts or Empty State */}
        {creatorCourseData?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FiBookOpen className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">No courses yet</h3>
            <p className="text-sm text-slate-400 mb-6">Create your first course to see analytics here</p>
            <button onClick={() => navigate("/createcourses")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 text-white font-medium text-sm
                       hover:bg-amber-700 hover:shadow-lg transition-all duration-300">
              <FiPlus className="w-4 h-4" /> Create Course
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="lectures" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="enrolled" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
