import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../config';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';
import * as Portone from "@portone/browser-sdk/v2";
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';
import '../App.css';

const Cart = () => {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const requestPay = async () => {
    if (cartItems.length === 0) {
      toast.warning("장바구니가 비어있습니다.");
      return;
    }

    // 결제 고유 ID 생성 (UUID 권장, 여기서는 간단히 타임스탬프+랜덤)
    // 실제로는 crypto.randomUUID() 등을 사용하는 것이 좋습니다.
    // 도메인을 연결하고 **SSL 인증서(HTTPS)**를 적용하면 crypto.randomUUID() 사용 가능
    // const paymentId = `payment-${crypto.randomUUID()}`;
    const paymentId = `payment-${new Date().getTime()}-${Math.random().toString(36).slice(2)}`;

    const orderName = cartItems.length > 1
      ? `${cartItems[0].name} 외 ${cartItems.length - 1}건`
      : cartItems[0].name;

    try {
      // 1. 포트원 결제 요청 (await 사용)
      const response = await Portone.requestPayment({
        storeId: "store-c5c07007-20e7-4348-a427-0cbbe7ddefe8", // ★ 포트원 콘솔에서 복사한 Store ID
        channelKey: "channel-key-3194df70-0bdf-4881-96d8-c4618579a9cc", // ★ 포트원 콘솔에서 복사한 Channel Key (카카오페이 등)
        paymentId: paymentId,
        orderName: orderName,
        totalAmount: 100, // 테스트용으로 100원 고정 원래는 totalAmount
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY", // 카드: CARD, 실시간 계좌이체: TRANSFER, 가상계좌: VIRTUAL_ACCOUNT, 휴대폰 소액결제: MOBILE, 간편결제: EASY_PAY, 상품권: GIFT_CERTIFICATE
        customer: {
          fullName: user.name,
          phoneNumber: user.phone || "010-0000-0000",
          email: user.email,
          address: {
            addressLine1: user.address || "서울",
            addressLine2: user.detailAddress || "관악구 관악로11길 54-3 로즈빌3"
          },
          zipcode: user.zipcode || "08832"
        }
      });

      // 2. 결제 결과 처리
      if (response.code != null) {
        // 에러 발생 시 (code가 있으면 에러임)
        return toast.error(`결제 실패: ${response.message}`);
      }

      // 3. 결제 성공 시 -> 백엔드에 주문 데이터 전송
      // (response.paymentId 등을 백엔드로 보내서 검증하는 것이 정석이지만, 일단 주문 저장부터 구현)
      const orderDtoList = cartItems.map(item => ({
        cartItemId: item.cartItemId,
      }));

      const notified = await myAxios.post('/api/order/cart', orderDtoList);

      toast.success("주문이 완료되었습니다!");
      navigate('/orders'); // 주문 내역 페이지(아직 안 만듦)로 이동

    } catch (error) {
      console.error(error);
      toast.error("결제 처리 중 오류가 발생했습니다.");
    }
  };
  // 1. 장바구니 목록 불러오기
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = () => {
    myAxios.get('/api/cart')
      .then(res => {
        console.log(res.data);
        setCartItems(res.data);
        calculateTotal(res.data);
      })
      .catch(err => {
        console.error(err);
        // 401이면 config.js에서 처리하겠지만, 혹시 모르니
        if (err.response?.status === 401) navigate('/login');
      });
  };

  // 총 금액 계산
  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.count), 0);
    setTotalPrice(total);
  };

  // 2. 수량 변경 핸들러
  const handleCountChange = (cartItemId, newCount) => {
    if (newCount < 1) return;

    myAxios.patch(`/api/cart/${cartItemId}?count=${newCount}`)
      .then(() => {
        // UI 즉시 업데이트 (API 재호출 대신)
        const newItems = cartItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, count: newCount } : item
        );
        setCartItems(newItems);
        calculateTotal(newItems);
      })
      .catch(err => toast.error("수량 변경 실패"));
  };

  // 3. 삭제 핸들러
  const handleDelete = (cartItemId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    myAxios.delete(`/api/cart/${cartItemId}`)
      .then(() => {
        toast.success("삭제되었습니다.");
        fetchCartItems(); // 목록 다시 불러오기
      })
      .catch(err => toast.error("삭제 실패"));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">장바구니</h2>

      {cartItems.length > 0 ? (
        <>
          <Table className="align-middle text-center" responsive>
            <thead className="table-light">
              <tr>
                <th style={{ width: '50%' }}>상품</th>
                <th style={{ width: '15%' }}>가격</th>
                <th style={{ width: '20%' }}>개수</th>
                <th style={{ width: '15%' }}>총합</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.cartItemId}>
                  <td className="text-start">
                    <div className="d-flex align-items-center product-link"
                      onClick={() => handleProductClick(item.productId)}
                      style={{ cursor: 'pointer' }} >
                      <img src={item.imgUrl} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover', marginRight: '15px' }} />
                      <div>
                        {/* <span className="fw-bold d-block text-truncate" style={{ maxWidth: '200px' }}>{item.name}</span> */}
                        {item.color && (
                          <span className="text-muted small">
                            Color: <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: item.color, borderRadius: '50%', marginRight: '5px' }}></span>
                            {item.color}
                          </span>
                        )}
                      </div>
                      <span className="fw-bold">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.price.toLocaleString()}원</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button size="sm" color="light" onClick={() => handleCountChange(item.cartItemId, item.count - 1)}>-</Button>
                      <span className="mx-3">{item.count}</span>
                      <Button size="sm" color="light" onClick={() => handleCountChange(item.cartItemId, item.count + 1)}>+</Button>
                    </div>
                  </td>
                  <td className="fw-bold">{(item.price * item.count).toLocaleString()}원</td>
                  <td>
                    <span onClick={() => handleDelete(item.cartItemId)} style={{ cursor: 'pointer', color: '#999' }}>
                      <FaTrashAlt />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-end align-items-center mt-4 p-4 bg-light rounded">
            <h4 className="m-0 me-4">총합: <span className="fw-bold text-danger">{totalPrice.toLocaleString()}원</span></h4>
            <Button color="dark" size="lg" onClick={requestPay}>
              주문
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted mb-4">장바구니가 비어있습니다.</p>
          <Button color="dark" onClick={() => navigate('/products')}>장보기</Button>
        </div>
      )}
    </Container>
  );
};

export default Cart;