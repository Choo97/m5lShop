import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../config';
import { FaUserCircle, FaEye, FaTag } from 'react-icons/fa';
import '../App.css'; // 커스텀 CSS 필요

const StylingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [styling, setStyling] = useState(null);

  useEffect(() => {
    axios.get(`${baseUrl}/api/styling/${id}`)
      .then(res => setStyling(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // 이미지 URL 처리
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/50";
    return path.startsWith('http') ? path : `${baseUrl}${path}`;
  };

  if (!styling) return <div className="text-center py-5">Loading...</div>;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {/* 왼쪽: 스타일링 이미지 */}
        <Col lg={7} md={6} className="mb-4">
          <div className="bg-light d-flex align-items-center justify-content-center rounded overflow-hidden" style={{ minHeight: '500px', maxHeight: '700px' }}>
            <img 
              src={getImageUrl(styling.imageUrl)} 
              alt="Styling Detail" 
              className="img-fluid"
              style={{ maxHeight: '700px', objectFit: 'contain' }}
            />
          </div>
        </Col>

        {/* 오른쪽: 정보 영역 */}
        <Col lg={5} md={6}>
          <div className="ps-md-3">
            
            {/* 1. 작성자 정보 */}
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
              <img 
                src={getImageUrl(styling.profileImage)} 
                alt="Profile" 
                className="rounded-circle border me-3"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="fw-bold mb-0">{styling.nickname}</h5>
                <span className="text-muted small">{styling.date} · 조회 {styling.viewCount}</span>
              </div>
            </div>

            {/* 2. 내용 */}
            <div className="mb-5">
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '1.05rem' }}>
                {styling.content}
              </p>
            </div>

            {/* 3. 태그된 상품 리스트 */}
            {styling.tags && styling.tags.length > 0 && (
              <Card className="border-0 bg-light">
                <CardBody>
                  <h6 className="fw-bold mb-3">
                    <FaTag className="me-2 text-primary" />
                    착용 상품 정보 ({styling.tags.length})
                  </h6>
                  
                  <div className="d-flex flex-column gap-3">
                    {styling.tags.map((tag) => (
                      <div 
                        key={tag.productId} 
                        className="d-flex align-items-center bg-white p-2 rounded shadow-sm"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/product/${tag.productId}`)} // 상품 상세로 이동
                      >
                        {/* 상품 이미지가 DTO에 있다면 보여주면 좋음 (현재 TagResponse에는 없음 -> 추가 추천) */}
                        {/* <img src={getImageUrl(tag.imageUrl)} width="50" ... /> */}
                        
                        <div className="ms-2">
                          <div className="fw-bold text-truncate" style={{ maxWidth: '250px' }}>
                            {tag.name}
                          </div>
                          <div className="text-muted small">
                            {tag.price.toLocaleString()}원
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StylingDetail;