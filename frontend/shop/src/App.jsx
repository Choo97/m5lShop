import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './component/Login'
import Join from './component/Join'
import NoticeWrite from './component/NoticeWrite'
import HeaderNavbar from './component/Header'
import TestComponent from './component/TestComponent';

function App() {

  return (
    <>
      <HeaderNavbar/>
      {/* <TestComponent/> */}
      <Routes>
        <Route path='/noticeWrite' element={<NoticeWrite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
      </Routes>
    </>
  )
}

export default App
