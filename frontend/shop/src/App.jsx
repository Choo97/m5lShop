import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom, initUser } from './atoms';
// 공통 레이아웃 (폴더명 component 로 변경)
import HeaderNavbar from './component/Header';
import Footer from './component/Footer';

// 인증 관련
import Login from './component/Login';       // LoginPage -> Login
import Signup from './component/Signup';     // SignupPage -> Signup
import OAuth2RedirectHandler from './component/OAuth2RedirectHandler';

// 메인 및 상품 관련
import Main from './component/Main';                 // MainPage -> Main
import ProductList from './component/ProductList';   // ProductListPage -> ProductList
import ProductDetail from './component/ProductDetail'; // ProductDetailPage -> ProductDetail

// 개인화 서비스 (로그인 필요)
import Cart from './component/Cart';             // CartPage -> Cart
import OrderHist from './component/OrderHist';   // OrderHistPage -> OrderHist
import Wishlist from './component/Wishlist';     // WishlistPage -> Wishlist
import MyPage from './component/MyPage';                 // MyPage -> My

// 커뮤니티
import StylingList from './component/StylingList';     // StylingListPage -> StylingList
import StylingDetail from './component/StylingDetail'; // StylingDetailPage -> StylingDetail
import StylingWrite from './component/StylingWrite';   // StylingWritePage -> StylingWrite

// 보안 라우트
import PrivateRoute from './component/PrivateRoute';

// CSS 및 Toast
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {

  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    // "로그인 상태라고 되어 있는데(isLogined: true), 토큰이 없다면?"
    if (user.isLogined && !token) {
      setUser(initUser); // ★ 강제 초기화 (세션 스토리지도 비워짐)
    }
  }, [setUser, user.isLogined]);



  return (
    <div className="App d-flex flex-column min-vh-100">
      <HeaderNavbar />

      <div className="flex-grow-1">
        <Routes>
          {/* ==========================================
                1. Public Routes (누구나 접근 가능)
               ========================================== */}
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/token" element={<OAuth2RedirectHandler />} />

          {/* 상품 조회 */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* 커뮤니티 조회 */}
          <Route path="/community/styling" element={<StylingList />} />
          <Route path="/community/styling/:id" element={<StylingDetail />} />


          {/* ==========================================
                2. Private Routes (로그인 필수)
                - PrivateRoute 컴포넌트로 감싸서 보호
               ========================================== */}

          {/* 마이페이지 */}
          <Route path="/mypage" element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          } />

          {/* 장바구니 */}
          <Route path="/cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />

          {/* 주문 내역 */}
          <Route path="/orders" element={
            <PrivateRoute>
              <OrderHist />
            </PrivateRoute>
          } />

          {/* 찜 목록 */}
          <Route path="/wishlist" element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          } />

          {/* 스타일링 글쓰기 */}
          <Route path="/community/styling/write" element={
            <PrivateRoute>
              <StylingWrite />
            </PrivateRoute>
          } />

        </Routes>
      </div>

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
    </div>
  );
}

export default App;