import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlay, FiArrowLeft, FiMonitor } from "react-icons/fi";
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { serverUrl } from '../App';

function ViewLecture() {
  const { courseId } = useParams();
  const { userData } = useSelector((state) => state.user)
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const result = await axios.get(serverUrl + `/api/course/getcourse/${courseId}`, { withCredentials: true });
        setCourse(result.data);
      } catch (error) {
        // console.log("Failed to fetch course:", error)
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (course?.lectures?.length > 0) {
      setSelectedLecture(course.lectures[0]);
    }
  }, [course]);

  const courseCreator = userData?._id === course?.creator ? userData : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <ClipLoader size={50} color="#4f46e5" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <p className="text-slate-500 text-lg">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 pt-16 lg:pt-20 pb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 font-medium">{course?.category}</span>
            <span className="px-3 py-1 rounded-full bg-slate-100">{course?.level}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Video */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <h1 className="text-xl font-bold text-slate-900 p-6 pb-0">{course?.title}</h1>
              <div className="p-6">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
                  {selectedLecture?.videoUrl ? (
                    <video src={selectedLecture.videoUrl} controls className="w-full h-full object-cover" crossOrigin="anonymous" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-3">
                      <FiMonitor className="w-12 h-12" />
                      <span className="text-sm">Select a lecture to start watching</span>
                    </div>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-slate-800 mt-4">{selectedLecture?.lectureTitle}</h2>
              </div>
            </div>
          </div>

          {/* Right - Lectures List */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Course Content</h2>
              <p className="text-xs text-slate-400 mb-4">{course?.lectures?.length} lectures</p>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {course?.lectures?.length > 0 ? (
                  course.lectures.map((lecture, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedLecture(lecture)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                        selectedLecture?._id === lecture._id
                          ? 'bg-amber-50 border-amber-200'
                          : 'hover:bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedLecture?._id === lecture._id ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-700 truncate">{lecture.lectureTitle}</h4>
                      </div>
                      <FiPlay className={`w-4 h-4 shrink-0 ${selectedLecture?._id === lecture._id ? 'text-amber-600' : 'text-slate-300'}`} />
                    </button>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm text-center py-8">No lectures available yet.</p>
                )}
              </div>

              {/* Instructor */}
              {courseCreator && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Instructor</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                      {courseCreator.photoUrl ? <img src={courseCreator.photoUrl} className="w-full h-full object-cover" alt="" /> : courseCreator.name?.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{courseCreator.name}</h4>
                      <p className="text-xs text-slate-400 truncate">{courseCreator.description || 'No bio'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewLecture;
