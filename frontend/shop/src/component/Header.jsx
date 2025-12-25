import React, { useState } from 'react';
import {
  Navbar, Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
  Container, Row, Col, Input, InputGroup
} from 'reactstrap';
import { FaShoppingBag, FaHeart, FaUser, FaSignOutAlt, FaSuitcaseRolling } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom, initUser } from '../atoms';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import './Header.css';
import { FaSearch } from 'react-icons/fa'; // 돋보기 아이콘
import { toast } from 'react-toastify';

const HeaderNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    // 한글 입력 중(조합 중)이면 이벤트 무시 (엔터 키 중복 실행 방지)
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      if (keyword.trim() === '') return;
      navigate(`/products?keyword=${keyword}`);
      setKeyword('');
      // 입력창 포커스 해제 (선택사항)
      e.target.blur();
    }
  };

  // 1. 상품 카테고리 데이터 (code 추가: 쿼리 파라미터용)
  const productCategories = [
    {
      label: '아우터',
      code: 'outer',
      subItems: [
        { name: '코트', code: 'coat' },
        { name: '블레이저', code: 'blazer' },
        { name: '자켓', code: 'jacket' },
        { name: '패딩', code: 'padding' },
        { name: '가디건', code: 'cardigan' },
      ]
    },
    {
      label: '상의',
      code: 'top',
      subItems: [
        { name: '긴팔 티셔츠', code: 'long-sleeve' },
        { name: '반팔 티셔츠', code: 'short-sleeve' },
        { name: '맨투맨', code: 'sweatshirt' },
        { name: '후드', code: 'hoodie' },
      ]
    },
    {
      label: '하의',
      code: 'bottom',
      subItems: [
        { name: '청바지', code: 'jeans' },
        { name: '슬랙스', code: 'slacks' },
        { name: '면바지', code: 'cotton' },
        { name: '반바지', code: 'shorts' },
      ]
    },
    {
      label: '신발',
      code: 'shoes',
      subItems: []
    }
  ];

  // 2. 커뮤니티 메뉴 데이터
  const communityItems = [
    { name: '스타일', path: '/community/styling', needAuth: false },
    { name: '공지사항', path: '/community/notice', needAuth: false },
    { name: '리뷰', path: '/community/reviews', needAuth: false },
    { name: '1:1 문의', path: '/community/inquiry', needAuth: true }, // 로그인 필요
  ];

  // 인증 체크 후 이동 핸들러
  const handleAuthNavigation = (path) => {
    if (user.isLogined) {
      navigate(path);
    } else {
      navigate('/login');

    }
  };

  // 로그아웃 핸들러
  const handleLogout = () => {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(initUser);
    toast.info("로그아웃 되었습니다.");
    navigate('/');

  };

  return (
    <header className="sticky-top">
      <div className="custom-navbar">
        <Container fluid>

          {/* --- Row 1: 로고 & 유저 아이콘 --- */}
          <Row className="align-items-center mb-2 mb-3">
            <Col xs={6} md={2}>
              <Link to="/" className="logo-text">
                MINIMAL SHOP
              </Link>
            </Col>
            <Col md={5} className="d-none d-md-block">
              <div className="position-relative w-100">
                <Input
                  placeholder="검색어를 입력하세요"
                  className="border-0 border-bottom rounded-0 bg-transparent ps-0"
                  style={{ boxShadow: 'none' }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <FaSearch
                  className="position-absolute end-0 top-50 translate-middle-y text-muted"
                  style={{ cursor: 'pointer' }}
                  onClick={() => keyword.trim() && navigate(`/products?keyword=${keyword}`)}
                />
              </div>
            </Col>
            <Col xs={6} md={4} className="d-flex justify-content-end align-items-center">
              {user.isLogined && (
                <span className="me-3 d-none d-lg-block" style={{ fontSize: '0.9rem', color: '#555' }}>
                  <b>{user.nickname}, 님</b>
                </span>
              )}
              <div className="icon-btn" onClick={() => handleAuthNavigation('/cart')} title="장바구니"><FaShoppingBag /></div>
              <div className="icon-btn" onClick={() => handleAuthNavigation('/wishlist')} title="찜목록"><FaHeart /></div>
              <div className="icon-btn" onClick={() => handleAuthNavigation('/orders')} title="주문 내역"><FaSuitcaseRolling /></div>
              <div className="icon-btn" onClick={() => handleAuthNavigation('/mypage')} title={user.isLogined ? "마이페이지" : "로그인"}><FaUser /></div>
              {user.isLogined && (
                <div className="icon-btn" onClick={handleLogout} title="로그아웃" style={{ marginLeft: '1.5rem', color: '#888' }}><FaSignOutAlt /></div>
              )}
            </Col>
          </Row>

          {/* === [Row 1.5] 모바일 전용 검색창 (★ 모바일에서만 보임: d-md-none) === */}
          <Row className="mb-3 d-md-none">
            <Col xs={12}>
              <div className="position-relative w-100 bg-light rounded px-2">
                <Input 
                  placeholder="검색어를 입력하세요" 
                  className="border-0 bg-transparent" 
                  style={{ boxShadow: 'none' }}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearch}
                />
                <FaSearch 
                  className="position-absolute end-0 top-50 translate-middle-y text-muted me-3" 
                  onClick={() => keyword.trim() && navigate(`/products?keyword=${keyword}`)}
                />
              </div>
            </Col>
          </Row>

          {/* --- Row 2: 네비게이션 (상품 & 커뮤니티) --- */}
          <Row>
            <Col>
              <Nav className="nav-bottom-row align-items-center">

                {/* 1. 고정 메뉴 (NEW, BEST, SALE) - 쿼리 파라미터 적용 */}
                <NavItem>
                  <NavLink onClick={() => navigate('/products?type=new')} className="nav-link-custom fw-bold">신상품</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => navigate('/products?type=best')} className="nav-link-custom fw-bold">인기상품</NavLink>
                </NavItem>
                <NavItem className="me-4">
                  <NavLink onClick={() => navigate('/products?type=sale')} className="nav-link-custom fw-bold text-danger">할인상품</NavLink>
                </NavItem>

                <div className="d-none d-md-block" style={{ width: '1px', height: '15px', background: '#ddd', marginRight: '1.5rem' }}></div>

                {/* 2. 상품 카테고리 (Loop) */}
                {productCategories.map((cat) => (
                  cat.subItems.length > 0 ? (
                    <UncontrolledDropdown nav inNavbar key={cat.label} className="me-2">
                      <DropdownToggle nav caret className="nav-link-custom">
                        {cat.label}
                      </DropdownToggle>
                      <DropdownMenu>
                        {/* 대분류 클릭 시: /products?category=outer */}
                        <DropdownItem header onClick={() => navigate(`/products?category=${cat.code}`)}>
                          전체 {cat.label}
                        </DropdownItem>
                        <DropdownItem divider />
                        {/* 중분류 클릭 시: /products?category=outer&sub=coat */}
                        {cat.subItems.map((sub) => (
                          <DropdownItem
                            key={sub.code}
                            onClick={() => navigate(`/products?category=${cat.code}&sub=${sub.code}`)}
                          >
                            {sub.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  ) : (
                    <NavItem key={cat.label} className="me-2">
                      <NavLink onClick={() => navigate(`/products?category=${cat.code}`)} className="nav-link-custom">
                        {cat.label}
                      </NavLink>
                    </NavItem>
                  )
                ))}

                {/* 3. 커뮤니티 (새로 추가됨) */}
                <UncontrolledDropdown nav inNavbar className="ms-2">
                  <DropdownToggle nav caret className="nav-link-custom">
                    게시판
                  </DropdownToggle>
                  <DropdownMenu>
                    {communityItems.map((item) => (
                      <DropdownItem
                        key={item.name}
                        onClick={() => {
                          if (item.needAuth) {
                            handleAuthNavigation(item.path);
                          } else {
                            navigate(item.path);
                          }
                        }}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
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