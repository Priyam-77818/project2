import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice"; // ✅ FIXED

function SignIn() {
  const primaryColor = "#ff4d2d";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 NORMAL LOGIN
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );

      console.log("LOGIN:", res.data);

      // ✅ FIXED DISPATCH
      dispatch(setUserData(res.data));

      navigate("/");

    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE LOGIN
  const handleGoogleAuth = async () => {
    setErr("");

    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      const res = await axios.post(
        `${serverUrl}/api/auth/google-login`,
        {
          token,
          role: "user",
          mobile: "0000000000",
        },
        { withCredentials: true }
      );

      console.log("GOOGLE LOGIN:", res.data);

      // ✅ FIXED DISPATCH
      dispatch(setUserData(res.data));

      navigate("/");

    } catch (error) {
      const message =
        error.response?.data?.message || "Google login failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2 text-[#ff4d2d]">
          QuickBite
        </h1>

        <p className="text-gray-600 mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSignIn}>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full mb-3 px-3 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              className="w-full px-3 py-2 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right mb-4">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-sm cursor-pointer text-[#ff4d2d]"
            >
              Forgot Password?
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff4d2d] text-white py-2 rounded-lg flex justify-center items-center"
          >
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Sign In"
            )}
          </button>

          {/* ERROR MESSAGE */}
          {err && (
            <p className="text-red-500 text-sm mt-2 text-center bg-red-50 py-1 rounded">
              {err}
            </p>
          )}

        </form>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg py-2"
        >
          {loading ? (
            <ClipLoader size={18} />
          ) : (
            <>
              <FcGoogle />
              <span>Sign in with Google</span>
            </>
          )}
        </button>

        {/* REDIRECT */}
        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#ff4d2d]">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;