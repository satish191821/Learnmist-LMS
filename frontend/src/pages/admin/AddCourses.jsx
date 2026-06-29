import React, { useEffect, useRef, useState } from 'react'
import img from "../../assets/empty.jpg"
import { FiArrowLeft, FiEdit2, FiCamera } from "react-icons/fi";
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import { setCourseData } from '../../redux/courseSlice';

function AddCourses() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [level, setLevel] = useState("")
  const [price, setPrice] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const thumb = useRef()
  const [frontendImage, setFrontendImage] = useState(null)
  const [backendImage, setBackendImage] = useState(null)
  let [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { courseData } = useSelector(state => state.course)

  const categories = ['App Development', 'AI/ML', 'AI Tools', 'Data Science', 'Data Analytics', 'Ethical Hacking', 'UI UX Designing', 'Web Development', 'Others']
  const levels = ['Beginner', 'Intermediate', 'Advanced']

  const getCourseById = async () => {
    try {
      const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true })
      setSelectedCourse(result.data)
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    if (selectedCourse) {
      setTitle(selectedCourse.title || "")
      setSubTitle(selectedCourse.subTitle || "")
      setDescription(selectedCourse.description || "")
      setCategory(selectedCourse.category || "")
      setLevel(selectedCourse.level || "")
      setPrice(selectedCourse.price || "")
      setFrontendImage(selectedCourse.thumbnail || img)
      setIsPublished(selectedCourse?.isPublished)
    }
  }, [selectedCourse])

  useEffect(() => { getCourseById() }, [])

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  const editCourseHandler = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("subTitle", subTitle)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("level", level)
    formData.append("price", price)
    formData.append("thumbnail", backendImage)
    formData.append("isPublished", isPublished)

    try {
      const result = await axios.post(`${serverUrl}/api/course/editcourse/${courseId}`, formData, { withCredentials: true })
      const updatedCourse = result.data
      if (updatedCourse.isPublished) {
        const updatedCourses = courseData.map(c => c._id === courseId ? updatedCourse : c)
        if (!courseData.some(c => c._id === courseId)) updatedCourses.push(updatedCourse)
        dispatch(setCourseData(updatedCourses))
      } else {
        dispatch(setCourseData(courseData.filter(c => c._id !== courseId)))
      }
      navigate("/courses")
      toast.success("Course Updated")
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally { setLoading(false) }
  }

  const removeCourse = async () => {
    setLoading(true)
    try {
      await axios.delete(serverUrl + `/api/course/removecourse/${courseId}`, { withCredentials: true })
      dispatch(setCourseData(courseData.filter(c => c._id !== courseId)))
      navigate("/courses")
      toast.success("Course Deleted")
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 pt-16 lg:pt-20 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Edit Course</h2>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigate(`/createlecture/${selectedCourse?._id}`)}
                className="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 text-sm font-medium hover:bg-amber-100 transition-all">
                Lectures
              </button>
              <button onClick={() => setIsPublished(prev => !prev)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isPublished ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                {isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={removeCourse} disabled={loading}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-50">
                {loading ? <ClipLoader size={14} color="red" /> : 'Delete'}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                  <input type="text" placeholder="Course Title"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    onChange={(e) => setTitle(e.target.value)} value={title} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
                  <input type="text" placeholder="Subtitle"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    onChange={(e) => setSubTitle(e.target.value)} value={subTitle} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                  <textarea placeholder="Course description" rows={4}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                    onChange={(e) => setDescription(e.target.value)} value={description} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Level</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    onChange={(e) => setLevel(e.target.value)} value={level}>
                    <option value="">Select Level</option>
                    {levels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (INR)</label>
                  <input type="number" placeholder="₹"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    onChange={(e) => setPrice(e.target.value)} value={price} />
                </div>

                {/* Thumbnail */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Thumbnail</label>
                  <div className="relative group cursor-pointer" onClick={() => thumb.current?.click()}>
                    <img src={frontendImage} alt=""
                      className="w-full h-36 object-cover rounded-xl border border-slate-200" />
                    <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiCamera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input ref={thumb} type="file" accept="image/*" hidden onChange={handleThumbnail} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => navigate("/courses")}
                  className="px-6 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading} onClick={editCourseHandler}
                  className="px-8 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium 
                           hover:bg-amber-700 hover:shadow-lg 
                           transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
                  {loading ? <ClipLoader size={16} color="white" /> : <><FiEdit2 className="w-4 h-4" /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCourses
