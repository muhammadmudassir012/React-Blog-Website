import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../Config/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { doc, setDoc } from "firebase/firestore"; 

export default function SignupPage() {
  const [usernameText, setUsernameText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsernameText(e.target.value);
  const handleEmailChange = (e) => setEmailText(e.target.value);
  const handlePasswordChange = (e) => setPasswordText(e.target.value);

  const signup = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailText, passwordText);
      const user = userCredential.user;
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Your account has been successfully created!",
      });

      // Store additional user info in Firestore (optional)
      await setDoc(doc(db, "users", user.uid ), {
        uid: user.uid,
        dislayName: usernameText,
        email: user.email,
        createdAt: new Date(),
      });

      // Show success alert and navigate to home
      
      navigate("/");
    } catch (error) {
      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Sign Up</h1>

        <form onSubmit={signup}>
        <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Username</label>
            <input
              onChange={handleUsernameChange}
              value={usernameText}
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              onChange={handleEmailChange}
              value={emailText}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              onChange={handlePasswordChange}
              value={passwordText}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
