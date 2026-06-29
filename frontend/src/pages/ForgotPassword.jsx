import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import { toast } from "sonner";
import { FiArrowLeft, FiMail, FiKey, FiLock } from "react-icons/fi";

function ForgotPassword() {
  let navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [newpassword, setNewPassword] = useState("");
  const [conPassword, setConpassword] = useState("");

  const handleStep1 = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/sendotp`,
        { email },
        { withCredentials: true },
      );
      setStep(2);
      toast.success("OTP sent! Check inbox & spam folder");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/verifyotp`,
        { email, otp },
        { withCredentials: true },
      );
      toast.success("OTP verified");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async () => {
    if (newpassword !== conPassword)
      return toast.error("Passwords do not match");
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/auth/resetpassword`,
        { email, password: newpassword },
        { withCredentials: true },
      );
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      icon: FiMail,
      title: "Forgot Your Password?",
      desc: "Enter your email to receive an OTP. Check spam if you don't see it.",
      placeholder: "you@example.com",
      value: email,
      setter: setEmail,
      btn: "Send OTP",
      action: handleStep1,
      type: "email",
    },
    {
      icon: FiKey,
      title: "Enter OTP",
      desc: "Enter the 4-digit code sent to your email",
      placeholder: "Enter OTP",
      value: otp,
      setter: setOtp,
      btn: "Verify OTP",
      action: handleStep2,
      type: "text",
    },
    {
      icon: FiLock,
      title: "Reset Your Password",
      desc: "Enter a new password for your account",
      btn: "Reset Password",
      action: handleStep3,
      isPassword: true,
    },
  ];

  const current = steps[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-6"
        >
          <FiArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s <= step
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {s}
              </div>
            ))}
            <div
              className="flex-1 h-0.5 bg-slate-100 mx-2 absolute"
              style={{ zIndex: -1 }}
            />
          </div>

          {current && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center">
                  <current.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {current.title}
                </h2>
                {current.desc && (
                  <p className="text-sm text-slate-500 mt-1">{current.desc}</p>
                )}
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                {!current.isPassword ? (
                  <div>
                    <input
                      type={current.type}
                      placeholder={current.placeholder}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50 text-center tracking-widest"
                      onChange={(e) => current.setter(e.target.value)}
                      value={current.value}
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50"
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newpassword}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all bg-slate-50"
                        onChange={(e) => setConpassword(e.target.value)}
                        value={conPassword}
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  onClick={current.action}
                  className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium 
                           hover:bg-amber-700 hover:shadow-lg 
                           transition-all duration-300 active:scale-[0.98] flex items-center justify-center"
                >
                  {loading ? (
                    <ClipLoader size={20} color="white" />
                  ) : (
                    current.btn
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
