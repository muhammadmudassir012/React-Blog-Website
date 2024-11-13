import { collection, deleteDoc, deleteField, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../Config/FirebaseConfig";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from "react-sweetalert2";
import { onAuthStateChanged } from "firebase/auth";
import Modal from "../Components/Modal";
import EditModal from "../Components/EditModal";
import Swal from "sweetalert2";


function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firebaseBlogs, setFirebaseBlogs] = useState([]);
  const [userUid, setUserUid] = useState([]);
  const [blog,setBlog] = useState([])

  
  const check = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(uid);
        setUserUid(uid);
        console.log("user signed in");
        // ...
      } else {
        // User is signed out
        // ...
        console.log("user signed out");
      }
    });
  };

  const fetchBlogs = async () => {
    const tempBlogs = [];
    try {
      // const blogsRef = collection(db, 'blogs');

      // Fetch documents in the blogs subcollection

      const querySnapshot = await getDocs(
        collection(db, `users/${userUid}/blogs`)
      );
      querySnapshot.forEach((doc) => {
        console.log(doc.data());

        tempBlogs.push({ id: doc.id, ...doc.data() });
      });
      setFirebaseBlogs(tempBlogs); // Set all fetched blogs at once
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  const handleEditBlogClick = (blogs) => {
    setIsModalOpen(true); 
    console.log(blogs);
    setBlog(blogs)
    
    
  };

  const handleDelete = async (blog) => {

  // Reference to the specific blog document
  const blogRef = doc(db, `users/${blog.userUid}/blogs/${blog.id}`);
  const blogDel = doc(db, `blogs/${blog.id}`);
  console.log(blog.userUid);
  console.log(blog.id);
  

  try {
    // Delete the blog document
    await deleteDoc(blogRef);
    await deleteDoc(blogDel);
    Swal.fire({
      icon: "success",
      title: "Delete Successful",
      text: "Blog Deleted Successfully!",
    });
    console.log(`Blog with ID ${blog.id} deleted successfully.`);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text: error.message,
    });
    console.error("Error deleting document:", error);
  }


  };

  useEffect(() => {
    check();
    fetchBlogs();
  }, [userUid,fetchBlogs,check]);

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
        {/* <div className="text-2xl font-bold text-gray-800 mb-4">
            <p> {firebaseBlogs[0].username}</p>
          </div> */}

        {/* Blog List */}
        <div>
          {firebaseBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">👤</span>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {blog.title}
                  </h2>
                  <p className="text-sm font-bold text-gray-500">
                    {blog.username} -{" "}
                    {new Date(
                      blog.timestamp?.seconds * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{blog.description}</p>
              <div className="flex gap-3 ">
                <button
                  onClick={()=> handleEditBlogClick(blog)}
                  className="text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={()=> handleDelete(blog)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
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
      <EditModal
        isOpen={isModalOpen}
        blog={blog}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(title, description) => {
          console.log("Blog Title:", title);
          console.log("Blog Description:", description);
          setIsModalOpen(false);
          
        }}
        title="Edit Blog"
      />
    </div>
  );
}

export default ProfilePage;
