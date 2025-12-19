import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../config';
import '../App.css';

const ProductList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 쿼리 파라미터에서 값 추출
  const category = searchParams.get('category'); // ex) outer, top
  const sub = searchParams.get('sub');           // ex) coat, hoodie
  const type = searchParams.get('type');         // ex) new, best, sale
  const keyword = searchParams.get('keyword'); 

  useEffect(() => {
    setLoading(true);
    // API 호출: 이전에 만든 QueryDSL 기반의 컨트롤러를 호출합니다.
    // URL 예시: /api/products?category=outer&sub=coat
    axios.get(`${baseUrl}/api/products`, {
      params: { 
        category, sub, type, keyword // 백엔드 컨트롤러에 type 처리 로직이 필요함
      }
    })
    .then(res => {
    console.log("상품 로드 성공", res.data);
      setProducts(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error("상품 로드 실패", err);
      setLoading(false);
    });
  }, [category, sub, type, keyword]); // 쿼리 파라미터가 바뀔 때마다 다시 실행

  // 제목 텍스트 결정 로직
  const getTitle = () => {
    if (keyword) return `SEARCH: "${keyword}"`; // 검색어 표시
    if (type) return type.toUpperCase();
    if (sub) return sub.toUpperCase();
    if (category) return category.toUpperCase();
    return "ALL PRODUCTS";
  };

  return (
    <Container className="py-5">
      {/* 상단 경로 (Breadcrumb) */}
      <Breadcrumb className="mb-4 small">
        <BreadcrumbItem><Link to="/" className="text-decoration-none text-muted">HOME</Link></BreadcrumbItem>
        {category && <BreadcrumbItem active>{category.toUpperCase()}</BreadcrumbItem>}
        {sub && <BreadcrumbItem active>{sub.toUpperCase()}</BreadcrumbItem>}
      </Breadcrumb>

      {/* 페이지 제목 및 상품 개수 */}
      <div className="d-flex justify-content-between align-items-end border-bottom pb-3 mb-5">
        <h2 className="fw-bold m-0">{getTitle()}</h2>
        <span className="text-muted small">총 {products.length}개의 상품</span>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : products.length > 0 ? (
        <Row>
          {products.map((product) => (
            <Col lg={3} md={4} sm={6} xs={6} key={product.id} className="mb-5">
              <div 
                className="product-card" 
                onClick={() => navigate(`/product/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="img-wrapper mb-3" style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="product-img w-100" 
                    style={{ height: '350px', objectFit: 'cover', transition: '0.3s' }}
                  />
                  {product.discountRate > 0 && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#ff4d4f', color: 'white', padding: '2px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {product.discountRate}%
                    </div>
                  )}
                  {product.isSoldOut && (
                    <div className="sold-out-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontWeight: 'bold' }}>
                      SOLD OUT
                    </div>
                  )}
                </div>
                
                <div className="product-info">
                  <div className="mb-1">
                    {product.colors && product.colors.map((color, idx) => (
                      <span key={idx} className="color-dot" style={{ backgroundColor: color, display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', marginRight: '4px', border: '1px solid #eee' }}></span>
                    ))}
                  </div>
                  <h6 className="mb-1 fw-bold text-truncate" style={{ fontSize: '0.95rem' }}>{product.name}</h6>
                  <div style={{ fontSize: '0.9rem' }}>
                    {product.discountRate > 0 ? (
                      <>
                        <span className="text-muted text-decoration-line-through me-2 small">{product.price.toLocaleString()}</span>
                        <span className="fw-bold">{product.salePrice.toLocaleString()}원</span>
                      </>
                    ) : (
                      <span className="fw-bold">{product.price.toLocaleString()}원</span>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 text-muted">
          해당 카테고리에 상품이 존재하지 않습니다.
        </div>
      )}
    </Container>
  );
};

export default ProductList;