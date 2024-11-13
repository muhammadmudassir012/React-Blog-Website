import React, { useEffect, useState } from 'react';
import { auth } from '../Config/FirebaseConfig'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate()

  const logout = () => {
    signOut(auth).then(() => {
      console.log("Sign-out successful.");
      Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been logged out successfully.",
      });
      navigate('/')
    // Sign-out successful.
  }).catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Logout Failed",
      text: error.message,
    });
      console.log('Logout Error',error);
      
    // An error happened.
  });
  }

  const [authentication, setAuthentication] = useState(true)
  useEffect(()=> {
    check()
  },[authentication])
  const check = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid);
        console.log("user signed in");
        setAuthentication(true)
        
        
        // ...
      } else {
        // User is signed out
        // ...
        console.log("user signed out");
        setAuthentication(false)
        
      }
    });
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-black">
          Blog Website
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <a onClick={(e) => {e.preventDefault();navigate('/')}} href="#home"  className="text-gray-600 hover:text-indigo-600">
            Home
          </a>
          <a onClick={(e) => {e.preventDefault()
            if(authentication){
              navigate('/profile')
            }
            else{
              navigate('/signup')
            }
          }} href="#about" className="text-gray-600 hover:text-indigo-600">
            {authentication ? "Profile" : "Signup"}
          </a>
          <a  onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              if (authentication) {
                logout(); // Run logout function if user is authenticated
              } else {
                navigate("/login"); // Navigate to login if user is not authenticated
              }
            }} 
            href="#services"
             className="text-gray-600 hover:text-indigo-600">
            {/* {authentication ? logout() : ""} */}
          {authentication ? "Logout" : "Login"}
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden bg-gray-50 border-t border-gray-200">
          <a href="#home" className="block px-4 py-2 text-gray-600 hover:bg-indigo-100">
            Home
          </a>
          <a onClick={(e) => {e.preventDefault()
            if(authentication){
              navigate('/profile')
            }
            else{
              navigate('/signup')
            }
          }}  href="#about" className="block px-4 py-2 text-gray-600 hover:bg-indigo-100">
          {authentication ? "Profile" : "Signup"}
          </a>
          <a  onClick={(e) => {
              e.preventDefault(); // Prevent default anchor behavior
              if (authentication) {
                logout(); // Run logout function if user is authenticated
              } else {
                navigate("/login"); // Navigate to login if user is not authenticated
              }
            }} 
            href="#services"
             className="text-gray-600 hover:text-indigo-600">
            {/* {authentication ? logout() : ""} */}
          {authentication ? "Logout" : "Login"}
          </a>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
