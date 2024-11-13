import React, { useEffect, useState } from "react";
import { auth, db } from "../Config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../Components/Navbar";
import Modal from "../Components/Modal";
import { collection, addDoc, Timestamp, getDocs, getDoc, doc } from "firebase/firestore";
import SweetAlert2 from 'react-sweetalert2';
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firebaseBlogs, setFirebaseBlogs] = useState([]);
  const [swalProps, setSwalProps] = useState({});
  const [user, setUser] = useState(null); // Store user info including username
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  

  // Function to open the modal if authenticated, otherwise show login alert
  const handleAddBlogClick = () => {
    if (isAuthenticated) {
      setIsModalOpen(true); // Open modal if authenticated
    } else {
      setSwalProps({
        show: true,
        title: "Please log in first!",
        text: "You need to be logged in to add a blog.",
        icon: "warning",
        confirmButtonText: "Log In",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      });
    }
  };

  // Handle SweetAlert confirmation to navigate to login page
  const handleSwalConfirm = () => {
    navigate("/login");
  };

  // Fetch blogs from Firestore
  const fetchBlogs = async () => {
    const tempBlogs = [];
    try {
      // const blogsRef = collection(db, 'blogs');

      // Fetch documents in the blogs subcollection

      const querySnapshot = await getDocs(collection(db, 'blogs'));
      // const querySnapsh = await getDocs(collection(db, `users/blogs${user.uid}`));
      // console.log(querySnapsh);
      
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        
        tempBlogs.push({ id: doc.id, ...doc.data() });
      });
      setFirebaseBlogs(tempBlogs); // Set all fetched blogs at once
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Fetch blogs once on component mount
  }, [fetchBlogs]);

  const userProfile = (userUid) => {
    console.log(userUid);
    
    navigate(`/profile/${userUid}`);
    
  }

  // Fetch authentication status and user data on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsAuthenticated(true); // User is authenticated
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            username: userDoc.data().dislayName, // Set username from Firestore
          });
          
        } else {
          console.log("No such user data found in Firestore.");
        }
      } else {
        setIsAuthenticated(false); // User is not authenticated
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  // const tempBlogs = []
  // async function getUserBlogs() {
  //   try {
      
  //     // Reference to the user's blogs subcollection
  //     const blogsRef = collection(db, `users/${user.uid}/blogs`);
      
  //     // Fetch documents in the blogs subcollection
  //     const querySnapshot = await getDocs(blogsRef);
      
  //     // Map through documents and extract data
  //     const blogs = querySnapshot.docs.map((doc) => {
  //       return {
  //         id: doc.id,     // Get document ID
  //         ...doc.data(),   // Get document data
  //       };
  //     });
  //     // console.log(doc.data());
  //     // tempBlogs.push({ id: doc.id, ...doc.data() });
  //     setFirebaseBlogs(blogs);

  //     console.log("User Blogs:", blogs);
      
  //     return blogs;
  //   } catch (error) {
  //     console.error("Error fetching blogs:", error);
  //     return [];
  //   }
  // }
  // useEffect(() => {
  //   if (user && user.uid) {
  //     getUserBlogs(user.uid)
  //       .then((blogs) => {
  //         console.log("User Blogs:", blogs);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user blogs:", error);
  //       });
  //   }
  // }, [user]); 

  // Example usage
  // getUserBlogs(user.uid).then((blogs) => {
  //   console.log("User Blogs:", blogs);
  // }).catch((error) => {
  //   console.error("Error fetching user blogs:", error);
  // });
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Blogs</h1>
          <button
            onClick={handleAddBlogClick}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Add Blog
          </button>
        </div>

        {/* Display user info */}
        {user && (
          <div className="text-xl mb-4">
            <p>Welcome, {user.username}!</p>
          </div>
        )}

        {/* Blog List */}
        <div>
          {firebaseBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">👤</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {blog.title}
                  </h2>
                  <p className="text-sm font-bold text-gray-500">
                    {blog.username} - {new Date(blog.timestamp?.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{blog.description}</p>
              <a onClick={() => navigate(`/profile/${blog.userUid}`)} href="#" className="text-indigo-600 hover:underline">
                See all from this user
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SweetAlert2 for login prompt */}
      <SweetAlert2
        {...swalProps}
        onConfirm={handleSwalConfirm} // Handle navigation on confirm
        onCancel={() => setSwalProps({ show: false })} // Close alert on cancel
      />

      {/* Modal for adding a blog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(title, description) => {
          console.log("Blog Title:", title);
          console.log("Blog Description:", description);
          setIsModalOpen(false);
        }}
        title="Add New Blog"
      />
    </div>
  );
}

export default HomePage;
