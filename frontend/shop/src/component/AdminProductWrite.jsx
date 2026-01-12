import React, { useState, useRef } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../config";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const AdminProductWrite = () => {
  const navigate = useNavigate();

  const thumbInputRef = useRef();
  const detailInputRef = useRef();
  const [repImgIndex, setRepImgIndex] = useState(0);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    category: "outer",
    subCategory: "coat",
    salePrice: 0,
    isNew: true,
    isBest: false,
    isSale: false,
  });

  // ★ 파일 State 분리
  const [thumbFiles, setThumbFiles] = useState([]);
  const [detailFiles, setDetailFiles] = useState([]);

  // ★ 미리보기 State 분리
  const [thumbPreviews, setThumbPreviews] = useState([]);
  const [detailPreviews, setDetailPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  // ★ 파일 핸들러 (타입별로 구분)
  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));

    if (type === "thumb") {
      setThumbFiles(selectedFiles);
      setThumbPreviews(previews);
      setRepImgIndex(0);
    } else {
      setDetailFiles(selectedFiles);
      setDetailPreviews(previews);
    }
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!product.name || !product.price)
      return toast.warning("필수 정보를 입력해주세요.");
    if (thumbFiles.length === 0)
      return toast.warning("썸네일 이미지는 최소 1장 필수입니다.");

    const formData = new FormData();

    // 1. JSON 데이터
    const productData = {
      ...product,
      price: parseInt(product.price),
      stockQuantity: parseInt(product.stockQuantity),
      salePrice: product.isSale ? parseInt(product.salePrice) : 0,
      repImgIndex: repImgIndex,
    };

    console.log("상품 데이터:", productData);

    formData.append(
      "data",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );

    // ★ 2. 썸네일 이미지들 (키 이름: thumbnailFiles)
    thumbFiles.forEach((file) => formData.append("thumbnailFiles", file));

    // ★ 3. 상세 이미지들 (키 이름: detailFiles)
    detailFiles.forEach((file) => formData.append("detailFiles", file));

    try {
      await myAxios.post("/api/admin/products/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("상품 등록 완료!");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      toast.error("등록 실패");
    }
  };

  // 할인율 계산 함수
  const getDiscountRate = () => {
    if (!product.price || !product.salePrice) return 0;
    return Math.round(
      ((product.price - product.salePrice) / product.price) * 100
    );
  };

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <h3 className="fw-bold mb-4 text-center">상품 등록</h3>

      <Form className="bg-white p-5 border rounded shadow-sm">
        <Row>
          <Col md={8}>
            <FormGroup>
              <Label className="fw-bold small">상품명</Label>
              <Input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label className="fw-bold small">가격 (원가)</Label>
              <Input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={4}>
            <FormGroup>
              <Label className="fw-bold small">대분류</Label>
              <Input
                type="select"
                name="category"
                value={product.category}
                onChange={handleChange}
              >
                <option value="outer">Outer</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="shoes">Shoes</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label className="fw-bold small">중분류</Label>
              <Input
                type="select"
                name="subCategory"
                value={product.subCategory}
                onChange={handleChange}
              >
                <option value="coat">Coat</option>
                <option value="padding">Padding</option>
                <option value="hoodie">Hoodie</option>
                <option value="jeans">Jeans</option>
                <option value="slacks">Slacks</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label className="fw-bold small">재고</Label>
              <Input
                type="number"
                name="stockQuantity"
                value={product.stockQuantity}
                onChange={handleChange}
              />
            </FormGroup>
          </Col>
        </Row>

        {/* 판매 옵션 및 할인 가격 설정 영역 */}
        <div className="p-3 bg-light rounded mb-3 border">
          <Label className="fw-bold small d-block mb-2">판매 옵션</Label>
          <div className="d-flex gap-4 mb-2">
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="isNew"
                  checked={product.isNew}
                  onChange={handleChange}
                />{" "}
                NEW
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="isBest"
                  checked={product.isBest}
                  onChange={handleChange}
                />{" "}
                BEST
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="isSale"
                  checked={product.isSale}
                  onChange={handleChange}
                />{" "}
                SALE (할인설정)
              </Label>
            </FormGroup>
          </div>

          {/* ★ 할인 가격 입력 및 미리보기 (SALE 체크 시 표시) */}
          {product.isSale && (
            <div className="mt-3 pt-3 border-top">
              <Row className="align-items-center">
                <Col md={5}>
                  <Label className="fw-bold small text-danger">
                    할인 적용 가격 (실제 판매가)
                  </Label>
                  <Input
                    type="number"
                    name="salePrice"
                    placeholder="할인된 가격 입력"
                    value={product.salePrice}
                    onChange={handleChange}
                  />
                </Col>
                <Col md={7}>
                  {product.price && product.salePrice ? (
                    <div className="p-2 border rounded bg-white">
                      <span className="small text-muted d-block">
                        미리보기:
                      </span>
                      <span className="text-decoration-line-through text-muted me-2">
                        {parseInt(product.price).toLocaleString()}원
                      </span>
                      <span className="fw-bold text-danger">
                        {parseInt(product.salePrice).toLocaleString()}원
                      </span>
                      <span className="ms-2 badge bg-danger">
                        {getDiscountRate()}% 할인
                      </span>
                    </div>
                  ) : (
                    <div className="text-muted small mt-4">
                      원가와 할인가를 입력하면 할인율이 계산됩니다.
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </div>

        <FormGroup>
          <Label className="fw-bold small">상세 설명</Label>
          <Input
            type="textarea"
            name="description"
            rows="5"
            value={product.description}
            onChange={handleChange}
          />
        </FormGroup>

        {/* 1. 썸네일 이미지 업로드 영역 수정 */}
        <FormGroup className="mb-4">
          <Label className="fw-bold small">
            썸네일 이미지 (상단 슬라이드용)
          </Label>
          <div className="text-muted extra-small mb-2">
            이미지를 클릭하여 <strong>목록에 보여질 대표 이미지</strong>를
            선택하세요.
          </div>

          <div
            className="border d-flex align-items-center justify-content-center bg-light rounded mb-2"
            style={{ height: "80px", cursor: "pointer" }}
            onClick={() => thumbInputRef.current.click()}
          >
            <div className="text-center text-muted small">
              <FaCamera className="me-2" />
              클릭하여 추가
            </div>
          </div>
          <input
            type="file"
            ref={thumbInputRef}
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e, "thumb")}
            style={{ display: "none" }}
          />

          <div className="d-flex gap-2 overflow-auto p-1">
            {thumbPreviews.map((src, idx) => (
              <div
                key={idx}
                className="position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => setRepImgIndex(idx)} // ★ 클릭 시 대표 인덱스 변경
              >
                <img
                  src={src}
                  alt="thumb"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    // 선택된 이미지는 테두리를 진하게 표시
                    border:
                      idx === repImgIndex
                        ? "3px solid #212529"
                        : "1px solid #ddd",
                    opacity: idx === repImgIndex ? 1 : 0.6,
                  }}
                />

                {/* 대표 뱃지 표시 */}
                {idx === repImgIndex && (
                  <span
                    className="position-absolute top-0 start-0 badge bg-dark shadow-sm"
                    style={{ fontSize: "0.7rem" }}
                  >
                    대표
                  </span>
                )}
              </div>
            ))}
          </div>
        </FormGroup>

        {/* 2. 상세 설명 이미지 업로드 (여러장 가능) */}
        <FormGroup>
          <Label className="fw-bold small">
            상세 설명 이미지 (하단 나열용)
          </Label>
          <div
            className="border d-flex align-items-center justify-content-center bg-light rounded mb-2"
            style={{ height: "80px", cursor: "pointer" }}
            onClick={() => detailInputRef.current.click()}
          >
            <div className="text-center text-muted small">
              <FaCamera className="me-2" />
              클릭하여 상세컷 추가 (여러장 가능)
            </div>
          </div>
          <input
            type="file"
            ref={detailInputRef}
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e, "detail")}
            style={{ display: "none" }}
          />

          <div className="d-flex gap-2 overflow-auto">
            {detailPreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="detail"
                style={{
                  width: "60px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
          </div>
        </FormGroup>

        <div className="d-flex gap-2 mt-4">
          <Button
            color="dark"
            size="lg"
            className="flex-grow-1"
            onClick={handleSubmit}
          >
            등록
          </Button>
          <Button
            color="light"
            size="lg"
            className="flex-grow-1"
            onClick={() => navigate("/admin")}
          >
            취소
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminProductWrite;
