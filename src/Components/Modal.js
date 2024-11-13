import React, { useEffect, useState } from 'react';
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
import { auth, db } from "../Config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import Swal from "sweetalert2";

const Modal = ({ isOpen, onClose, onSubmit, title }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [user, setUser] = useState(null); // Store user info including username
  const [blogDescription, setBlogDescription] = useState('');
  const [authentication, setAuthentication] = useState(true);
  const [userUid, setUserUid] = useState(null);

  // Unconditionally call useEffect and add conditional logic inside it
  useEffect(() => {
    if (isOpen) {
      // Only perform the auth check when the modal is open
      onAuthStateChanged(auth, async (user) => {
        if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUser({
              uid: user.uid,
              email: user.email,
              username: userDoc.data().dislayName, // Set username from Firestore
            });
            console.log(userDoc.data());
            
          } else {
            console.log("No such user data found in Firestore.");
          }
          console.log("user signed in", user.uid);
          setAuthentication(true);
          setUserUid(user.uid)
        } else {
          console.log("user signed out");
          setAuthentication(false);
        }

      });
    }
  }, [isOpen]); // Dependency array includes isOpen to run this effect when modal is opened or closed

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogId = doc(collection(db, 'blogs')).id;
    try {
      await setDoc(doc(db, `users/${user.uid}/blogs/${blogId}`), {
        title: blogTitle,
        description: blogDescription,
        username: user.username,
        userUid: user.uid,
        date: new Date().toLocaleDateString(),
        timestamp: Timestamp.fromDate(new Date()),
      });
      await setDoc(doc(db, `blogs/${blogId}`), {
        title: blogTitle,
        description: blogDescription,
        username: user.username,
        userUid: user.uid,
        date: new Date().toLocaleDateString(),
        timestamp: Timestamp.fromDate(new Date()),
      });
      Swal.fire({
        icon: "success",
        title: "Blog Added",
        text: "Your Blog has been Added Successfully!",
      });
      setBlogTitle("");
      setBlogDescription("");
    } catch (error) {
      console.error("Error adding blog post:", error);
      alert("Error adding blog post!");
    }
    onClose();
  };

  // If modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg mx-4 md:mx-0">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Blog Title</label>
            <input
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter blog title"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Blog Description</label>
            <textarea
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              placeholder="Enter blog description"
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
