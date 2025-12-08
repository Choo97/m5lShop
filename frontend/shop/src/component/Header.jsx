import React from 'react';
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
import { FaShoppingBag, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom, initUser } from '../atoms';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import './Header.css';
import { toast } from 'react-toastify'; 

const HeaderNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);

  // 1. 상품 카테고리 데이터 (code 추가: 쿼리 파라미터용)
  const productCategories = [
    {
      label: 'OUTER',
      code: 'outer',
      subItems: [
        { name: 'Coat', code: 'coat' },
        { name: 'Blazer', code: 'blazer' },
        { name: 'Jacket', code: 'jacket' },
        { name: 'Padding', code: 'padding' },
        { name: 'Cardigan', code: 'cardigan' },
      ]
    },
    {
      label: 'TOP',
      code: 'top',
      subItems: [
        { name: 'Long Sleeve', code: 'long-sleeve' },
        { name: 'Short Sleeve', code: 'short-sleeve' },
        { name: 'Sweatshirt', code: 'sweatshirt' },
        { name: 'Hoodie', code: 'hoodie' },
      ]
    },
    {
      label: 'BOTTOM',
      code: 'bottom',
      subItems: [
        { name: 'Jeans', code: 'jeans' },
        { name: 'Slacks', code: 'slacks' },
        { name: 'Cotton', code: 'cotton' },
        { name: 'Shorts', code: 'shorts' },
      ]
    },
    {
      label: 'SHOES',
      code: 'shoes',
      subItems: []
    }
  ];

  // 2. 커뮤니티 메뉴 데이터
  const communityItems = [
    { name: '스타일링', path: '/community/styling', needAuth: false },
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

    setUser(initUser);
    localStorage.removeItem('accessToken');
    toast.info("로그아웃 되었습니다.");
    navigate('/');

  };

  return (
    <header className="sticky-top">
      <div className="custom-navbar">
        <Container fluid>

          {/* --- Row 1: 로고 & 유저 아이콘 --- */}
          <Row className="align-items-center mb-3">
            <Col xs="4">
              <Link to="/" className="logo-text">
                MINIMAL SHOP
              </Link>
            </Col>

            <Col xs="8" className="d-flex justify-content-end align-items-center">
              {user.isLogined && (
                <span className="me-3 d-none d-md-block" style={{ fontSize: '0.9rem', color: '#555' }}>
                  Hello, <b>{user.nickname}</b>
                </span>
              )}
              <div className="icon-btn" onClick={() => handleAuthNavigation('/cart')} title="장바구니"><FaShoppingBag /></div>
              <div className="icon-btn" onClick={() => handleAuthNavigation('/wishlist')} title="찜목록"><FaHeart /></div>
              <div className="icon-btn" onClick={() => handleAuthNavigation('/mypage')} title={user.isLogined ? "마이페이지" : "로그인"}><FaUser /></div>
              {user.isLogined && (
                <div className="icon-btn" onClick={handleLogout} title="로그아웃" style={{ marginLeft: '1.5rem', color: '#888' }}><FaSignOutAlt /></div>
              )}
            </Col>
          </Row>

          {/* --- Row 2: 네비게이션 (상품 & 커뮤니티) --- */}
          <Row>
            <Col>
              <Nav className="nav-bottom-row align-items-center">

                {/* 1. 고정 메뉴 (NEW, BEST, SALE) - 쿼리 파라미터 적용 */}
                <NavItem>
                  <NavLink onClick={() => navigate('/products?type=new')} className="nav-link-custom fw-bold">NEW</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => navigate('/products?type=best')} className="nav-link-custom fw-bold">BEST</NavLink>
                </NavItem>
                <NavItem className="me-4">
                  <NavLink onClick={() => navigate('/products?type=sale')} className="nav-link-custom fw-bold text-danger">SALE</NavLink>
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
                          All {cat.label}
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
                    COMMUNITY
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