import React, { useState, useRef } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col, InputGroup, InputGroupText } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../config';
import { toast } from 'react-toastify';

const AdminProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // 상품 정보 State
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stockQuantity: '',
    description: '',
    category: 'note',      // 기본값
    subCategory: 'diary',    // 기본값
    salePrice: 0,
    isNew: true,
    isBest: false,
    isSale: false
  });

  // 파일 State
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // 미리보기 URL 생성
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  // 등록 제출
  const handleSubmit = async () => {
    // 1. 유효성 검사
    if (!product.name || !product.price || !product.stockQuantity || !product.description) {
      return toast.warning("필수 정보를 모두 입력해주세요.");
    }
    if (files.length === 0) {
      return toast.warning("상품 이미지를 최소 1장 이상 등록해주세요.");
    }

    const formData = new FormData();

    // 2. JSON 데이터 (Blob으로 감싸기)
    const productData = {
      ...product,
      price: parseInt(product.price),
      stockQuantity: parseInt(product.stockQuantity),
      salePrice: product.isSale ? parseInt(product.salePrice) : 0
    };

    formData.append("data", new Blob([JSON.stringify(productData)], { type: "application/json" }));

    // 3. 파일 데이터
    files.forEach((file) => {
      formData.append("files", file);
    });

    // 4. 전송
    try {
      await myAxios.post('/api/admin/products/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("상품이 등록되었습니다.");
      navigate('/products'); // 등록 후 상품 목록으로 이동
    } catch (error) {
      console.error(error);
      toast.error("상품 등록 실패");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h2 className="fw-bold mb-4 text-center">상품 등록 (관리자)</h2>
      
      <Form className="bg-white p-4 border rounded shadow-sm">
        
        {/* 1. 기본 정보 */}
        <Row>
          <Col md={12}>
            <FormGroup>
              <Label className="fw-bold small">상품명</Label>
              <Input type="text" name="name" value={product.name} onChange={handleChange} placeholder="상품명을 입력하세요" />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label className="fw-bold small">가격</Label>
              <Input type="number" name="price" value={product.price} onChange={handleChange} placeholder="숫자만 입력" />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label className="fw-bold small">재고수량</Label>
              <Input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} placeholder="숫자만 입력" />
            </FormGroup>
          </Col>
        </Row>

        {/* 2. 카테고리 (하드코딩된 옵션 예시) */}
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label className="fw-bold small">대분류</Label>
              <Input type="select" name="category" value={product.category} onChange={handleChange}>
                <option value="note">노트/다이어리</option>
                <option value="pen">필기구</option>
                <option value="sticker">스티커/데코</option>
                <option value="office">사무용품</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label className="fw-bold small">중분류</Label>
              <Input type="select" name="subCategory" value={product.subCategory} onChange={handleChange}>
                {/* 편의상 모든 옵션 나열 (실제론 category에 따라 필터링하면 좋음) */}
                <option value="diary">다이어리</option>
                <option value="memo">메모지</option>
                <option value="planner">플래너</option>
                <option value="notebook">노트</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>

        {/* 3. 판매 상태 (체크박스) */}
        <FormGroup className="border p-3 rounded bg-light">
          <Label className="fw-bold small d-block mb-2">판매 설정</Label>
          <div className="d-flex gap-4">
            <FormGroup check>
              <Label check>
                <Input type="checkbox" name="isNew" checked={product.isNew} onChange={handleChange} /> 신상품 (NEW)
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" name="isBest" checked={product.isBest} onChange={handleChange} /> 인기상품 (BEST)
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input type="checkbox" name="isSale" checked={product.isSale} onChange={handleChange} /> 할인상품 (SALE)
              </Label>
            </FormGroup>
          </div>
          
          {/* 할인가 입력 (SALE 체크 시에만 활성화) */}
          {product.isSale && (
            <div className="mt-3">
              <Label className="fw-bold small">할인 적용 가격</Label>
              <Input type="number" name="salePrice" value={product.salePrice} onChange={handleChange} placeholder="할인된 최종 가격 입력" />
            </div>
          )}
        </FormGroup>

        {/* 4. 상세 설명 */}
        <FormGroup>
          <Label className="fw-bold small">상세 설명</Label>
          <Input type="textarea" name="description" rows="5" value={product.description} onChange={handleChange} />
        </FormGroup>

        {/* 5. 이미지 업로드 */}
        <FormGroup>
          <Label className="fw-bold small">상품 이미지 등록</Label>
          <div className="text-muted small mb-2">첫 번째 이미지는 대표(썸네일) 이미지가 됩니다.</div>
          <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
          
          {/* 미리보기 */}
          <div className="d-flex gap-2 mt-2 overflow-auto">
            {previews.map((src, idx) => (
              <div key={idx} className="position-relative">
                <img src={src} alt="preview" style={{width:'80px', height:'100px', objectFit:'cover', border: '1px solid #ddd'}} />
                {idx === 0 && <div className="position-absolute bottom-0 w-100 bg-dark text-white text-center small" style={{fontSize:'0.7rem'}}>대표</div>}
              </div>
            ))}
          </div>
        </FormGroup>

        <Button color="dark" size="lg" block className="mt-4 w-100" onClick={handleSubmit}>
          상품 등록하기
        </Button>

      </Form>
    </Container>
  );
};

export default AdminProduct;