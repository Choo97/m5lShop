import React, { useState, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { Rating } from 'react-simple-star-rating';
import { toast } from 'react-toastify';
import { myAxios, baseUrl } from '../config';
import { FaCamera, FaTimes } from 'react-icons/fa';

const ReviewWriteModal = ({ isOpen, toggle, orderItem, onSuccess }) => {
  const fileInputRef = useRef();
  
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 별점 변경 핸들러
  const handleRating = (rate) => {
    setRating(rate);
  };

  // 파일 선택 및 미리보기
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (files.length + selectedFiles.length > 5) {
      toast.warning("사진은 최대 5장까지 업로드 가능합니다.");
      return;
    }

    setFiles([...files, ...selectedFiles]);

    // 미리보기 URL 생성
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  // 파일 삭제
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // 리뷰 전송
  const handleSubmit = async () => {
    if (content.trim().length < 5) {
      toast.warning("리뷰 내용은 최소 5자 이상 작성해주세요.");
      return;
    }

    const formData = new FormData();

    // 1. JSON 데이터 (Blob으로 감싸기)
    const reviewData = {
      orderItemId: orderItem.id, // OrderItemDto에 id 필드가 있어야 함
      content: content,
      rating: rating
    };
    
    formData.append("data", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));

    // 2. 이미지 파일들
    files.forEach((file) => {
      formData.append("files", file); // 백엔드 @RequestPart("files")와 일치해야 함
    });

    try {
      await myAxios.post('/api/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("리뷰가 등록되었습니다!");
      onSuccess(); // 모달 닫기 및 목록 갱신
      
      // 상태 초기화
      setContent('');
      setFiles([]);
      setPreviews([]);
      setRating(5);
      
    } catch (error) {
      console.error(error);
      toast.error("리뷰 등록에 실패했습니다.");
    }
  };

  const getImageUrl = (path) => {
      if (!path) return "https://placehold.co/100"; // 기본 이미지
      if (path.startsWith('http')) return path;
      return `${baseUrl}${encodeURI(path)}`; // 백엔드 주소 + 한글 처리
    };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>리뷰 작성</ModalHeader>
      <ModalBody>
        <div className="d-flex align-items-center mb-3">
          <img src={getImageUrl(orderItem?.imgUrl)} alt="product" style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px', borderRadius:'4px' }} />
          <div>
            <div className="fw-bold">{orderItem?.itemNm}</div>
            <div className="text-muted small">상품은 어떠셨나요?</div>
          </div>
        </div>

        <div className="text-center mb-4 p-3 bg-light rounded">
          <div className="mb-2 fw-bold">별점 평가</div>
          <Rating 
            onClick={handleRating} 
            initialValue={rating} 
            size={30} 
            transition 
            fillColor="#FFD700" 
          />
        </div>

        <Form>
          <FormGroup>
            <Label className="fw-bold">리뷰 내용</Label>
            <Input 
              type="textarea" 
              rows="5" 
              placeholder="자세한 후기는 다른 고객들에게 도움이 됩니다." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label className="fw-bold">사진 첨부</Label>
            <div className="d-flex gap-2 flex-wrap">
              {/* 업로드 버튼 */}
              <div 
                className="border d-flex align-items-center justify-content-center rounded bg-light"
                style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                onClick={() => fileInputRef.current.click()}
              >
                <FaCamera size={20} color="#888" />
              </div>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />

              {/* 미리보기 리스트 */}
              {previews.map((src, index) => (
                <div key={index} className="position-relative" style={{ width: '80px', height: '80px' }}>
                  <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px', border:'1px solid #eee' }} />
                  <button 
                    type="button"
                    className="position-absolute top-0 end-0 btn btn-sm btn-danger p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '20px', height: '20px', borderRadius: '50%', transform: 'translate(30%, -30%)' }}
                    onClick={() => removeFile(index)}
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="light" onClick={toggle}>취소</Button>
        <Button color="dark" onClick={handleSubmit}>등록하기</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ReviewWriteModal;