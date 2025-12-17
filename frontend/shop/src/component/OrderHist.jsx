import React, { useEffect, useState } from 'react';
import { Container, Card, CardHeader, CardBody, Row, Col, Badge } from 'reactstrap';
import { myAxios } from '../config';
import '../App.css';

const OrderHist = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    myAxios.get('/api/order') // 백엔드 API 필요
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">ORDER HISTORY</h2>
      
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
                <Col xs={3} md={2}>
                  <img src={item.imgUrl} alt={item.itemNm} className="img-fluid rounded" />
                </Col>
                <Col>
                  <h6 className="fw-bold">{item.itemNm}</h6>
                  <p className="text-muted mb-0">
                    {item.orderPrice.toLocaleString()}원 / {item.count}개
                  </p>
                </Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      ))}
    </Container>
  );
};

export default OrderHist;