import React from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaChartLine,
  FaCommentDots,
} from "react-icons/fa";

const AdminPage = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "상품 등록",
      desc: "새로운 상품을 등록합니다.",
      icon: <FaBoxOpen size={40} className="mb-3 text-primary" />,
      link: "/admin/product/new",
    },
    {
      title: "상품 관리",
      desc: "등록된 상품을 수정/삭제합니다.",
      icon: <FaClipboardList size={40} className="mb-3 text-success" />,
      link: "/admin/products", // 추후 관리자 전용 리스트로 변경 가능
    },
    {
      title: "주문 관리",
      desc: "들어온 주문의 상태를 변경합니다.",
      icon: <FaChartLine size={40} className="mb-3 text-warning" />,
      link: "/admin/orders", // 추후 구현
    },
    {
      title: "회원 관리",
      desc: "가입된 회원을 조회합니다.",
      icon: <FaUsers size={40} className="mb-3 text-info" />,
      link: "/admin/users", // 추후 구현
    },
    {
      title: "1:1 문의 관리",
      desc: "고객의 문의 사항에 답변합니다.",
      icon: <FaCommentDots size={40} className="mb-3 text-primary" />,
      link: "/admin/chat", // 관리자 채팅 리스트 페이지
    },
  ];

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-5 text-center">ADMIN DASHBOARD</h2>

      <Row>
        {menuItems.map((item, index) => (
          <Col md={6} lg={3} key={index} className="mb-4">
            <Card className="h-100 border-0 shadow-sm text-center hover-scale">
              <CardBody className="d-flex flex-column justify-content-center align-items-center p-4">
                {item.icon}
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted small mb-4">{item.desc}</p>
                <Button
                  outline
                  color="dark"
                  size="sm"
                  onClick={() => navigate(item.link)}
                >
                  바로가기
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminPage;
