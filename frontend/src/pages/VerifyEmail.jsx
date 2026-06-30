import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { FiMail } from "react-icons/fi";

function VerifyEmail() {
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!email) navigate('/signup')
  }, [email, navigate])

  const handleVerify = async () => {
    if (!otp) { toast.error('Please enter the OTP'); return }
    setLoading(true)
    try {
      const result = await axios.post(serverUrl + '/api/auth/verifyemail', { email, otp }, { withCredentials: true })
      dispatch(setUserData(result.data.user))
      if (result.data.token) localStorage.setItem("token", result.data.token)
      toast.success('Email verified successfully')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed')
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      await axios.post(serverUrl + '/api/auth/resendverificationotp', { email })
      toast.success('OTP resent to your email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP')
    } finally { setResending(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
          <FiMail className="w-7 h-7 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Email</h1>
        <p className="text-sm text-slate-500 mb-2">
          We sent an OTP to <strong className="text-slate-800">{email}</strong>. Enter it below to verify your account.
        </p>
        <p className="text-xs text-amber-600 mb-6 font-medium">
          Didn't see it? Check your spam folder.
        </p>

        <input
          type="text"
          maxLength={4}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-lg tracking-[12px] text-center 
                     focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50 mb-4"
          onChange={(e) => setOtp(e.target.value)}
          value={otp}
        />

        <button
          disabled={loading}
          onClick={handleVerify}
          className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium 
                   hover:bg-amber-700 hover:shadow-lg 
                   transition-all duration-300 active:scale-[0.98] flex items-center justify-center mb-4"
        >
          {loading ? <ClipLoader size={20} color="white" /> : 'Verify Email'}
        </button>

        <p className="text-sm text-slate-500">
          Didn't receive the code?{' '}
          <button disabled={resending} onClick={handleResend} className="text-amber-600 hover:text-amber-700 font-medium cursor-pointer">
            {resending ? 'Resending...' : 'Resend'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail
