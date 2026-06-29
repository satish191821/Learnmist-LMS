import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiEdit2, FiMail, FiBookOpen, FiUser } from "react-icons/fi";

function Profile() {
  let { userData } = useSelector(state => state.user)
  let navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-2xl mx-auto pt-16 lg:pt-20 px-4 md:px-8 pb-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-amber-600 p-8 text-center relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full ring-4 ring-white/50 overflow-hidden shadow-xl">
                {userData.photoUrl ? (
                  <img src={userData.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <h1 className="text-xl font-bold text-white mt-4">{userData.name}</h1>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium capitalize mt-2">
                {userData.role}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-8 space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <FiMail className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="text-sm font-medium text-slate-800">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Bio</p>
                <p className="text-sm font-medium text-slate-800">{userData.description || "No bio yet"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FiBookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Enrolled Courses</p>
                <p className="text-sm font-medium text-slate-800">{userData.enrolledCourses?.length || 0} courses</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/editprofile")}
              className="w-full py-3 rounded-2xl bg-amber-600 text-white font-medium 
                       hover:bg-amber-700 hover:shadow-lg 
                       transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <FiEdit2 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
