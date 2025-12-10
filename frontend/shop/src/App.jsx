import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './component/Login'
import Join from './component/Join'
import NoticeWrite from './component/NoticeWrite'
import HeaderNavbar from './component/Header'
import TestComponent from './component/TestComponent';
import Main from './component/Main';
import Footer from './component/Footer';
import Signup from './component/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OAuth2RedirectHandler from './component/OAuth2RedirectHandler'; // 컴포넌트 이름은 자유

function App() {

  return (
    <>
      <HeaderNavbar />
      {/* <TestComponent/> */}
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/noticeWrite' element={<NoticeWrite />} />
        <Route path="/token" element={<OAuth2RedirectHandler />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
      <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </>
  )
}

export default App
