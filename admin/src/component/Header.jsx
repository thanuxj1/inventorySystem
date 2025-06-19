import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import logo from "../images/logo.png";

import { signOutUserStart, deleteUserFailure, deleteUserSuccess, } from '../redux/user/userSlice';

import login from "./../images/log-in.png";
import profilePic from "./../images/user.png"; // Example profile picture

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/employee/signout', { method: 'POST' }); 
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <header className="bg-purple-300 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white hover:text-gray-200">
            Daniya Flora
          </Link>
        </div>

        {/* Right-side icons */}
        <div className="flex space-x-4 items-center">
          {/* Icons for notifications and settings */}
          <button className="text-white hover:text-gray-200">
            <i className="fas fa-bell"></i> {/* Example icon for notifications */}
          </button>

          <button className="text-white hover:text-gray-200">
            <i className="fas fa-cog"></i> {/* Example icon for settings */}
          </button>

          {/* Conditionally render Login or Profile based on login status */}
          {currentUser ? (
            <div className="relative">
              {/* Profile picture with dropdown */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 overflow-hidden focus:outline-none"
              >
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg z-50">
                  <div className="block px-4 py-2 hover:bg-gray-100">
                    <Link to="/profile" className="block">Profile</Link>
                  </div>
                  <div className="block px-4 py-2 hover:bg-gray-100">
                    <Link to="/settings" className="block">Settings</Link>
                  </div>
                  <div className="block px-4 py-2 hover:bg-gray-100">
                    <button
                      className="w-full text-left"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/">
              <div className="w-8 h-8 overflow-hidden">
                <img
                  src={login}
                  alt="Login"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
