import axios from "axios";
import React, { useState } from "react";
import { FiArrowLeft, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../App";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

const CreateCourse = () => {
  let navigate = useNavigate()
  let [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  const categories = ['App Development', 'AI/ML', 'AI Tools', 'Data Science', 'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others']

  const CreateCourseHandler = async () => {
    setLoading(true)
    try {
      await axios.post(serverUrl + "/api/course/create", { title, category }, { withCredentials: true })
      toast.success("Course Created")
      navigate("/courses")
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
              <FiPlus className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Course</h2>
            <p className="text-sm text-slate-500 mt-1">Start building your new course</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Course Title</label>
              <input type="text" placeholder="Enter course title"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                onChange={(e) => setTitle(e.target.value)} value={title} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} onClick={CreateCourseHandler}
              className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium 
                       hover:bg-amber-700 hover:shadow-lg 
                       transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? <ClipLoader size={20} color="white" /> : <><FiPlus className="w-4 h-4" /> Create Course</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCourse
