import React, { useState, useRef, useEffect } from 'react';
import { Container, Form, FormGroup, Label, Input, 
  Button, Row, Col, Modal, ModalHeader, ModalBody, 
  ListGroup, ListGroupItem } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { myAxios, baseUrl  } from '../config';
import axios from 'axios'
import { toast } from 'react-toastify';
import { FaCamera, FaSearch, FaTimes } from 'react-icons/fa';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';

const StylingWrite = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const user = useAtomValue(userAtom);
  
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [modal, setModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [taggedProducts, setTaggedProducts] = useState([]);

  useEffect(() => {
    if (!user.isLogined) {
      alert("로그인이 필요합니다.");
      navigate('/login');
    }
  }, [user, navigate]);

  // 파일 선택 & 미리보기
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // 미리보기 URL 생성
    }
  };

  const searchProducts = async () => {
    if (!keyword.trim()) return;
    try {
      // 이미 만들어둔 상품 검색 API 활용
      const res = await axios.get(`${baseUrl}/api/products?keyword=${keyword}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectProduct = (product) => {
    // 중복 체크
    if (taggedProducts.find(p => p.id === product.id)) {
      toast.warning("이미 추가된 상품입니다.");
      return;
    }
    setTaggedProducts([...taggedProducts, product]);
    setModal(false); 
    setKeyword('');
    setSearchResults([]);
  };

  const removeTag = (productId) => {
    setTaggedProducts(taggedProducts.filter(p => p.id !== productId));
  };

  // 전송
  const handleSubmit = async () => {
    if (!file) return toast.warning("사진을 꼭 등록해주세요!");
    if (!content) return toast.warning("내용을 입력해주세요.");

    const formData = new FormData();
    // JSON 데이터는 Blob으로 감싸서 보냄
    const jsonBlob = new Blob([JSON.stringify({ content })], { type: "application/json" });
    formData.append('data', jsonBlob);
    formData.append('file', file);

    try {
      await myAxios.post('/api/styling', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("스타일이 등록되었습니다!");
      navigate('/community/styling');
    } catch (error) {
      console.error(error);
      toast.error("등록 실패");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h3 className="fw-bold mb-4 text-center">SHARE YOUR STYLE</h3>
      <Row>
        <Col md={6} className="mb-3">
          <div 
            className="border bg-light d-flex align-items-center justify-content-center mb-3"
            style={{ height: '400px', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="text-center text-secondary">
                <FaCamera size={40} className="mb-2" />
                <p>사진을 올려주세요</p>
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => {
              const f = e.target.files[0];
              if(f) { setFile(f); setPreview(URL.createObjectURL(f)); }
          }} style={{ display: 'none' }} accept="image/*" />
        </Col>
        <Col md={6}>
          <Form>
            <FormGroup>
              <Label className="fw-bold">스타일 설명</Label>
              <Input 
                type="textarea" 
                rows="8" 
                placeholder="#OOTD #DailyLook 코디 정보를 공유해보세요!" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                // style={{ resize: 'none' }}
              />
            </FormGroup>
            <FormGroup>
              <Label className="fw-bold">착용 상품 정보</Label>
              <Button outline color="secondary" size="sm" className="ms-2" onClick={() => setModal(true)}>
                <FaSearch className="me-1" /> 상품 검색
              </Button>
              
              {/* 선택된 상품 리스트 */}
              <ListGroup className="mt-2">
                {taggedProducts.map(p => (
                  <ListGroupItem key={p.id} className="d-flex justify-content-between align-items-center p-2">
                    <div className="d-flex align-items-center">
                      <img src={p.imageUrl} alt={p.name} style={{width:'40px', height:'50px', objectFit:'cover', marginRight:'10px'}} />
                      <div>
                        <div className="small fw-bold text-truncate" style={{maxWidth:'150px'}}>{p.name}</div>
                        <div className="small text-muted">{p.price.toLocaleString()}원</div>
                      </div>
                    </div>
                    <FaTimes style={{cursor:'pointer', color:'#999'}} onClick={() => removeTag(p.id)} />
                  </ListGroupItem>
                ))}
              </ListGroup>
            </FormGroup>

            <Button color="dark" block className="w-100 mt-2" size="lg" onClick={handleSubmit}>
              등록하기
            </Button>
          </Form>
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={() => setModal(!modal)} centered>
        <ModalHeader toggle={() => setModal(!modal)}>상품 검색</ModalHeader>
        <ModalBody>
          <div className="d-flex mb-3">
            <Input 
              placeholder="상품명 입력 (ex. 코트, 후드)" 
              value={keyword} 
              onChange={(e) => setKeyword(e.target.value)} 
              onKeyDown={(e) => {
                // 한글 입력 중(조합 중)일 때 이벤트 무시 (중복 실행 방지)
                if (e.nativeEvent.isComposing) return;
                
                if (e.key === 'Enter') {
                  searchProducts();
                }
              }}
            />
            <Button color="dark" className="ms-2" onClick={searchProducts}>검색</Button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {searchResults.length > 0 ? (
              <ListGroup>
                {searchResults.map(p => (
                  <ListGroupItem key={p.id} action onClick={() => selectProduct(p)} style={{cursor:'pointer'}}>
                    <div className="d-flex align-items-center">
                      <img src={p.imageUrl} alt={p.name} style={{width:'40px', height:'50px', objectFit:'cover', marginRight:'10px'}} />
                      <div>
                        <div className="fw-bold">{p.name}</div>
                        <small>{p.price.toLocaleString()}원</small>
                      </div>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            ) : (
              <div className="text-center text-muted py-3">검색 결과가 없습니다.</div>
            )}
          </div>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default StylingWrite;