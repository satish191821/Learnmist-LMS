import React, { useState, useRef, useEffect } from 'react'
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FiLogOut, FiUser, FiBookOpen, FiGrid, FiHome, FiTrash2, FiZap } from "react-icons/fi";

import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Nav() {
  let [showHam, setShowHam] = useState(false)
  let [showPro, setShowPro] = useState(false)
  let [scrolled, setScrolled] = useState(false)
  let navigate = useNavigate()
  let dispatch = useDispatch()
  let { userData } = useSelector(state => state.user)
  let profileRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowPro(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return
    try {
      await axios.delete(serverUrl + "/api/user/deleteaccount", { withCredentials: true })
      dispatch(setUserData(null))
      toast.success("Account deleted successfully")
      navigate("/signup")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account")
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
      dispatch(setUserData(null))
      toast.success("Logged out successfully")
    } catch (error) {
      // console.log(error.response?.data?.message)
      toast.error("Failed to logout")
    }
  }

  const navLinks = [
    { label: 'Home', path: '/', icon: FiHome },
    { label: 'Courses', path: '/allcourses', icon: FiBookOpen },
    { label: 'AI Search', path: '/searchwithai', icon: FiZap },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-900/70 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-slate-900/30 backdrop-blur-xl border-b border-white/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate("/") }} className="flex items-center gap-3 shrink-0">
              <svg viewBox="0 -4.83 31.876 31.876" className="w-9 h-9 lg:w-10 lg:h-10 text-amber-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(-673.292 -327.728)">
                  <path d="M689.741,329.778l9.241,2.448-9.242,2.7-9.82-2.7,9.821-2.449m.012-2.05a.478.478,0,0,0-.113.013L673.752,331.7a.465.465,0,0,0-.01.9l15.887,4.366a.467.467,0,0,0,.123.017.476.476,0,0,0,.13-.019l14.951-4.366a.465.465,0,0,0-.011-.9l-14.95-3.962a.479.479,0,0,0-.119-.015Z"/>
                  <path d="M696.013,349.95H682.63a3.932,3.932,0,0,1-4.124-3.7v-8.831a1,1,0,0,1,2,0v8.831a1.95,1.95,0,0,0,2.124,1.7h13.383a1.949,1.949,0,0,0,2.125-1.7v-8.831a1,1,0,0,1,2,0v8.831A3.932,3.932,0,0,1,696.013,349.95Z"/>
                  <path d="M674.292,341.16a1,1,0,0,1-1-1v-4.208a1,1,0,0,1,2,0v4.208A1,1,0,0,1,674.292,341.16Z"/>
                </g>
              </svg>
              <span className="font-bold text-lg lg:text-xl hidden sm:block text-amber-600">
                LearnMist
              </span>
            </button>

            {/* Center Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); if (link.path === '/') window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium text-white/80 hover:text-blue-400 hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </button>
              ))}
              {userData?.role === "educator" && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-3 py-1.5 rounded-xl text-sm font-medium text-white/50 hover:text-blue-400 hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
                >
                  <FiGrid className="w-4 h-4" />
                  Dashboard
                </button>
              )}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {!userData ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-1.5 rounded-xl text-sm font-medium text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all duration-200"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="bg-amber-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-amber-700 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowPro(prev => !prev)}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white shadow-md overflow-hidden">
                      {userData.photoUrl ? (
<img src={userData.photoUrl} className="w-full h-full object-cover" alt={userData.name} />
                      ) : (
                        userData?.name?.slice(0, 1).toUpperCase()
                      )}
                    </div>
                  </button>

                  {showPro && (
                    <div className="absolute right-0 mt-3 w-56 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white/90 truncate">{userData.name}</p>
                        <p className="text-xs text-white/50 capitalize">{userData.role}</p>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { navigate("/profile"); setShowPro(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-blue-400 transition-colors">
                          <FiUser className="w-4 h-4" /> My Profile
                        </button>
                        <button onClick={() => { navigate("/enrolledcourses"); setShowPro(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-blue-400 transition-colors">
                          <FiBookOpen className="w-4 h-4" /> My Courses
                        </button>
                        {userData?.role === "educator" && (
                          <button onClick={() => { navigate("/courses"); setShowPro(false) }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-blue-400 transition-colors">
                            <FiGrid className="w-4 h-4" /> Manage Courses
                          </button>
                        )}
                      </div>
                      <div className="border-t border-white/10 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <FiLogOut className="w-4 h-4" /> Log out
                        </button>
                        <button onClick={handleDeleteAccount} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                          <FiTrash2 className="w-4 h-4" /> Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger - Mobile */}
            <button
              onClick={() => setShowHam(true)}
              className="lg:hidden p-2 rounded-lg transition-colors text-white/70 hover:text-blue-400 hover:bg-white/10"
            >
              <GiHamburgerMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${showHam ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${showHam ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowHam(false)} />
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ${showHam ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <span className="font-bold text-lg text-white/90">Menu</span>
            <button onClick={() => setShowHam(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <IoClose className="w-5 h-5 text-white/70" />
            </button>
          </div>

          <div className="p-5 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setShowHam(false); if (link.path === '/') window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className="w-full text-left px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-blue-400 font-medium transition-colors flex items-center gap-3"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </button>
            ))}
            {userData?.role === "educator" && (
              <button
                onClick={() => { navigate("/dashboard"); setShowHam(false) }}
                className="w-full text-left px-4 py-3 rounded-xl text-amber-300 hover:bg-white/10 hover:text-blue-400 font-medium transition-colors flex items-center gap-2"
              >
                <FiGrid className="w-4 h-4" /> Dashboard
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10">
            {!userData ? (
              <div className="space-y-2">
                <button onClick={() => { navigate("/login"); setShowHam(false) }} className="w-full py-3 rounded-xl border border-white/20 text-white/70 font-medium hover:bg-white/10 transition-colors">Log in</button>
                <button onClick={() => { navigate("/signup"); setShowHam(false) }} className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-all">Sign up</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                    {userData.photoUrl ? <img src={userData.photoUrl} className="w-full h-full object-cover" alt="" /> : userData?.name?.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{userData.name}</p>
                    <p className="text-xs text-white/50 capitalize">{userData.role}</p>
                  </div>
                </div>
                <button onClick={() => { navigate("/profile"); setShowHam(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-blue-400 transition-colors"><FiUser className="w-4 h-4" /> My Profile</button>
                <button onClick={() => { navigate("/enrolledcourses"); setShowHam(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-blue-400 transition-colors"><FiBookOpen className="w-4 h-4" /> My Courses</button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"><FiLogOut className="w-4 h-4" /> Log out</button>
                <button onClick={handleDeleteAccount} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-400 transition-colors"><FiTrash2 className="w-4 h-4" /> Delete Account</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav