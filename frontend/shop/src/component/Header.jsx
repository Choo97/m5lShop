import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col
} from 'reactstrap';
import { FaShoppingBag, FaHeart, FaUser } from 'react-icons/fa'; // 아이콘
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // 위에 정의한 CSS
import './Header.css';
import { useAtom } from 'jotai';
import { initUser, userAtom } from '../atoms';

const HeaderNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAtom(userAtom); // 저장된 user 정보 가져오기

  // 인증이 필요한 메뉴 클릭 핸들러
  const handleAuthNavigation = (path) => {
    if (user?.isLogined) {
      navigate(path);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {

    setUser(initUser);
    localStorage.removeItem('accessToken');
    navigate('/');

  };

  return (
    <header className="sticky-top">
      <div className="custom-navbar">
        <Container fluid>

          <Row className="align-items-center mb-3">
            <Col xs="6">
              <Link to="/" className="logo-text">
                MINIMAL SHOP
              </Link>
            </Col>

            <Col xs="6" className="d-flex justify-content-end align-items-center">

              {user?.isLogined && (
                <span className="me-3 d-none d-md-block" style={{ fontSize: '0.9rem', color: '#555' }}>
                  <b>{user.nickname}</b>님
                </span>
              )}


              <div
                className="icon-btn"
                onClick={() => handleAuthNavigation('/cart')}
                title="장바구니"
              >
                <FaShoppingBag />
              </div>

              <div
                className="icon-btn"
                onClick={() => handleAuthNavigation('/wishlist')}
                title="찜목록"
              >
                <FaHeart />
              </div>

              <div
                className="icon-btn"
                onClick={() => handleAuthNavigation('/mypage')}
                title={user?.isLogined ? "마이페이지" : "로그인"}
              >
                <FaUser />
              </div>

              {user?.isLogined && (
                <div
                  className="icon-btn"
                  onClick={handleLogout}
                  title="로그아웃"
                  style={{ marginLeft: '1.5rem', color: '#888' }} // 약간 연하게 처리
                >
                  <FaSignOutAlt />
                </div>
              )}
            </Col>
          </Row>

          <Row>
            <Col>
              <Nav className="nav-bottom-row">

                <UncontrolledDropdown nav inNavbar className="me-3">
                  <DropdownToggle nav caret className="nav-link-custom">
                    PRODUCTS
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => navigate('/products/tops')}>상의 (Tops)</DropdownItem>
                    <DropdownItem onClick={() => navigate('/products/outer')}>아우터 (Outer)</DropdownItem>
                    <DropdownItem onClick={() => navigate('/products/bottoms')}>하의 (Bottoms)</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={() => navigate('/products/best')}>인기상품 (Best)</DropdownItem>
                    <DropdownItem onClick={() => navigate('/products/sale')} className="text-danger">할인상품 (Sale)</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret className="nav-link-custom">
                    COMMUNITY
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={() => navigate('/community/styling')}>스타일링 게시판</DropdownItem>
                    <DropdownItem onClick={() => navigate('/community/notice')}>공지사항</DropdownItem>
                    <DropdownItem onClick={() => navigate('/community/qna')}>Q&A 게시판</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

              </Nav>
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  );
};

export default HeaderNavbar;