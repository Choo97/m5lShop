import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom, initUser } from "./atoms";
import { myAxios } from './config';

import HeaderNavbar from "./component/Header";
import Footer from "./component/Footer";

// 인증 관련
import Login from "./component/Login";
import Signup from "./component/Signup";
import OAuth2RedirectHandler from "./component/OAuth2RedirectHandler";

// 메인 및 상품 관련
import Main from "./component/Main";
import ProductList from "./component/ProductList";
import ProductDetail from "./component/ProductDetail";

// 개인화 서비스 (로그인 필요)
import Cart from "./component/Cart";
import OrderHist from "./component/OrderHist";
import Wishlist from "./component/Wishlist";
import MyPage from "./component/MyPage";

// 커뮤니티
import StylingList from "./component/StylingList";
import StylingDetail from "./component/StylingDetail";
import StylingWrite from "./component/StylingWrite";

// 채팅 컴포넌트
import ChatRoom from "./component/ChatRoom";

// 보안 라우트
import PrivateRoute from "./component/PrivateRoute";
import AdminRoute from "./component/AdminRoute";

// 관리자 전용
import AdminProductWrite from "./component/AdminProductWrite";
import AdminPage from "./component/AdminPage";
import AdminProductList from "./component/AdminProductList";
import AdminOrderList from "./component/AdminOrderList";
import AdminProductEdit from "./component/AdminProductEdit";
import AdminUserList from "./component/AdminUserList";
import AdminChatList from "./component/AdminChatList";
import AdminChatRoom from "./component/AdminChatRoom";

// CSS 및 Toast
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [user, setUser] = useAtom(userAtom);

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    console.log("App.js 상태 체크 - 토큰:", token ? "있음" : "없음", "로그인상태:", user.isLogined);

    // 1. [복구 로직] 토큰은 있는데, 상태가 '로그아웃'이라면? -> 서버에서 내 정보 가져오기
    if (token && !user.isLogined) {
      
      // Axios로 내 정보 요청
      myAxios.get(`/api/user/me`)
      .then(res => {
        const userData = res.data;
        console.log("✅ 유저 정보 복구 성공:", userData.nickname);

        // 받아온 정보로 Jotai 상태 업데이트
        setUser({
            id: userData.id,
            email: userData.email,
            nickname: userData.nickname,
            role: userData.role,
            profileImage: userData.profileImage,
            name: userData.name,
            phone: userData.phone,
            zipcode: userData.zipcode,
            address: userData.address,
            detailAddress: userData.detailAddress,
            gender: userData.gender,
            isLogined: true // 로그인 상태 true
        });
      })
      .catch(err => {
        console.error("❌ 유저 정보 로드 실패 (토큰 만료 등):", err);
        // 토큰이 유효하지 않으면 삭제하고 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(initUser);
      })
      .finally(() => {
        // 비동기 통신이 끝난 후 렌더링 허용
        setIsAuthChecked(true);
      });

      return; // 비동기 요청이 진행 중이므로, 아래 setIsAuthChecked(true)를 바로 실행하지 않음
    }

    // 2. [보안 로직] 상태는 로그인인데 토큰이 없으면? -> 강제 로그아웃
    if (user.isLogined && !token) {
      console.log("🚨 토큰 없음 -> 강제 로그아웃");
      setUser(initUser); 
    }

    // 위 1번(비동기)에 걸리지 않았을 때만 즉시 렌더링 허용
    setIsAuthChecked(true);

  }, [setUser, user.isLogined]);

  if (!isAuthChecked) {
    return <div className="text-center py-5">Loading...</div>;
  }

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
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />

          {/* 장바구니 */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          {/* 주문 내역 */}
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrderHist />
              </PrivateRoute>
            }
          />

          {/* 찜 목록 */}
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />

          {/* 스타일링 글쓰기 */}
          <Route
            path="/community/styling/write"
            element={
              <PrivateRoute>
                <StylingWrite />
              </PrivateRoute>
            }
          />

          {/* 관리자 메인 대시보드 */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />

          {/* ★ 채팅 페이지 추가 (로그인 필수) */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Container className="py-5 d-flex justify-content-center">
                  {/* 채팅방을 가운데 정렬해서 보여줌 */}
                  <ChatRoom />
                </Container>
              </PrivateRoute>
            }
          />

          {/* ★ 관리자 전용 라우트 (상품 등록) */}
          <Route
            path="/admin/product/new"
            element={
              <AdminRoute>
                <AdminProductWrite />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductList />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrderList />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/product/edit/:id"
            element={
              <AdminRoute>
                <AdminProductEdit />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUserList />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/chat"
            element={
              <AdminRoute>
                <AdminChatList />
              </AdminRoute>
            }
          />

          {/* 관리자 채팅방 (상세) */}
          <Route
            path="/admin/chat/:userId"
            element={
              <AdminRoute>
                <AdminChatRoom />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      {user.isLogined && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 9999,
            backgroundColor: "#222",
            color: "white",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
          onClick={() => (window.location.href = "/chat")} // 또는 navigate 사용
        >
          💬
        </div>
      )}

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
