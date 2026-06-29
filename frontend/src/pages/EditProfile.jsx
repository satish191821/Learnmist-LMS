import axios from 'axios'
import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCamera } from "react-icons/fi";

function EditProfile() {
  let { userData } = useSelector(state => state.user)
  let [name, setName] = useState(userData.name || "")
  let [description, setDescription] = useState(userData.description || "")
  let [photoUrl, setPhotoUrl] = useState(null)
  let dispatch = useDispatch()
  let [loading, setLoading] = useState(false)
  let navigate = useNavigate()
  let fileRef = useRef(null)

  const updateProfile = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    if (photoUrl) formData.append("photoUrl", photoUrl)

    try {
      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true })
      dispatch(setUserData(result.data))
      navigate("/")
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Profile update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-xl mx-auto pt-16 lg:pt-20 px-4 md:px-8 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Edit Profile</h2>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group cursor-pointer" onClick={() => fileRef.current?.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-amber-100">
                  {photoUrl ? (
                    <img src={URL.createObjectURL(photoUrl)} className="w-full h-full object-cover" alt="" />
                  ) : userData.photoUrl ? (
                    <img src={userData.photoUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-amber-600 flex items-center justify-center text-3xl font-bold text-white">
                      {userData?.name?.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => setPhotoUrl(e.target.files[0])} />
              <span className="text-xs text-slate-400">Click to change photo</span>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                readOnly
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-500 cursor-not-allowed"
                value={userData.email}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50 resize-none"
                rows={3}
                placeholder="Tell us about yourself"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={updateProfile}
              className="w-full py-3 rounded-2xl bg-amber-600 text-white font-medium 
                       hover:bg-amber-700 hover:shadow-lg 
                       transition-all duration-300 active:scale-[0.98] flex items-center justify-center"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
