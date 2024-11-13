import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../Config/FirebaseConfig';
import Navbar from '../Components/Navbar';
import { useNavigate } from "react-router-dom";
import SweetAlert2 from 'react-sweetalert2';

function UserProfilePage() {
  const [firebaseBlogs, setFirebaseBlogs] = useState([]);
    const { userUid } = useParams();
    console.log(userUid);
    const fetchBlogs = async () => {
        const tempBlogs = [];
        try {
          // const blogsRef = collection(db, 'blogs');
    
          // Fetch documents in the blogs subcollection
    
          const querySnapshot = await getDocs(collection(db, `users/${userUid}/blogs`));
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
        console.log(firebaseBlogs);
        
      }, []);

      

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        {/* <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Blogs</h1>
          <button
            onClick={handleAddBlogClick}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Add Blog
          </button>
        </div> */}

        {/* Display user info */}
        <div className="text-2xl font-bold text-gray-800 mb-4">
            <p> {firebaseBlogs[0]?.username}</p>
          </div>

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
            </div>
          ))}
        </div>
      </div>

      {/* SweetAlert2 for login prompt */}
      {/* <SweetAlert2
        {...swalProps}
        onConfirm={handleSwalConfirm} // Handle navigation on confirm
        onCancel={() => setSwalProps({ show: false })} // Close alert on cancel
      /> */}

      {/* Modal for adding a blog */}
      {/* <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(title, description) => {
          console.log("Blog Title:", title);
          console.log("Blog Description:", description);
          setIsModalOpen(false);
        }}
        title="Add New Blog"
      /> */}
    </div>
  )
}

export default UserProfilePage
