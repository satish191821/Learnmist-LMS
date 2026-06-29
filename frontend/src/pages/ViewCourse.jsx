import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';
import { FiArrowLeft, FiLock, FiPlay, FiStar, FiUsers, FiBarChart2 } from "react-icons/fi";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { setUserData } from '../redux/userSlice';
import { toast } from 'sonner';

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate()
  const { courseData } = useSelector(state => state.course)
  const { userData } = useSelector(state => state.user)
  const [creatorData, setCreatorData] = useState(null)
  const dispatch = useDispatch()
  const [selectedLecture, setSelectedLecture] = useState(null);
  const { lectureData } = useSelector(state => state.lecture)
  const { selectedCourseData } = useSelector(state => state.course)
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([])
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleReview = async () => {
    try {
      await axios.post(serverUrl + "/api/review/givereview", { rating, comment, courseId }, { withCredentials: true })
      toast.success("Review Added")
      setRating(0)
      setComment("")
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  }

  const avgRating = calculateAverageRating(selectedCourseData?.reviews);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const fetchCourseData = () => {
    const course = courseData.find((item) => item._id === courseId);
    if (course) dispatch(setSelectedCourseData(course));
  }

  const checkEnrollment = () => {
    const isCreator = selectedCourseData?.creator?.toString() === userData?._id?.toString();
    const isEnrolledCourse = userData?.enrolledCourses?.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });
    if (isCreator || isEnrolledCourse) setIsEnrolled(true);
  }

  useEffect(() => { fetchCourseData(); checkEnrollment() }, [courseId, courseData, lectureData])

  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(`${serverUrl}/api/course/getcreator`, { userId: selectedCourseData.creator }, { withCredentials: true })
          setCreatorData(result.data)
        } catch (error) { toast.error("Failed to load creator info") }
      }
    }
    getCreator()
  }, [selectedCourseData])

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      setSelectedCreatorCourse(courseData.filter(c => c.creator === creatorData._id && c._id !== courseId))
    }
  }, [creatorData, courseData])

  const handleEnroll = async (courseId) => {
    try {
      if (!selectedCourseData?.price || Number(selectedCourseData.price) <= 0) {
        const { data } = await axios.post(serverUrl + "/api/payment/enroll-free", { courseId }, { withCredentials: true });
        dispatch(setUserData(data.user));
        setIsEnrolled(true);
        toast.success("Enrolled successfully!");
        return;
      }
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded || !window.Razorpay) {
        toast.error("Razorpay checkout failed to load.");
        return;
      }
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) { toast.error("Razorpay key is missing."); return; }

      const orderData = await axios.post(serverUrl + "/api/payment/create-order", { courseId }, { withCredentials: true });
      if (!orderData?.data?.id) { toast.error("Payment order could not be created."); return; }

      const options = {
        key: razorpayKey,
        amount: orderData.data.amount,
        currency: "INR",
        name: "LearnMist",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            await axios.post(serverUrl + "/api/payment/verify-payment", { ...response, courseId }, { withCredentials: true });
            const { data: freshUser } = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
            dispatch(setUserData(freshUser));
            setIsEnrolled(true)
            toast.success("Payment successful! You're now enrolled.");
          } catch (verifyError) {
            toast.error("Payment verification failed.");
          }
        },
      };
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong while enrolling.");
    }
  }

  if (!selectedCourseData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <ClipLoader size={40} color="#d97706" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 pt-16 lg:pt-20 pb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[45%] relative overflow-hidden">
              <img src={selectedCourseData?.thumbnail || img} alt={selectedCourseData?.title || "Course thumbnail"} className="w-full h-64 md:h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <span className="inline-block w-fit px-3 py-1 text-xs font-medium text-amber-600 bg-amber-50 rounded-full mb-3 capitalize">
                {selectedCourseData?.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{selectedCourseData?.title}</h1>
              <p className="text-slate-500 mb-4">{selectedCourseData?.subTitle}</p>
              <div className="flex items-center gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <FiStar className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium text-slate-700">{avgRating}</span>
                  <span className="text-xs text-slate-400">({selectedCourseData?.reviews?.length || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <FiUsers className="w-4 h-4" />
                  <span>{selectedCourseData?.enrolledStudents?.length || 0} enrolled</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <FiBarChart2 className="w-4 h-4" />
                  <span>{selectedCourseData?.level || "All levels"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-3xl font-bold text-amber-600">₹{selectedCourseData?.price || "Free"}</span>
                  {selectedCourseData?.price && <span className="ml-2 text-sm text-slate-400 line-through">₹{Math.round(selectedCourseData.price * 1.2)}</span>}
                </div>
                {!isEnrolled ? (
                  <button onClick={() => handleEnroll(courseId)}
                    className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-medium 
                             hover:bg-amber-700 hover:shadow-lg 
                             transition-all duration-300 active:scale-[0.98]">
                    Enroll Now
                  </button>
                ) : (
                  <button onClick={() => navigate(`/viewlecture/${courseId}`)}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-2xl font-medium 
                             hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-200 
                             transition-all duration-300 active:scale-[0.98] flex items-center gap-2">
                    <FiPlay className="w-4 h-4" /> Watch Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About this course</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedCourseData?.description || `Learn ${selectedCourseData?.category} from the beginning with hands-on projects and real-world examples.`}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Course Curriculum</h2>
              <p className="text-sm text-slate-400 mb-5">{selectedCourseData?.lectures?.length} Lectures</p>
              <div className="space-y-3">
                {selectedCourseData?.lectures?.map((lecture, index) => (
                  <button key={index}
                    disabled={!lecture.isPreviewFree}
                    onClick={() => { if (lecture.isPreviewFree) setSelectedLecture(lecture) }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                      lecture.isPreviewFree
                        ? "hover:bg-amber-50 cursor-pointer border-slate-200 hover:border-amber-200"
                        : "cursor-not-allowed opacity-50 border-slate-100"
                    } ${selectedLecture?.lectureTitle === lecture.lectureTitle ? "bg-amber-50 border-amber-200" : ""}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${lecture.isPreviewFree ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                      {lecture.isPreviewFree ? <FiPlay className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{lecture.lectureTitle}</span>
                    {lecture.isPreviewFree && <span className="ml-auto text-xs text-amber-500 font-medium">Preview</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Reviews</h2>
              {isEnrolled && (
                <div className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Write a Review</h3>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} onClick={() => setRating(star)}
                        className={`w-5 h-5 cursor-pointer transition-colors ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                    ))}
                  </div>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none bg-white"
                    rows="3" />
                  <button onClick={handleReview}
                    className="mt-3 px-6 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-medium 
                             hover:bg-amber-700 transition-all duration-300 active:scale-[0.98]">
                    Submit Review
                  </button>
                </div>
              )}
              <div className="space-y-4">
                {selectedCourseData?.reviews?.map((review, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-semibold text-sm shrink-0">
                      {review.user?.name?.slice(0, 1) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-800">{review.user?.name || "Anonymous"}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, s) => (
                            <FiStar key={s} className={`w-3 h-3 ${s < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{review.comment}</p>
                    </div>
                  </div>
                ))}
                {(!selectedCourseData?.reviews || selectedCourseData.reviews.length === 0) && (
                  <p className="text-sm text-slate-400 text-center py-4">No reviews yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Instructor</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-amber-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {creatorData?.photoUrl ? <img src={creatorData.photoUrl} className="w-full h-full object-cover" alt={creatorData.name} /> : creatorData?.name?.slice(0, 1) || "?"}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{creatorData?.name || "Loading..."}</h4>
                  <p className="text-xs text-slate-400">{creatorData?.description || "Instructor"}</p>
                </div>
              </div>
            </div>

            {selectedLecture?.videoUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Preview: {selectedLecture.lectureTitle}</h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <video src={selectedLecture.videoUrl} controls className="w-full h-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedCreatorCourse.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-slate-900 mb-6">More from this instructor</h2>
            <div className="flex flex-wrap gap-6">
              {selectedCreatorCourse.map((item, index) => (
                <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category} reviews={item.reviews} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewCourse