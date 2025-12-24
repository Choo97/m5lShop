import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import { FaStar, FaUserCircle, FaQuoteLeft } from 'react-icons/fa';
import { Card, CardBody, Modal, ModalBody, Row, Col, UncontrolledCarousel } from 'reactstrap';
import '../App.css'; 

const ProductReviews = ({ product }) => {
  const [reviews, setReviews] = useState([]);

  const [modal, setModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (product?.id) {
      axios.get(`${baseUrl}/api/reviews/product/${product.id}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("리뷰 로드 실패", err));
    }
  }, [product]);

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/50";
    
    // http로 시작하면(외부 이미지) 그대로 반환
    if (path.startsWith('http')) return path;
    
    // ★ 핵심: 한글 깨짐 방지를 위해 encodeURI()로 감싸줍니다.
    // 예: /images/코트.jpg -> /images/%EC%BD%94%ED%8A%B8.jpg 로 변환됨
    return `${baseUrl}${encodeURI(path)}`;
  };

  // 모달 열기 함수
  const openModal = (review) => {
    setSelectedReview(review);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setSelectedReview(null);
  };

  // 별점 렌더링 헬퍼
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar key={i} color={i < rating ? "#FFD700" : "#eee"} size={14} />
    ));
  };

  const carouselItems = selectedReview?.imgUrls.map((url, idx) => ({
    src: getImageUrl(url),
    altText: `Review Image ${idx}`,
    key: idx,
    caption: '' // 캡션 없음
  })) || [];

  return (
    <div className="mt-5 pt-5 border-top">
      <h4 className="fw-bold mb-4">리뷰</h4>
      
      {/* 리뷰 리스트 (기존과 동일) */}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review.id} className="mb-3 border-0 bg-light">
            <CardBody>
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <span className="fw-bold me-2">{review.writer}</span>
                  <span className="text-muted small">{review.writeDate}</span>
                </div>
                <div>{renderStars(review.rating)}</div>
              </div>
              <p className="mb-3 text-secondary" style={{ fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{review.content}</p>

              {/* 썸네일 클릭 시 openModal에 review 객체 전달 */}
              {review.imgUrls && review.imgUrls.length > 0 && (
                <div 
                  className="position-relative d-inline-block" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => openModal(review)}
                >
                  <img 
                    src={getImageUrl(review.imgUrls[0])} 
                    alt="Thumb" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  {review.imgUrls.length > 1 && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      +{review.imgUrls.length - 1}
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        ))
      ) : (
        <div className="text-center py-4 text-muted">아직 작성된 리뷰가 없습니다.</div>
      )}

      {/* ★ 개선된 모달 (Split Layout) */}
      {selectedReview && (
        <Modal isOpen={modal} toggle={closeModal} size="xl" centered contentClassName="review-modal-content">
          <ModalBody className="p-0">
            <Row className="m-0" style={{ minHeight: '600px' }}>
              
              {/* 왼쪽: 이미지 슬라이더 (검은 배경) */}
              <Col md={8} className="p-0 bg-black d-flex align-items-center justify-content-center position-relative">
                <div style={{ width: '100%', maxHeight: '600px' }}>
                   {carouselItems.length > 0 ? (
                      <UncontrolledCarousel items={carouselItems} interval={false} />
                   ) : (
                      <div className="text-white">이미지가 없습니다.</div>
                   )}
                </div>
              </Col>

              {/* 오른쪽: 정보 영역 (흰 배경) */}
              <Col md={4} className="p-4 bg-white d-flex flex-column">
                
                {/* 1. 상품 간단 정보 */}
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                  <img src={getImageUrl(product.imageUrl)} alt="prod" style={{ width: '50px', height: '60px', objectFit: 'cover', marginRight: '10px', borderRadius:'4px' }} />
                  <div>
                    <div className="small text-muted">{product.category.toUpperCase()}</div>
                    <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{product.name}</div>
                  </div>
                </div>

                {/* 2. 사용자 정보 */}
                <div className="d-flex align-items-center mb-3">
                  <FaUserCircle size={30} color="#ddd" className="me-2" />
                  <div>
                    <div className="fw-bold">{selectedReview.writer}</div>
                    <div className="text-muted small">{selectedReview.writeDate}</div>
                  </div>
                </div>

                {/* 3. 별점 */}
                <div className="mb-3">
                  {renderStars(selectedReview.rating)}
                </div>

                {/* 4. 리뷰 내용 (스크롤 가능하게) */}
                <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '300px' }}>
                  <FaQuoteLeft color="#eee" size={24} className="mb-2" />
                  <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#333' }}>
                    {selectedReview.content}
                  </p>
                </div>

                {/* 닫기 버튼 (모바일 등 편의성) */}
                <div className="mt-3 text-end">
                   <button className="btn btn-outline-dark btn-sm" onClick={closeModal}>닫기</button>
                </div>

              </Col>
            </Row>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
};

export default ProductReviews;