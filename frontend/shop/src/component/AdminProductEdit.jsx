import React, { useState, useEffect, useRef } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { myAxios, baseUrl } from "../config";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

const AdminProductEdit = () => {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    category: "note",
    subCategory: "diary",
    salePrice: 0,
    isNew: false,
    isBest: false,
    isSale: false,
    productImgIds: [], // 기존 이미지 ID들
  });

  const [previews, setPreviews] = useState([]); // 이미지 미리보기
  const [files, setFiles] = useState([]); // 새로 업로드할 파일들

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    myAxios
      .get(`/api/admin/products/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct({
          ...data,
          // 이미지 ID 리스트 추출
          productImgIds: data.productImgDtoList.map((img) => img.id),
        });

        // 기존 이미지 미리보기 설정
        const urls = data.productImgDtoList.map((img) => {
          if (img.imgUrl.startsWith("http")) return img.imgUrl;
          return `${baseUrl}${encodeURI(img.imgUrl)}`;
        });
        setPreviews(urls);
      })
      .catch((err) => {
        console.error(err);
        toast.error("상품 정보를 불러오지 못했습니다.");
        navigate("/admin/products");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  };

  // 파일이 바뀌면 미리보기 업데이트
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // JSON 데이터
    const productData = {
      ...product,
      price: parseInt(product.price),
      stockQuantity: parseInt(product.stockQuantity),
      salePrice: product.isSale ? parseInt(product.salePrice) : 0,
    };
    formData.append(
      "data",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );

    // 새로 올린 파일이 있으면 전송
    if (files.length > 0) {
      files.forEach((file) => formData.append("files", file));
    } else {
      // 파일이 없어도 빈 리스트라도 보내야 백엔드 @RequestPart 에러가 안 날 수 있음 (설정에 따라 다름)
      // 여기서는 그냥 빈 파일 전송 안 함 (백엔드 required=false 처리됨)
    }

    try {
      // 수정은 POST (또는 PUT)
      await myAxios.post(`/api/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("상품이 수정되었습니다.");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("수정 실패");
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
      <h3 className="fw-bold mb-4 text-center">상품 수정</h3>
      <Form className="bg-white p-5 border rounded shadow-sm">
        {/* ... (입력 필드들은 AdminProductWrite.jsx와 99% 동일합니다) ... */}

        {/* 예시: 상품명 */}

        {/* ... (가격, 카테고리, 상태 등 나머지 필드 복사 붙여넣기) ... */}
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
              <Input type="select" name="category" value={product.category} onChange={handleChange}>
                <option value="note">노트/다이어리</option>
                <option value="pen">필기구</option>
                <option value="sticker">스티커/데코</option>
                <option value="office">사무용품</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label className="fw-bold small">중분류</Label>
              <Input type="select" name="subCategory" value={product.subCategory} onChange={handleChange}>
                <optgroup label="노트/다이어리">
                  <option value="diary">다이어리</option>
                  <option value="memo">메모지</option>
                  <option value="planner">플래너</option>
                  <option value="notebook">노트</option>
                </optgroup>
                <optgroup label="필기구">
                  <option value="ballpoint">볼펜</option>
                  <option value="fountain">만년필</option>
                  <option value="pencil">연필/샤프</option>
                  <option value="highlighter">형광펜</option>
                </optgroup>
                <optgroup label="스티커/사무용품">
                  <option value="masking">마스킹테이프</option>
                  <option value="removable">리무버블</option>
                  <option value="seal">씰스티커</option>
                  <option value="organizer">정리함</option>
                  <option value="desk">데스크테리어</option>
                </optgroup>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label className="fw-bold small">재고</Label>
              <Input type="number" name="stockQuantity" value={product.stockQuantity} onChange={handleChange} />
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

        {/* 이미지 수정 영역 */}
        <FormGroup>
          <Label className="fw-bold small">이미지 수정</Label>
          <div className="text-muted small mb-2">
            새로운 이미지를 업로드하면 기존 이미지가 순서대로 교체됩니다.
          </div>
          <div
            className="border d-flex align-items-center justify-content-center bg-light rounded mb-2"
            style={{ height: "80px", cursor: "pointer" }}
            onClick={() => fileInputRef.current.click()}
          >
            <FaCamera size={24} color="#aaa" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* 미리보기 */}
          <div className="d-flex gap-2 overflow-auto">
            {previews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt="prev"
                style={{
                  width: "80px",
                  height: "100px",
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
            color="success"
            size="lg"
            className="flex-grow-1"
            onClick={handleSubmit}
          >
            수정 완료
          </Button>
          <Button
            color="light"
            size="lg"
            className="flex-grow-1"
            onClick={() => navigate("/admin/products")}
          >
            취소
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AdminProductEdit;
