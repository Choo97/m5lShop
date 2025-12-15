import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Table, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../config';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';
import '../App.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
        if(err.response?.status === 401) navigate('/login');
      });
  };

  // 총 금액 계산
  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + (item.price * item.count), 0);
    setTotalPrice(total);
  };

  // 2. 수량 변경 핸들러
  const handleCountChange = (cartItemId, newCount) => {
    if(newCount < 1) return;

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
    if(!window.confirm("정말 삭제하시겠습니까?")) return;

    myAxios.delete(`/api/cart/${cartItemId}`)
      .then(() => {
        toast.success("삭제되었습니다.");
        fetchCartItems(); // 목록 다시 불러오기
      })
      .catch(err => toast.error("삭제 실패"));
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">SHOPPING CART</h2>
      
      {cartItems.length > 0 ? (
        <>
          <Table className="align-middle text-center" responsive>
            <thead className="table-light">
              <tr>
                <th style={{width: '50%'}}>Product</th>
                <th style={{width: '15%'}}>Price</th>
                <th style={{width: '20%'}}>Quantity</th>
                <th style={{width: '15%'}}>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.cartItemId}>
                  <td className="text-start">
                    <div className="d-flex align-items-center">
                      <img src={item.imgUrl} alt={item.name} style={{width: '80px', height: '100px', objectFit: 'cover', marginRight: '15px'}} />
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
                    <span onClick={() => handleDelete(item.cartItemId)} style={{cursor: 'pointer', color: '#999'}}>
                      <FaTrashAlt />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end align-items-center mt-4 p-4 bg-light rounded">
            <h4 className="m-0 me-4">TOTAL: <span className="fw-bold text-danger">{totalPrice.toLocaleString()}원</span></h4>
            <Button color="dark" size="lg" onClick={() => toast.info("주문 기능 준비중입니다.")}>ORDER NOW</Button>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted mb-4">장바구니가 비어있습니다.</p>
          <Button color="dark" onClick={() => navigate('/products')}>GO SHOPPING</Button>
        </div>
      )}
    </Container>
  );
};

export default Cart;