import React, { useEffect, useState } from 'react';
import { Container, Card, CardHeader, CardBody, Row, Col, Badge, Button } from 'reactstrap';
import { myAxios, baseUrl } from '../config';
import { toast } from 'react-toastify';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    myAxios.get('/api/admin/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  // 주문 취소 핸들러
  const handleCancel = async (orderId) => {
    if(!window.confirm("이 주문을 강제로 취소하시겠습니까?")) return;

    try {
        await myAxios.post(`/api/admin/orders/${orderId}/cancel`);
        toast.success("주문이 취소되었습니다.");
        fetchOrders(); // 목록 갱신
    } catch (error) {
        toast.error("취소 실패");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/100";
    if (path.startsWith('http')) return path;
    return `${baseUrl}${encodeURI(path)}`;
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">전체 주문 관리</h2>
      
      {orders.map(order => (
        <Card key={order.orderId} className="mb-4 shadow-sm border-0">
          <CardHeader className="bg-white border-bottom d-flex justify-content-between align-items-center">
            <div>
                <span className="fw-bold me-3">No. {order.orderId}</span>
                <span className="text-muted small">{order.orderDate}</span>
            </div>
            <div>
                <Badge color={order.orderStatus === 'ORDER' ? 'success' : 'secondary'} className="me-2">
                  {order.orderStatus === 'ORDER' ? '결제완료' : '취소됨'}
                </Badge>
                
                {/* 주문 상태일 때만 취소 버튼 표시 */}
                {order.orderStatus === 'ORDER' && (
                    <Button size="sm" color="danger" outline onClick={() => handleCancel(order.orderId)}>
                        강제 취소
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardBody>
            {order.orderItemDtoList.map(item => (
              <Row key={item.id || Math.random()} className="mb-2 align-items-center">
                <Col xs={2}>
                  <img src={getImageUrl(item.imgUrl)} alt="prod" className="img-fluid rounded" />
                </Col>
                <Col>
                  <h6 className="fw-bold mb-1">{item.itemNm}</h6>
                  <span className="text-muted small">
                    {item.orderPrice.toLocaleString()}원 × {item.count}개
                  </span>
                </Col>
              </Row>
            ))}
          </CardBody>
        </Card>
      ))}
      
      {orders.length === 0 && <div className="text-center py-5">주문 내역이 없습니다.</div>}
    </Container>
  );
};

export default AdminOrderList;