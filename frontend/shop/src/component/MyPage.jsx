import React, { useEffect, useState } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { myAxios } from '../config';
import { toast } from 'react-toastify';
import { useSetAtom } from 'jotai';
import { userAtom } from '../atoms';

const MyPage = () => {
  const setUser = useSetAtom(userAtom);
  const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const openPostcode = useDaumPostcodePopup(scriptUrl);

  const [formData, setFormData] = useState({
    nickname: '',
    email: '', // 읽기 전용
    phone: '',
    zipcode: '',
    address: '',
    detailAddress: ''
  });

  // 1. 내 정보 불러오기
  useEffect(() => {
    myAxios.get('/api/user/me')
      .then(res => {
        const { nickname, email, phone, zipcode, address, detailAddress } = res.data;
        setFormData({ 
            nickname: nickname || '', 
            email: email || '', 
            phone: phone || '', 
            zipcode: zipcode || '', 
            address: address || '', 
            detailAddress: detailAddress || '' 
        });
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 주소 찾기
  const handleAddressComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';
    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
      fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
    setFormData(prev => ({ ...prev, zipcode: data.zonecode, address: fullAddress }));
  };

  // 수정 요청
  const handleUpdate = async () => {
    try {
      await myAxios.patch('/api/user/me', formData);
      toast.success("정보가 수정되었습니다.");
      
      // 전역 상태(Atom)도 업데이트 (선택사항)
      // setUser(prev => ({ ...prev, nickname: formData.nickname })); 
    } catch (error) {
      toast.error("수정 실패");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <h2 className="fw-bold mb-4 text-center">MY PAGE</h2>
      <Form>
        <FormGroup>
          <Label>이메일</Label>
          <Input type="text" value={formData.email} disabled className="bg-light" />
        </FormGroup>
        <FormGroup>
          <Label>닉네임</Label>
          <Input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
        </FormGroup>
        <FormGroup>
          <Label>전화번호</Label>
          <Input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="010-0000-0000" />
        </FormGroup>
        
        <FormGroup>
          <Label>주소</Label>
          <div className="d-flex gap-2 mb-2">
            <Input type="text" value={formData.zipcode} placeholder="우편번호" readOnly style={{width: '120px'}} />
            <Button color="secondary" onClick={() => openPostcode({ onComplete: handleAddressComplete })}>주소 찾기</Button>
          </div>
          <Input type="text" value={formData.address} readOnly className="mb-2" />
          <Input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleChange} placeholder="상세주소" />
        </FormGroup>

        <Button color="dark" size="lg" block className="mt-4 w-100" onClick={handleUpdate}>
          정보 수정
        </Button>
      </Form>
    </Container>
  );
};

export default MyPage;