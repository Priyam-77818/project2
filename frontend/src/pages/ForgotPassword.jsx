import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import ClipLoader from "react-spinners/ClipLoader"; // 🔥 added

function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // SEND OTP
  const handleSendOtp = async () => {
    setErr("");
    if (!email) return setErr("Enter email");

    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );

      setStep(2);

    } catch (error) {
      setErr(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    setErr("");
    if (!otp) return setErr("Enter OTP");

    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      setStep(3);

    } catch (error) {
      setErr(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {
    setErr("");

    if (!password || !confirmPassword) {
      return setErr("Fill all fields");
    }

    if (password !== confirmPassword) {
      return setErr("Passwords do not match");
    }

    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword: password },
        { withCredentials: true }
      );

      navigate("/signin");

    } catch (error) {
      setErr(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else navigate("/signin");
            }}
          />
          <h1 className="text-2xl font-bold text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full border px-3 py-2 rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 rounded flex justify-center items-center"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
            </button>

            {err && (
              <p className="text-red-500 text-sm mt-2 text-center bg-red-50 py-1 rounded">
                {err}
              </p>
            )}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              required
              className="w-full border px-3 py-2 rounded mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 rounded flex justify-center items-center"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
            </button>

            {err && (
              <p className="text-red-500 text-sm mt-2 text-center bg-red-50 py-1 rounded">
                {err}
              </p>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <input
              type="password"
              placeholder="New Password"
              required
              className="w-full border px-3 py-2 rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full border px-3 py-2 rounded mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 rounded flex justify-center items-center"
            >
              {loading ? <ClipLoader size={20} color="#fff" /> : "Reset Password"}
            </button>

            {err && (
              <p className="text-red-500 text-sm mt-2 text-center bg-red-50 py-1 rounded">
                {err}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;