import React, { useState, useEffect } from 'react';
import { Container, Row, Col, UncontrolledCarousel, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import banner1 from '../assets/광고배너1.jpg';
import banner2 from '../assets/광고배너2.jpg';
import '../App.css';
import './Main.css';
import { baseUrl } from '../config';

// 캐러셀 더미 데이터 (광고)
const carouselItems = [
  {
    src: banner1,
    altText: 'Spring Event',
    caption: '',
    header: '',
    key: '1'
  },
  {
    src: banner2,
    altText: 'New Arrivals',
    caption: '',
    header: '',
    key: '2'
  },
];

const Main = () => {
  const navigate = useNavigate();

  // 상태 관리 (나중에는 Jotai atoms로 분리 가능)
  const [specialProducts, setSpecialProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [ageBestProducts, setAgeBestProducts] = useState([]);
  const [stylings, setStylings] = useState([]);
  const [reviews, setReviews] = useState([]);

  // 연령대 선택 상태
  const [selectedAge, setSelectedAge] = useState('20'); // 기본 20대

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x400";
    
    // http로 시작하면(외부 이미지) 그대로 반환
    if (path.startsWith('http')) return path;
    
    // ★ 핵심: 한글 깨짐 방지를 위해 encodeURI()로 감싸줍니다.
    // 예: /images/코트.jpg -> /images/%EC%BD%94%ED%8A%B8.jpg 로 변환됨
    return `${baseUrl}${encodeURI(path)}`;
  };

  // 데이터 로딩 (Mock Data 사용 예시)
  useEffect(() => {
    // (1) 특가 상품 가져오기
    axios.get(`${baseUrl}/api/main/sale`)
      .then(res => {
        setSpecialProducts(res.data)
      })
      .catch(err => console.error("Special Products Load Error:", err));

    // (2) 신상품 가져오기
    axios.get(`${baseUrl}/api/main/new`)
      .then(res => {
        setNewProducts(res.data)
      })
      .catch(err => console.error("New Products Load Error:", err));

    // 더미 데이터 세팅
    const dummyProduct = {
      id: 1, name: 'Minimal Cotton Shirt', price: 45000,
      imageUrl: 'https://placehold.co/600x400',
      colors: ['#000000', '#FFFFFF', '#87CEEB']
    };

    // setSpecialProducts(Array(4).fill(dummyProduct));
    // setNewProducts(Array(4).fill(dummyProduct));
    // setAgeBestProducts(Array(4).fill(dummyProduct));

    setStylings(Array(4).fill({
      id: 1, title: 'Daily Look',
      imageUrl: 'https://placehold.co/400x600',
      username: 'fashion_king'
    }));

    setReviews(Array(3).fill({
      id: 1, productName: 'Wide Slacks', productImageUrl: 'https://placehold.co/400x600',
      content: '재질이 너무 좋고 핏이 딱 떨어져요. 배송도 빠릅니다.', rating: 5, date: '2023.12.01',
      userProfileUrl: 'https://placehold.co/240x240', userNickname: 'user123'
    }));

  }, []);

  // 연령대 변경 시 데이터 다시 로드
  useEffect(() => {
    axios.get(`${baseUrl}/api/main/best?age=${selectedAge}`)
      .then(res => setAgeBestProducts(res.data))
      .catch(err => console.error("Age Best Error:", err));
  }, [selectedAge]);

  // 공통 상품 카드 컴포넌트
  const ProductCard = ({ product }) => (
    <Col md={3} sm={6} className="mb-4">
      <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
        {/* getImageUrl 적용 */}
        <div className="img-wrapper position-relative">
          <img src={getImageUrl(product.imageUrl)} alt={product.name} className="product-img" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
          {/* 할인율 뱃지 */}
          {product.discountRate > 0 && (
            <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 small fw-bold">
              {product.discountRate}%
            </span>
          )}
        </div>
        <div className="mt-2">
          <h6 className="mb-1 fw-bold text-truncate">{product.name}</h6>
          <div className="d-flex align-items-center">
            {/* 할인 가격 표시 로직 */}
            {product.discountRate > 0 ? (
              <>
                <span className="text-decoration-line-through text-muted me-2 small">{product.price.toLocaleString()}</span>
                <span className="fw-bold text-danger">{product.salePrice.toLocaleString()}원</span>
              </>
            ) : (
              <span className="text-muted">{product.price.toLocaleString()}원</span>
            )}
          </div>
          <div className="mt-1">
            {product.colors && product.colors.map((color, idx) => (
              <span key={idx} className="color-dot" style={{ backgroundColor: color, display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', marginRight: '5px', border: '1px solid #ddd' }}></span>
            ))}
          </div>
        </div>
      </div>
    </Col>
  );

  return (
    <div className="main-page">

      {/* 1. 상단 캐러셀 (광고/이벤트) */}
      <section>
        <UncontrolledCarousel items={carouselItems} interval={4000} />
      </section>

      <Container>

        {/* 2. 특가 상품 리스트 */}
        <section className="main-section">
          <div className="section-title d-flex justify-content-between align-items-end mb-3">
            <span className="fw-bold h4">특가 상품</span>
            <Link to="/products?type=sale" className="view-all-link text-decoration-none text-muted">전체보기 +</Link>
          </div>
          <Row>
            {specialProducts.length > 0 ? (
              specialProducts.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="text-center py-5 text-muted w-100">등록된 특가 상품이 없습니다.</div>
            )}
          </Row>
        </section>

        {/* 3. 신상품 리스트 */}
        <section className="main-section pt-5">
          <div className="section-title d-flex justify-content-between align-items-end mb-3">
            <span className="fw-bold h4">신상품</span>
            <Link to="/products?type=new" className="view-all-link text-decoration-none text-muted">전체보기 +</Link>
          </div>
          <Row>
            {newProducts.length > 0 ? (
              newProducts.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="text-center py-5 text-muted w-100">등록된 신상품이 없습니다.</div>
            )}
          </Row>
        </section>

        {/* 4. 연령대별 인기 상품 */}
        <section className="main-section mt-5" style={{ backgroundColor: '#F8F9FA', padding: '4rem 1rem', borderRadius: '8px' }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-3">연령대별 인기 상품</h3>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              {[10, 20, 30, 40, 50].map((age) => (
                <button
                  key={age}
                  className={`age-tab-btn btn btn-outline-dark rounded-pill px-4 ${selectedAge === age ? 'active bg-dark text-white' : ''}`}
                  onClick={() => setSelectedAge(age)}
                >
                  {age}대
                </button>
              ))}
            </div>
          </div>
          <Row>
            {ageBestProducts.length > 0 ? (
              ageBestProducts.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="text-center py-5 text-muted w-100">해당 연령대의 인기 상품 데이터가 부족합니다.</div>
            )}
          </Row>
        </section>

        {/* 5. 스타일링 게시판 미리보기 */}
        <section className="main-section mt-5">
          <div className="section-title d-flex justify-content-between align-items-end mb-3">
            <span className="fw-bold h4">스타일</span>
            <Link to="/community/styling" className="view-all-link text-decoration-none text-muted">전체보기 +</Link>
          </div>
          <Row>
            {stylings.map((s, idx) => (
              <Col md={3} sm={6} key={idx} className="mb-4">
                <div className="position-relative overflow-hidden rounded" style={{ cursor: 'pointer' }} onClick={() => navigate(`/community/styling`)}>
                  <img src={getImageUrl(s.imageUrl)} alt={s.title} style={{ width: '100%', height: '300px', objectFit: 'cover', transition: 'transform 0.3s' }} className="hover-scale" />
                  <div className="mt-2 d-flex justify-content-between">
                    <span className="fw-bold text-truncate">{s.title}</span>
                    <span className="text-muted small">@{s.username}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* 6. 상품 리뷰 리스트 (더미) */}
        <section className="main-section pt-5 pb-5">
          <div className="section-title d-flex justify-content-between align-items-end mb-3">
            <span className="fw-bold h4">최근 리뷰</span>
            <Link to="/reviews" className="view-all-link text-decoration-none text-muted">전체보기 +</Link>
          </div>
          <Row>
            {reviews.map((r, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <div className="review-card border p-3 rounded h-100 bg-white shadow-sm">
                  <div className="d-flex align-items-center mb-3">
                    <img src={r.userProfileUrl} alt="user" className="review-profile-img me-2 rounded-circle" style={{ width: '40px', height: '40px' }} />
                    <div>
                      <div className="fw-bold text-small">{r.userNickname}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{r.date}</div>
                    </div>
                  </div>

                  <div className="d-flex mb-3 align-items-center">
                    <img src={r.productImageUrl} alt="prod" style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }} />
                    <div>
                      <div className="fw-bold text-truncate" style={{ fontSize: '0.9rem', maxWidth: '150px' }}>{r.productName}</div>
                      <div className="text-warning">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < r.rating ? "#FFD700" : "#eee"} size={12} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted text-truncate-2" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {r.content}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </section>

      </Container>
    </div>
  );
};

export default Main;