import React, { useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  let [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  let dispatch = useDispatch()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + "/api/auth/login", { email, password }, { withCredentials: true })
      dispatch(setUserData(result.data.user))
      if (result.data.token) localStorage.setItem("token", result.data.token)
      navigate("/")
      toast.success("Login successful")
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Email not verified")
        navigate("/verifyemail", { state: { email } })
      } else {
        toast.error(error.response?.data?.message || "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user
      const result = await axios.post(serverUrl + "/api/auth/googlesignup",
        { name: user.displayName, email: user.email, role: "student" },
        { withCredentials: true }
      )
      dispatch(setUserData(result.data.user))
      if (result.data.token) localStorage.setItem("token", result.data.token)
      navigate("/")
      toast.success("Login successful")
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-1">Login to your account</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type={show ? "text" : "password"}
                placeholder="********"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50 pr-10"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button type="button" onClick={() => setShow(prev => !prev)} className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600">
                {show ? <MdRemoveRedEye className="w-5 h-5" /> : <MdOutlineRemoveRedEye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={handleLogin}
              className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium 
                       hover:bg-amber-700 hover:shadow-lg 
                       transition-all duration-300 active:scale-[0.98] flex items-center justify-center"
            >
              {loading ? <ClipLoader size={20} color="white" /> : "Login"}
            </button>

            <button type="button" onClick={() => navigate("/forgotpassword")} className="text-sm text-amber-600 hover:text-amber-700 font-medium mx-auto block">
              Forgot your password?
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-sm text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 
                     hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-[0.98] shadow-sm"
          >
            <svg viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="mt-6 text-sm text-slate-500 text-center">
            Don't have an account?{' '}
            <button onClick={() => navigate("/signup")} className="text-amber-600 hover:text-amber-700 font-medium">
              Sign up
            </button>
          </p>
        </div>

        {/* Right - Brand Panel */}
        <div className="hidden md:flex w-1/2 bg-slate-800 p-12 flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative z-10">
            <svg viewBox="0 -4.83 31.876 31.876" className="w-24 h-24 mx-auto mb-6 text-amber-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(-673.292 -327.728)">
                <path d="M689.741,329.778l9.241,2.448-9.242,2.7-9.82-2.7,9.821-2.449m.012-2.05a.478.478,0,0,0-.113.013L673.752,331.7a.465.465,0,0,0-.01.9l15.887,4.366a.467.467,0,0,0,.123.017.476.476,0,0,0,.13-.019l14.951-4.366a.465.465,0,0,0-.011-.9l-14.95-3.962a.479.479,0,0,0-.119-.015Z"/>
                <path d="M696.013,349.95H682.63a3.932,3.932,0,0,1-4.124-3.7v-8.831a1,1,0,0,1,2,0v8.831a1.95,1.95,0,0,0,2.124,1.7h13.383a1.949,1.949,0,0,0,2.125-1.7v-8.831a1,1,0,0,1,2,0v8.831A3.932,3.932,0,0,1,696.013,349.95Z"/>
                <path d="M674.292,341.16a1,1,0,0,1-1-1v-4.208a1,1,0,0,1,2,0v4.208A1,1,0,0,1,674.292,341.16Z"/>
              </g>
            </svg>
            <h2 className="text-3xl font-bold text-amber-400 mb-3">LearnMist</h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Your gateway to AI-powered learning. Master new skills, advance your career.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
