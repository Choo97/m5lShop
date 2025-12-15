import React, { useState, useEffect } from 'react';
import { Container, Row, Col, UncontrolledCarousel, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import '../App.css';
import adImage1 from '../images/빌보드에_소셜_거리_광고_Large.jpg';
import adImage2 from '../images/보도_게시물에_실물_광고판_Large.jpg';
import './Main.css';

// 캐러셀 더미 데이터 (광고)
const carouselItems = [
  {
    src: 'https://placehold.co/1152x648',
    altText: 'Spring Event',
    caption: '',
    header: '',
    key: '1'
  },
  {
    src: 'https://placehold.co/1152x648',
    altText: 'New Arrivals',
    caption: '',
    header: '',
    key: '2'
  },
];

const productDummy = {
  id: 1, name: 'Minimal Cotton Shirt', price: 45000, 
  imageUrl: 'https://placehold.co/600x400',
  colors: ['#000000', '#FFFFFF', '#87CEEB']
};

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

  // 데이터 로딩 (Mock Data 사용 예시)
  useEffect(() => {
    // 실제로는 axios.get('/api/main/products/special').then(...)
    
    // 더미 데이터 세팅
    const dummyProduct = {
      id: 1, name: 'Minimal Cotton Shirt', price: 45000, 
      imageUrl: 'https://placehold.co/600x400',
      colors: ['#000000', '#FFFFFF', '#87CEEB']
    };

    setSpecialProducts(Array(4).fill(dummyProduct));
    setNewProducts(Array(4).fill(dummyProduct));
    setAgeBestProducts(Array(4).fill(dummyProduct));
    
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
    // axios.get(`/api/main/products/best?age=${selectedAge}`)...
    // console.log(`Fetching best products for age: ${selectedAge}`);
  }, [selectedAge]);


  // 공통 상품 카드 컴포넌트
  const ProductCard = ({ product }) => (
    <Col md={3} sm={6} className="mb-4">
      <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.imageUrl} alt={product.name} className="product-img" />
        <div className="mt-2">
          <h6 className="mb-1 fw-bold">{product.name}</h6>
          <p className="mb-1 text-muted">{product.price.toLocaleString()}원</p>
          <div>
            {product.colors.map((color, idx) => (
              <span key={idx} className="color-dot" style={{ backgroundColor: color }}></span>
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
          <div className="section-title">
            <span>특가 상품</span>
            <Link to="/products/sale" className="view-all-link">전체보기 +</Link>
          </div>
          <Row>
            {specialProducts.map((p, idx) => <ProductCard key={idx} product={p} />)}
          </Row>
        </section>

        {/* 3. 신상품 리스트 */}
        <section className="main-section pt-0">
          <div className="section-title">
            <span>신상품</span>
            <Link to="/products/new" className="view-all-link">전체보기 +</Link>
          </div>
          <Row>
            {newProducts.map((p, idx) => <ProductCard key={idx} product={p} />)}
          </Row>
        </section>

        {/* 4. 연령대별 인기 상품 */}
        <section className="main-section" style={{ backgroundColor: '#F8F9FA', padding: '4rem 1rem', borderRadius: '8px' }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold mb-3">AGE BEST SELLERS</h3>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              {['10', '20', '30', '40', '50'].map((age) => (
                <button 
                  key={age}
                  className={`age-tab-btn ${selectedAge === age ? 'active' : ''}`}
                  onClick={() => setSelectedAge(age)}
                >
                  {age}대
                </button>
              ))}
            </div>
          </div>
          <Row>
            {ageBestProducts.map((p, idx) => <ProductCard key={idx} product={p} />)}
          </Row>
          <div className="text-center mt-4">
             <Link to={`/products/best?age=${selectedAge}`} className="btn btn-outline-dark btn-sm">
                {selectedAge}대 인기상품 더보기
             </Link>
          </div>
        </section>

        {/* 5. 스타일링 게시판 미리보기 */}
        <section className="main-section">
          <div className="section-title">
            <span>인기 스타일링</span>
            <Link to="/community/styling" className="view-all-link">스타일링 전체보기 +</Link>
          </div>
          <Row>
            {stylings.map((s, idx) => (
              <Col md={3} sm={6} key={idx} className="mb-4">
                <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => navigate(`/community/styling/${s.id}`)}>
                  <img src={s.imageUrl} alt={s.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
                  <div className="mt-2 d-flex justify-content-between">
                    <span className="fw-bold text-truncate">{s.title}</span>
                    <span className="text-muted small">@{s.username}</span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* 6. 상품 리뷰 리스트 */}
        <section className="main-section pt-0">
           <div className="section-title">
            <span>최신 리뷰</span>
            <Link to="/reviews" className="view-all-link">리뷰 전체보기 +</Link>
          </div>
          <Row>
            {reviews.map((r, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <div className="review-card">
                  <div className="d-flex align-items-center mb-3">
                    <img src={r.userProfileUrl} alt="user" className="review-profile-img me-2" />
                    <div>
                      <div className="fw-bold text-small">{r.userNickname}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{r.date}</div>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-3">
                    <img src={r.productImageUrl} alt="prod" style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '10px' }} />
                    <div>
                       <div className="fw-bold" style={{fontSize:'0.9rem'}}>{r.productName}</div>
                       <div className="text-warning">
                         {[...Array(5)].map((_, i) => (
                           <FaStar key={i} color={i < r.rating ? "#FFD700" : "#eee"} />
                         ))}
                       </div>
                    </div>
                  </div>

                  <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
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