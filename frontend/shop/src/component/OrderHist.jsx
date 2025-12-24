import React, { useEffect, useState } from 'react';
import { Container, Card, CardHeader, CardBody, Row, Col, Badge, Button } from 'reactstrap';
import { myAxios } from '../config';
import ReviewWriteModal from './ReviewWriteModal'; 
import { useNavigate } from 'react-router-dom'; 
import '../App.css';

const OrderHist = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    myAxios.get('/api/order')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  // ★ 리뷰 쓰기 버튼 클릭 핸들러
  const handleReviewClick = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/product/${productId}`);
    } else {
      console.error("존재하지 않는 상품 ID입니다.");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">주문 내역</h2>
      
      {orders.map(order => (
        <Card key={order.orderId} className="mb-4 shadow-sm border-0">
          <CardHeader className="bg-white border-bottom d-flex justify-content-between align-items-center">
            <span className="fw-bold">{order.orderDate}</span>
            <Badge color={order.orderStatus === 'ORDER' ? 'success' : 'secondary'}>
              {order.orderStatus === 'ORDER' ? '주문완료' : '취소됨'}
            </Badge>
          </CardHeader>
          <CardBody>
            {order.orderItemDtoList.map(item => (
              <Row key={item.id} className="mb-3 align-items-center">
                <Col xs={3} md={2} onClick={() => handleProductClick(item.productId)} style={{ cursor: 'pointer' }}>
                  <img src={item.imgUrl} alt={item.itemNm} className="img-fluid rounded" />
                </Col>
                <Col style={{ cursor: 'pointer'}} onClick={() => handleProductClick(item.productId)}>
                  <h6 className="fw-bold text-decoration-underline-hover">{item.itemNm}</h6>
                  <p className="text-muted mb-0">
                    {item.orderPrice.toLocaleString()}원 / {item.count}개
                  </p>
                </Col>
                
                {/* ★ 추가된 부분: 리뷰 쓰기 버튼 */}
                <Col xs={12} md={2} className="text-end mt-2 mt-md-0">
                  {order.orderStatus === 'ORDER' && (
                    <Button 
                      outline 
                      color="dark" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewClick(item);
                      }}
                    >
                      리뷰 작성
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      ))}

      {/* ★ 추가된 부분: 리뷰 작성 모달 */}
      {selectedItem && (
        <ReviewWriteModal 
          isOpen={modalOpen} 
          toggle={closeModal} 
          orderItem={selectedItem}
          onSuccess={() => {
            closeModal();
            // (선택사항) 여기서 fetchOrders()를 다시 호출하면 리뷰 작성 상태를 갱신할 수도 있음
          }}
        />
      )}

    </Container>
  );
};

export default OrderHist;