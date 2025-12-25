import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl, myAxios } from '../config';
import { FaTrashAlt, FaPaperPlane, FaTag } from 'react-icons/fa';
import '../App.css'; // 커스텀 CSS 필요
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';
import { toast } from 'react-toastify';

const StylingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [styling, setStyling] = useState(null);
  const user = useAtomValue(userAtom);
  const [comment, setComment] = useState(''); // 댓글 입력 상태

  // 댓글 등록 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user.isLogined) return toast.info("로그인이 필요합니다.");
    if (!comment.trim()) return;

    try {
      await myAxios.post(`/api/styling/${id}/comment`, { content: comment });
      setComment('');
      fetchDetail(); // 댓글 등록 후 목록 새로고침 (함수로 분리 필요)
    } catch (err) {
      toast.error("댓글 등록 실패");
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await myAxios.delete(`/api/styling/comment/${commentId}`);
      fetchDetail(); // 목록 새로고침
    } catch (err) {
      toast.error("삭제 실패");
    }
  };

  // 데이터 불러오기 함수 (재사용을 위해 분리)
  const fetchDetail = () => {
    // myAxios가 알아서 토큰(있으면)과 BaseURL을 처리해줍니다.
    myAxios.get(`/api/styling/${id}`)
      .then(res => {
        setStyling(res.data);
      })
      .catch(err => {
        console.error("상세 조회 에러:", err);
        toast.error("게시글을 불러오지 못했습니다.");
        navigate('/community/styling'); // 에러 시 목록으로 이동
      });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  // 이미지 URL 처리
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/50";

    // http로 시작하면(외부 이미지) 그대로 반환
    if (path.startsWith('http')) return path;

    // ★ 핵심: 한글 깨짐 방지를 위해 encodeURI()로 감싸줍니다.
    // 예: /images/코트.jpg -> /images/%EC%BD%94%ED%8A%B8.jpg 로 변환됨
    return `${baseUrl}${encodeURI(path)}`;
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
          <div className="ps-md-3 d-flex flex-column" style={{ height: '100%'}}>

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
            {/* 4. 댓글 입력 및 목록 */}
             <hr className="my-4" />

            {/* ★ 댓글 영역 (스크롤 가능하게) */}
            <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '300px' }}>
              <h6 className="fw-bold mb-3">댓글 ({styling.comments ? styling.comments.length : 0})</h6>
              
              {styling.comments && styling.comments.map((cmt) => (
                <div key={cmt.id} className="d-flex mb-3">
                  <img 
                    src={getImageUrl(cmt.profileImage)} 
                    alt="user" 
                    className="rounded-circle me-2" 
                    style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                  />
                  <div className="w-100 bg-light p-2 rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold small">{cmt.nickname}</span>
                      <div className="d-flex align-items-center">
                        <span className="text-muted extra-small me-2" style={{fontSize: '0.75rem'}}>{cmt.date}</span>
                        {/* 본인 댓글이면 삭제 버튼 표시 */}
                        {cmt.isOwner && (
                          <FaTrashAlt 
                            className="text-secondary" 
                            style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                            onClick={() => handleDeleteComment(cmt.id)} 
                          />
                        )}
                      </div>
                    </div>
                    <p className="mb-0 small text-break">{cmt.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ★ 댓글 입력창 */}
            <div className="mt-auto">
              <form onSubmit={handleCommentSubmit} className="position-relative">
                <input 
                  type="text" 
                  className="form-control pe-5" 
                  placeholder={user.isLogined ? "댓글을 입력하세요..." : "로그인이 필요합니다."}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={!user.isLogined}
                />
                <button 
                  type="submit" 
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-dark"
                  disabled={!user.isLogined || !comment.trim()}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default StylingDetail;