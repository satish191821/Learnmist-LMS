import axios from 'axios'
import React, { useState } from 'react'
import { FiArrowLeft, FiTrash2, FiUpload } from "react-icons/fi"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'

function EditLecture() {
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const { courseId, lectureId } = useParams()
  const { lectureData } = useSelector(state => state.lecture)
  const dispatch = useDispatch()
  const selectedLecture = lectureData.find(lecture => lecture._id === lectureId)
  const [videoUrl, setVideoUrl] = useState(null)
  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "")
  const [isPreviewFree, setIsPreviewFree] = useState(selectedLecture?.isPreviewFree || false)
  const navigate = useNavigate()

  const editLecture = async () => {
    const formData = new FormData()
    formData.append("lectureTitle", lectureTitle)
    if (videoUrl) formData.append("videoUrl", videoUrl)
    formData.append("isPreviewFree", String(isPreviewFree))
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + `/api/course/editlecture/${lectureId}`, formData, { withCredentials: true })
      dispatch(setLectureData(lectureData.map(l => l._id === result.data._id ? result.data : l)))
      toast.success("Lecture Updated")
      navigate("/courses")
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally { setLoading(false) }
  }

  const removeLecture = async () => {
    setLoading1(true)
    try {
      await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, { withCredentials: true })
      toast.success("Lecture Removed")
      navigate(`/createlecture/${courseId}`)
    } catch (error) {
      toast.error("Lecture remove error")
    } finally { setLoading1(false) }
  }

  if (!selectedLecture) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Update Lecture</h2>
              <p className="text-sm text-slate-500 mt-1">Edit lecture details and upload video</p>
            </div>
            <button onClick={removeLecture} disabled={loading1}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-all flex items-center gap-2">
              {loading1 ? <ClipLoader size={14} color="red" /> : <><FiTrash2 className="w-4 h-4" /> Delete</>}
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
              <input type="text"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                onChange={(e) => setLectureTitle(e.target.value)} value={lectureTitle} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Video File</label>
              <div className="relative">
                <input type="file" accept="video/*"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-600 hover:file:bg-amber-100 transition-all"
                  onChange={(e) => setVideoUrl(e.target.files[0])} />
              </div>
              {loading && <p className="text-xs text-amber-600 mt-2">Uploading video... Please wait.</p>}
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <input type="checkbox" id="isFree" checked={isPreviewFree}
                className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                onChange={() => setIsPreviewFree(prev => !prev)} />
              <label htmlFor="isFree" className="text-sm text-slate-700 cursor-pointer">Make this video free (preview)</label>
            </div>

            <button disabled={loading} onClick={editLecture}
              className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium 
                       hover:bg-amber-700 hover:shadow-lg 
                       transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? <ClipLoader size={20} color="white" /> : <><FiUpload className="w-4 h-4" /> Update Lecture</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditLecture
