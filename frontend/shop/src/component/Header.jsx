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

const HeaderNavbar = () => {
  const navigate = useNavigate();
  
  // 로그인 상태 관리 (실제로는 Context API나 Redux, API 호출로 관리)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 페이지 로드 시 로그인 상태 확인 (백엔드 API 연동 예시)
  useEffect(() => {
    // fetch('/api/users/status').then(res => res.json()).then(data => setIsLoggedIn(data.isLoggedIn));
    // 여기서는 테스트를 위해 false로 둡니다.
    setIsLoggedIn(false); 
  }, []);

  // 인증이 필요한 메뉴 클릭 핸들러
  const handleAuthNavigation = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/login');
    }
  };

  return (
    <header className="sticky-top">
      <div className="custom-navbar">
        <Container fluid>
          {/* 상단: 로고 및 아이콘 */}
          <Row className="align-items-center mb-3">
            <Col xs="6">
              <Link to="/" className="logo-text">
                MINIMAL SHOP
              </Link>
            </Col>
            
            <Col xs="6" className="d-flex justify-content-end align-items-center">
              {/* 장바구니 */}
              <div 
                className="icon-btn" 
                onClick={() => handleAuthNavigation('/cart')}
                title="장바구니"
              >
                <FaShoppingBag />
              </div>
              
              {/* 찜목록 */}
              <div 
                className="icon-btn" 
                onClick={() => handleAuthNavigation('/wishlist')}
                title="찜목록"
              >
                <FaHeart />
              </div>
              
              {/* 마이페이지 */}
              <div 
                className="icon-btn" 
                onClick={() => handleAuthNavigation('/mypage')}
                title="마이페이지"
              >
                <FaUser />
              </div>
            </Col>
          </Row>

          {/* 하단: 네비게이션 링크 (상품, 커뮤니티 등) */}
          <Row>
            <Col>
              <Nav className="nav-bottom-row">
                
                {/* 상품 네비게이션 (Dropdown) */}
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

                {/* 커뮤니티 네비게이션 (Dropdown) */}
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