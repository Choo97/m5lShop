import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';
import { baseUrl, myAxios } from '../config';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ProductReviews from './ProductReviews';
import '../App.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAtomValue(userAtom);

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [count, setCount] = useState(1);
  const [isWished, setIsWished] = useState(false);

  // 상품 상세 정보 가져오기 (로그인 불필요)
  useEffect(() => {
    axios.get(`${baseUrl}/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
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

  useEffect(() => {
    if (user.isLogined && id) {
      myAxios.get(`/api/wish/${id}`)
        .then(res => setIsWished(res.data))
        .catch(e => console.error(e));
    }
  }, [user, id]);

  const handleWish = async () => {
    if (!user.isLogined) {
      // alert("로그인이 필요합니다.");
      toast.info("로그인이 필요한 서비스입니다.");
      return;
    }
    try {
      const res = await myAxios.post(`/api/wish/${product.id}`);
      setIsWished(res.data); // true/false 반환됨
      if (res.data) toast.success("찜 목록에 추가되었습니다.");
      else toast.info("찜 목록에서 삭제되었습니다.");
    } catch (e) {
      console.error(e);
    }
  };

  // 장바구니 담기 핸들러
  const handleAddToCart = async () => {
    // 1. 로그인 체크 (atoms.jsx에 정의된 isLogined 사용)
    if (!user.isLogined) {
      if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
        navigate('/login');
      }
      return;
    }

    // 2. 옵션 선택 체크
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.warning("색상을 선택해주세요.");
      return;
    }

    // 3. 서버로 전송할 데이터 준비
    const cartItemDto = {
      productId: product.id,
      count: count,
      color: selectedColor
    };

    try {
      // ★ myAxios를 사용하여 토큰과 함께 요청 전송
      await myAxios.post('/api/cart', cartItemDto);

      if (window.confirm("장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?")) {
        navigate('/cart');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data || "장바구니 담기에 실패했습니다.";
      toast.error(msg);
    }
  };

  if (!product) return <div className="text-center py-5">Loading...</div>;

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x600";
    if (path.startsWith('http')) return path;
    return `${baseUrl}${encodeURI(path)}`; // config.js의 baseUrl 사용
  };

  return (
    <Container className="py-5">
      <Row>
        {/* 왼쪽: 이미지 영역 */}
        <Col md={6} className="mb-4">
          <div className="mb-3">
            <img src={getImageUrl(mainImg)} alt="Main" className="w-100" style={{ objectFit: 'cover', maxHeight: '600px' }} />
          </div>
          <div className="d-flex gap-2 overflow-auto">
            {product.productImages.map((img, idx) => (
              <img
                key={idx}
                src={getImageUrl(img)}
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

            {/* 수량 선택 */}
            <div className="mb-4 d-flex align-items-center">
              <span className="fw-bold me-3">개수</span>
              <div className="d-flex align-items-center border rounded">
                <button className="btn btn-light btn-sm border-0" onClick={() => setCount(prev => Math.max(1, prev - 1))}>-</button>
                <span className="px-3">{count}</span>
                <button className="btn btn-light btn-sm border-0" onClick={() => setCount(prev => prev + 1)}>+</button>
              </div>
            </div>

            {/* 버튼 */}
            <div className="d-grid gap-2 d-md-flex mb-5">
              <Button color="dark" size="lg" className="flex-grow-1" onClick={handleAddToCart} disabled={product.isSoldOut}>
                {product.isSoldOut ? "품절" : "장바구니 담기"}
              </Button>
              <Button
                outline={!isWished} // 찜 안했으면 외곽선만, 했으면 채워짐
                color="danger"
                size="lg"
                className="flex-grow-1"
                onClick={handleWish}
              >
                {isWished ? <FaHeart className="me-2" /> : <FaRegHeart className="me-2" />}
                찜
              </Button>
            </div>

            {/* 상세 설명 */}
            <div className="bg-light p-4 rounded">
              <h5 className="fw-bold mb-3">상품 정보</h5>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#555' }}>
                {product.description}
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* ★ 하단 상세 정보 영역 (추가됨) */}
      <Row className="mt-5">
        <Col>
          <div className="text-center">
            <h4 className="fw-bold mb-4 py-3 border-bottom border-top">상세 정보</h4>

            {/* 1. 텍스트 설명 */}
            {/* <p className="mb-5" style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#555', fontSize: '1.05rem' }}>
              {product.description}
            </p> */}

            {/* 2. 상세 이미지 리스트 (세로로 쭉 나열) */}
            <div className="detail-images-container">
              {product.detailImages && product.detailImages.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`Detail ${idx}`}
                  className="img-fluid mb-0 d-block mx-auto"
                  style={{ maxWidth: '100%' }}
                />
              ))}
            </div>

            {/* 상세 이미지가 없을 경우 안내 */}
            {(!product.detailImages || product.detailImages.length === 0) && (
              <div className="p-5 text-muted bg-light">상세 이미지가 없습니다.</div>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ProductReviews product={product} />
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;