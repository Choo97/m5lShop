import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './component/Login'
import NoticeWrite from './component/NoticeWrite'
import HeaderNavbar from './component/Header'
import Main from './component/Main';
import Footer from './component/Footer';
import Signup from './component/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OAuth2RedirectHandler from './component/OAuth2RedirectHandler'; // 컴포넌트 이름은 자유
import ProductList from './component/ProductList';
import ProductDetail from './component/ProductDetail';
import Cart from './component/Cart';
import OrderHist from './component/OrderHist';
import MyPage from './component/MyPage';
import StylingList from './component/StylingList';
import StylingWrite from './component/StylingWrite';
import StylingDetail from './component/StylingDetail';

function App() {

  return (
    <>
      <HeaderNavbar />
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path="/token" element={<OAuth2RedirectHandler />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/noticeWrite' element={<NoticeWrite />} />
        <Route path='/products' element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<OrderHist />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/community/styling" element={<StylingList />} />
        <Route path="/community/styling/write" element={<StylingWrite />} />
        <Route path="/community/styling/:id" element={<StylingDetail />} />
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
