import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardImg, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 조회는 비로그인도 가능
import { baseUrl } from '../config';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';
import { FaPlus, FaHeart } from 'react-icons/fa';
import '../App.css'; // .styling-card 효과 필요

const StylingList = () => {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [stylings, setStylings] = useState([]);

  useEffect(() => {
    // API 호출
    axios.get(`${baseUrl}/api/styling`)
      .then(res => setStylings(res.data.content)) // Page 객체이므로 .content
      .catch(err => console.error(err));
  }, []);

  // 이미지 URL 처리 헬퍼 (소셜/로컬 구분)
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/50";
    return path.startsWith('http') ? path : `${baseUrl}${path}`;
  };

 const handleWriteClick = () => {
    if (user.isLogined) {
      // 1. 로그인 상태면 -> 글쓰기 페이지로 이동
      navigate('/community/styling/write');
    } else {
      // 2. 비로그인 상태면 -> 알림 후 로그인 페이지로 이동
      navigate('/login');
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">STYLING</h2>
        <Button color="dark" onClick={handleWriteClick}>
          <FaPlus className="me-2" /> 스타일 올리기
        </Button>
      </div>

      <Row>
        {stylings.map((style) => (
          <Col md={4} sm={6} key={style.id} className="mb-4">
            <Card className="border-0 shadow-sm styling-card">
              <div className="position-relative overflow-hidden" style={{ borderRadius: '8px' }}>
                <CardImg 
                  top 
                  src={getImageUrl(style.imageUrl)} 
                  alt="style" 
                  className="styling-img-hover"
                  style={{ height: '400px', objectFit: 'cover' }} 
                />

                {/* ★ 추가: 태그된 상품이 있으면 우측 상단에 뱃지 표시 */}
                {style.tags && style.tags.length > 0 && (
                  <div className="position-absolute top-0 end-0 p-3">
                    <span className="badge bg-dark bg-opacity-75">
                      🛍️ {style.tags.length}
                    </span>
                  </div>
                )}
                
                {/* 오버레이: 유저 정보 */}
                <div className="card-img-overlay d-flex flex-column justify-content-end p-3 text-white" 
                     style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <img 
                        src={getImageUrl(style.profileImage)} 
                        alt="profile" 
                        className="rounded-circle me-2 border border-white"
                        style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                      />
                      <span className="fw-bold text-shadow">{style.nickname}</span>
                    </div>
                    {/* (선택사항) 좋아요 아이콘 등 */}
                    {/* <FaHeart /> */}
                  </div>
                  <p className="mt-2 mb-0 text-truncate small">{style.content}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StylingList;