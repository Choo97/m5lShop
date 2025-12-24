import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { myAxios, baseUrl } from '../config'; // config 경로 확인
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../App.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = () => {
    myAxios.get('/api/wish')
      .then(res => setWishes(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = async (wishId, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    if(!window.confirm("찜 목록에서 삭제하시겠습니까?")) return;

    try {
      await myAxios.delete(`/api/wish/${wishId}`);
      toast.success("삭제되었습니다.");
      fetchWishes(); // 목록 갱신
    } catch (error) {
      toast.error("삭제 실패");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/200";
    
    // http로 시작하면(외부 이미지) 그대로 반환
    if (path.startsWith('http')) return path;
    
    // ★ 핵심: 한글 깨짐 방지를 위해 encodeURI()로 감싸줍니다.
    // 예: /images/코트.jpg -> /images/%EC%BD%94%ED%8A%B8.jpg 로 변환됨
    return `${baseUrl}${encodeURI(path)}`;
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">찜 목록</h2>

      {wishes.length > 0 ? (
        <Row>
          {wishes.map((item) => (
            <Col lg={3} md={4} sm={6} key={item.wishId} className="mb-4">
              <Card 
                className="border-0 shadow-sm h-100 product-card" 
                onClick={() => navigate(`/product/${item.productId}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="position-relative">
                  <img 
                    src={getImageUrl(item.imgUrl)} 
                    alt={item.name} 
                    className="card-img-top"
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  {/* 삭제 버튼 */}
                  <button 
                    className="position-absolute top-0 end-0 btn btn-light btn-sm m-2 rounded-circle shadow-sm"
                    onClick={(e) => handleDelete(item.wishId, e)}
                    title="삭제"
                  >
                    <FaTrashAlt color="#888" />
                  </button>
                </div>
                
                <CardBody className="text-center">
                  <h6 className="fw-bold text-truncate">{item.name}</h6>
                  <p className="text-muted mb-3">{item.price.toLocaleString()}원</p>
                  <Button 
                    outline color="dark" size="sm" className="w-100"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.productId}`);
                    }}
                  >
                    <FaShoppingCart className="me-2"/> 상품 이동
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted mb-4">찜한 상품이 없습니다.</p>
          <Button color="dark" onClick={() => navigate('/products')}>GO SHOPPING</Button>
        </div>
      )}
    </Container>
  );
};

export default Wishlist;