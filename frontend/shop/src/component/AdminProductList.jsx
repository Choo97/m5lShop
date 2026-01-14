import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "reactstrap";
import { myAxios, baseUrl } from "../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrashAlt, FaPen } from "react-icons/fa";

const AdminProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    // 기존에 만든 검색용 API를 재활용 (전체 조회)
    // 관리자 전용 페이징 API를 따로 만드는 게 정석이지만, 일단 기존 것 사용
    myAxios
      .get("/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까? 복구할 수 없습니다.")) return;

    try {
      await myAxios.delete(`/api/admin/products/${id}`);
      toast.success("삭제되었습니다.");
      fetchProducts(); // 목록 갱신
    } catch (error) {
      toast.error("삭제 실패");
      console.error(error);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/50";
    if (path.startsWith("http")) return path;
    return `${baseUrl}${encodeURI(path)}`;
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">상품 관리</h2>
        <Button color="dark" onClick={() => navigate("/admin/product/new")}>
          + 상품 등록
        </Button>
      </div>

      <Table
        hover
        responsive
        className="align-middle text-center bg-white shadow-sm rounded"
      >
        <thead className="table-light">
          <tr>
            <th>Img</th>
            <th>상품명</th>
            <th>가격/재고</th>
            <th>상태</th>
            <th>카테고리</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={getImageUrl(product.imageUrl)}
                  alt="thumb"
                  style={{
                    width: "50px",
                    height: "60px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </td>
              <td className="text-start fw-bold" style={{ maxWidth: "200px" }}>
                {product.name}
              </td>
              <td>
                <div>{product.price.toLocaleString()}원</div>
                <div className="text-muted small">
                  재고: {product.stockQuantity || 100}
                </div>
              </td>
              <td>
                {product.isSale && (
                  <Badge color="danger" className="me-1">
                    SALE
                  </Badge>
                )}
                {product.isNew && (
                  <Badge color="success" className="me-1">
                    NEW
                  </Badge>
                )}
                {product.isBest && (
                  <Badge color="warning" className="text-dark">
                    BEST
                  </Badge>
                )}
              </td>
              <td className="text-muted small">
                {product.category?.toUpperCase()}
                <br />({product.subCategory})
              </td>
              <td>
                {/* 수정 버튼 (추후 구현) */}
                <Button
                  size="sm"
                  color="light"
                  className="me-2"
                  onClick={() => navigate(`/admin/product/edit/${product.id}`)}
                >
                  {" "}
                  {/* 링크 연결 */}
                  <FaPen size={12} />
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  outline
                  onClick={() => handleDelete(product.id)}
                >
                  <FaTrashAlt size={12} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminProductList;
