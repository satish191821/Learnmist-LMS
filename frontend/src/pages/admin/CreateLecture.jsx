import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiEdit2, FiPlus } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { setLectureData } from '../../redux/lectureSlice';

function CreateLecture() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [lectureTitle, setLectureTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { lectureData } = useSelector(state => state.lecture)

  const createLectureHandler = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + `/api/course/createlecture/${courseId}`, { lectureTitle }, { withCredentials: true })
      dispatch(setLectureData([...lectureData, result.data.lecture]))
      toast.success("Lecture Created")
      setLectureTitle("")
    } catch (error) {
      toast.error(error.response?.data?.message)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    const getLecture = async () => {
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourselecture/${courseId}`, { withCredentials: true })
        dispatch(setLectureData(result.data.lectures))
      } catch (error) {
        toast.error(error.response?.data?.message)
      }
    }
    getLecture()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back to Course
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
              <FiPlus className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Add a Lecture</h2>
            <p className="text-sm text-slate-500 mt-1">Enter the title and add your video content</p>
          </div>

          <div className="space-y-4">
            <input type="text" placeholder="e.g. Introduction to MERN Stack"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
              onChange={(e) => setLectureTitle(e.target.value)} value={lectureTitle} />

            <button disabled={loading} onClick={createLectureHandler}
              className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium 
                       hover:bg-amber-700 hover:shadow-lg 
                       transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? <ClipLoader size={20} color="white" /> : <><FiPlus className="w-4 h-4" /> Create Lecture</>}
            </button>
          </div>

          {/* Lecture List */}
          {lectureData.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Lecture List ({lectureData.length})</h3>
              <div className="space-y-2">
                {lectureData.map((lecture, index) => (
                  <div key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 
                               hover:bg-amber-50 hover:border-amber-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{lecture.lectureTitle}</span>
                    </div>
                    <button onClick={() => navigate(`/editlecture/${courseId}/${lecture._id}`)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateLecture
