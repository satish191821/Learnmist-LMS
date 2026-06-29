import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { Toaster } from 'sonner';
import Nav from './components/Nav'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/admin/Dashboard'
import Courses from './pages/admin/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/admin/AddCourses'
import CreateCourse from './pages/admin/CreateCourse'
import CreateLecture from './pages/admin/CreateLecture'
import EditLecture from './pages/admin/EditLecture'

import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import getAllReviews from './customHooks/getAllReviews'
import { ClipLoader } from 'react-spinners'

export const serverUrl = import.meta.env.VITE_SERVER_URL || "https://learnmist-lms.onrender.com"

function App() {

  const location = useLocation()
  const hideNavPaths = ['/login', '/signup', '/forgotpassword', '/verifyemail']
  const shouldShowNav = !hideNavPaths.includes(location.pathname)
  
  let {userData} = useSelector(state=>state.user)

  let authLoading = getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()

  if (authLoading) {
    return (
      <>
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
          <ClipLoader size={50} color="#4f46e5" />
        </div>
      </>
    );
  }

  return (
    <>
    
      {shouldShowNav && <Nav />}
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
        toastOptions={{
          classNames: {
            closeButton:
              "!right-4 !left-auto !top-1/2 !-translate-y-1/2 !bg-white !text-gray-600 !shadow-md !border !border-gray-200 !w-6 !h-6 !rounded-full hover:!bg-gray-100 hover:!text-gray-900",
          },
        }}
      />
      <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"}/>}/>
        <Route path='/profile' element={userData?<Profile/>:<Navigate to={"/signup"}/>}/>
        <Route path='/allcourses' element={<AllCouses/>}/>
        <Route path='/viewcourse/:courseId' element={userData?<ViewCourse/>:<Navigate to={"/signup"}/>}/>
        <Route path='/editprofile' element={userData?<EditProfile/>:<Navigate to={"/signup"}/>}/>
        <Route path='/enrolledcourses' element={userData?<EnrolledCourse/>:<Navigate to={"/signup"}/>}/>
         <Route path='/viewlecture/:courseId' element={userData?<ViewLecture/>:<Navigate to={"/signup"}/>}/>
         <Route path='/searchwithai' element={<SearchWithAi/>}/>
        
        
        <Route path='/dashboard' element={userData?.role === "educator"?<Dashboard/>:<Navigate to={"/signup"}/>}/>
        <Route path='/courses' element={userData?.role === "educator"?<Courses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/addcourses/:courseId' element={userData?.role === "educator"?<AddCourses/>:<Navigate to={"/signup"}/>}/>
        <Route path='/createcourses' element={userData?.role === "educator"?<CreateCourse/>:<Navigate to={"/signup"}/>}/>
        <Route path='/createlecture/:courseId' element={userData?.role === "educator"?<CreateLecture/>:<Navigate to={"/signup"}/>}/>
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator"?<EditLecture/>:<Navigate to={"/signup"}/>}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/verifyemail' element={<VerifyEmail/>}/>
         </Routes>

         </>
    
  )
}

export default App
