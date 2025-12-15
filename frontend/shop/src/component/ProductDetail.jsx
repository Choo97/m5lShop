import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../config';
import { toast } from 'react-toastify';
import '../App.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    axios.get(`${baseUrl}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        // 첫 번째 이미지를 메인으로 설정
        if (res.data.productImages && res.data.productImages.length > 0) {
          setMainImg(res.data.productImages[0]);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("상품 정보를 불러오지 못했습니다.");
        navigate('/products');
      });
  }, [id, navigate]);

  const handleAddToCart = () => {
    // (추후 구현) 장바구니 API 호출
    if (!selectedColor && product.colors.length > 0) {
      toast.warning("색상을 선택해주세요.");
      return;
    }
    toast.success("장바구니에 담겼습니다!");
  };

  if (!product) return <div className="text-center py-5">Loading...</div>;

  return (
    <Container className="py-5">
      <Row>
        {/* 왼쪽: 이미지 영역 */}
        <Col md={6} className="mb-4">
          <div className="mb-3">
            <img src={mainImg} alt="Main" className="w-100" style={{ objectFit: 'cover', maxHeight: '600px' }} />
          </div>
          <div className="d-flex gap-2 overflow-auto">
            {product.productImages.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`Thumb ${idx}`} 
                style={{ width: '80px', height: '100px', objectFit: 'cover', cursor: 'pointer', border: mainImg === img ? '2px solid #333' : '1px solid #ddd' }}
                onClick={() => setMainImg(img)}
              />
            ))}
          </div>
        </Col>

        {/* 오른쪽: 정보 영역 */}
        <Col md={6}>
          <div className="ps-md-4">
            <h2 className="fw-bold mb-2">{product.name}</h2>
            <div className="mb-4">
              {product.discountRate > 0 ? (
                <div className="d-flex align-items-center">
                  <span className="fs-4 fw-bold text-danger me-2">{product.discountRate}%</span>
                  <span className="fs-4 fw-bold me-2">{product.salePrice.toLocaleString()}원</span>
                  <span className="text-decoration-line-through text-muted">{product.price.toLocaleString()}원</span>
                </div>
              ) : (
                <span className="fs-4 fw-bold">{product.price.toLocaleString()}원</span>
              )}
            </div>

            <hr />

            {/* 옵션 선택 */}
            <div className="mb-4">
              <p className="fw-bold mb-2">Color</p>
              <div className="d-flex gap-2">
                {product.colors.map((color, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    style={{ 
                      width: '30px', height: '30px', borderRadius: '50%', backgroundColor: color, 
                      cursor: 'pointer', border: selectedColor === color ? '3px solid #333' : '1px solid #ddd',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* 버튼 */}
            <div className="d-grid gap-2 d-md-flex mb-5">
              <Button color="dark" size="lg" className="flex-grow-1" onClick={handleAddToCart} disabled={product.isSoldOut}>
                {product.isSoldOut ? "SOLD OUT" : "ADD TO CART"}
              </Button>
              <Button outline color="dark" size="lg" className="flex-grow-1">
                WISH LIST
              </Button>
            </div>

            {/* 상세 설명 */}
            <div className="bg-light p-4 rounded">
              <h5 className="fw-bold mb-3">Product Info</h5>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#555' }}>
                {product.description}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;