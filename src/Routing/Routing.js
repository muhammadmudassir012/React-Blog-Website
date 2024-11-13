import React, { useEffect,useState } from 'react'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import SignupPage from '../Pages/SignupPage'
import LoginPage from '../Pages/LoginPage'
import HomePage from '../Pages/HomePage'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../Config/FirebaseConfig'
import ProfilePage from '../Pages/ProfilePage'
import UserProfilePage from '../Pages/UserProfilePage'

export default function Routing() {
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
    <div>
        <BrowserRouter>
        <Routes>
            {/* <Route path='/login' element={}/> */}
            {/* <Route path='/' element={authentication ? <HomePage/> : <Navigate to={'/signup'}/>}/> */}
            <Route path='/' element={<HomePage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/profile' element={<ProfilePage/>}/>
            <Route path='/profile/:userUid' element={<UserProfilePage/>}/>
            {/* <Route path='/profile' element={user ? <Profile/> : <Navigate to={'/profile'}/>}/> */}
        </Routes>
        </BrowserRouter>
        
        
    </div>
  )
}
