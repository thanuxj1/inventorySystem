import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

import background from "../images/background.jpg";

export default function EmployeeLogin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/employee/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      if (res.ok) {
        if (data.isAdmin) {
          dispatch(signInSuccess(data));
          navigate("/login");
        } else {
          dispatch(signInSuccess(data));
          navigate("/main-admin-dashboard");
        }
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${background})` }}
      >
        {/* Transparent Gradient Overlay */}
        <div className="absolute inset-0 bg-purple-800 opacity-40"></div>
      </div>
      {/* Login Form */}
      <div className="relative z-10 bg-black bg-opacity-30 shadow-lg rounded-lg w-full max-w-md p-8">
        <h1 className="text-3xl text-center font-bold text-white mb-10">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            className="border border-purple-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-purple-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            style={{
              marginTop: "15px",
              color: "white",
              padding: "0.75rem 2rem",
              borderRadius: "9999px", // Fully rounded button
              border: "none",
              cursor: "pointer",// purple color with transparency
            }}
            className={ 
              loading ? "opacity-80 cursor-not-allowed bg-purple-400" : "hover:opacity-90 bg-purple-500"
            }
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
