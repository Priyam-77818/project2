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
import { setUserData } from "../redux/userSlice"; // ✅ FIX

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 🔐 NORMAL SIGNUP
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          mobile,
          role,
        },
        { withCredentials: true }
      );

      // ✅ FIXED DISPATCH
      dispatch(setUserData(res.data));

      navigate("/");

    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed";
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE SIGNUP
  const handleGoogleAuth = async () => {
    setErr("");

    if (!/^[0-9]{10}$/.test(mobile)) {
      return setErr("Enter valid 10-digit mobile number");
    }

    try {
      setLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      const res = await axios.post(
        `${serverUrl}/api/auth/google-login`,
        {
          token,
          mobile,
          role,
        },
        { withCredentials: true }
      );

      console.log("GOOGLE RESPONSE:", res.data);

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">

        <h1 className="text-3xl font-bold mb-2 text-orange-500">
          QuickBite
        </h1>

        <p className="text-gray-600 mb-6">
          Create your account
        </p>

        <form onSubmit={handleSignUp}>

          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full mb-3 px-3 py-2 border rounded-lg"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full mb-3 px-3 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mobile"
            required
            pattern="[0-9]{10}"
            className="w-full mb-3 px-3 py-2 border rounded-lg"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              minLength={6}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg flex justify-center items-center"
          >
            {loading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Sign Up"
            )}
          </button>

          {err && (
            <p className="text-red-500 text-sm mt-2 text-center bg-red-50 py-1 rounded">
              {err}
            </p>
          )}

        </form>

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full mt-3 border py-2 rounded-lg flex justify-center items-center gap-2"
        >
          {loading ? (
            <ClipLoader size={18} />
          ) : (
            <>
              <FcGoogle />
              <span>Sign up with Google</span>
            </>
          )}
        </button>

        <p className="text-center mt-4">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>

      </div>
    </div>
  );
}

export default SignUp;