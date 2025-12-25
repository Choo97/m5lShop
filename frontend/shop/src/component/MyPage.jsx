import React, { useEffect, useState, useRef } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { myAxios, baseUrl } from '../config';
import { toast } from 'react-toastify';
import { useAtom } from 'jotai'; // useAtom 사용 (읽기+쓰기)
import { userAtom } from '../atoms';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import { FaUserCircle, FaCamera } from 'react-icons/fa';

const MyPage = () => {
  // 전역 상태 읽기/쓰기 모두 필요하므로 useAtom 사용
  const [user, setUser] = useAtom(userAtom);
  
  const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const openPostcode = useDaumPostcodePopup(scriptUrl);
  
  const fileInputRef = useRef(null);
  const [profileImg, setProfileImg] = useState('');
  const [socialStatus, setSocialStatus] = useState({ kakao: false, naver: false });

  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    phone: '',
    gender: '남자',
    zipcode: '',
    address: '',
    detailAddress: ''
  });

  // 이미지 URL 처리 헬퍼 함수
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${baseUrl}${encodeURI(path)}`;
  };

  // 1. 내 정보 및 소셜 연동 상태 불러오기
  useEffect(() => {
    // PrivateRoute가 지켜주므로 로그인 체크 없이 바로 호출
    
    // (1) 회원 정보
    myAxios.get('/api/user/me')
      .then(res => {
        const { nickname, email, phone, gender, zipcode, address, detailAddress, profileImage } = res.data;
        setFormData({
          nickname: nickname || '',
          email: email || '',
          phone: phone || '',
          gender: gender || '남자',
          zipcode: zipcode || '',
          address: address || '',
          detailAddress: detailAddress || ''
        });
        setProfileImg(profileImage);
      })
      .catch(err => console.error("내 정보 로드 실패:", err));

    // (2) 소셜 연동 정보
    myAxios.get('/api/user/social')
      .then(res => setSocialStatus(res.data))
      .catch(err => console.error("소셜 정보 로드 실패:", err));
      
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

  // 프로필 사진 변경
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append('file', file);

    try {
      const res = await myAxios.post('/api/user/profile', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 성공 시 이미지 즉시 변경
      setProfileImg(res.data);
      
      // ★ 전역 상태(Atom)의 프로필 이미지도 업데이트 (네비바 즉시 반영)
      setUser(prev => ({ ...prev, profileImage: res.data }));
      
      toast.success("프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("사진 업로드 실패");
    }
  };

  // 정보 수정 요청
  const handleUpdate = async () => {
    try {
      await myAxios.patch('/api/user/me', formData);
      toast.success("정보가 수정되었습니다.");

      // ★ 전역 상태(Atom) 업데이트 (닉네임 등 즉시 반영)
      setUser(prev => ({ 
          ...prev, 
          nickname: formData.nickname,
          phone: formData.phone
          // 필요한 다른 정보도 업데이트 가능
      })); 
      
    } catch (error) {
      toast.error("수정 실패");
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <h2 className="fw-bold mb-4 text-center">MY PAGE</h2>
      
      {/* 프로필 사진 영역 */}
      <div className="text-center mb-5">
        <div
          className="position-relative d-inline-block"
          style={{ cursor: 'pointer' }}
          onClick={() => fileInputRef.current.click()}
        >
          {profileImg ? (
            <img
              src={getImageUrl(profileImg)}
              alt="Profile"
              className="rounded-circle border"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
            />
          ) : (
            <FaUserCircle size={120} color="#ddd" />
          )}

          <div
            className="position-absolute bottom-0 end-0 bg-white rounded-circle border d-flex align-items-center justify-content-center"
            style={{ width: '35px', height: '35px' }}
          >
            <FaCamera color="#555" size={18} />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfileChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
      </div>

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
          <Label className="d-block">성별</Label>
          <div className="d-flex gap-4 mt-2">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="gender"
                  value="남자"
                  checked={formData.gender === '남자'}
                  onChange={handleChange}
                  // disabled // 수정 가능하게 하려면 주석 해제
                />{' '}
                남성
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="gender"
                  value="여자"
                  checked={formData.gender === '여자'}
                  onChange={handleChange}
                  // disabled
                />{' '}
                여성
              </Label>
            </FormGroup>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>주소</Label>
          <div className="d-flex gap-2 mb-2">
            <Input type="text" value={formData.zipcode} placeholder="우편번호" readOnly style={{ width: '120px' }} />
            <Button color="secondary" onClick={() => openPostcode({ onComplete: handleAddressComplete })}>주소 찾기</Button>
          </div>
          <Input type="text" value={formData.address} readOnly className="mb-2" />
          <Input type="text" name="detailAddress" value={formData.detailAddress} onChange={handleChange} placeholder="상세주소" />
        </FormGroup>

        <FormGroup>
          <Label>소셜 계정 연동</Label>
          <div className="d-flex gap-3 mt-2">
            {/* 카카오 */}
            <div className="text-center">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle mb-1"
                style={{
                  width: '50px', height: '50px',
                  backgroundColor: socialStatus.kakao ? '#FEE500' : '#f0f0f0',
                  color: socialStatus.kakao ? '#000' : '#ccc',
                  fontSize: '1.5rem',
                  transition: '0.3s'
                }}
              >
                <RiKakaoTalkFill />
              </div>
              <small className={socialStatus.kakao ? "fw-bold text-dark" : "text-muted"}>
                {socialStatus.kakao ? "연동됨" : "미연동"}
              </small>
            </div>

            {/* 네이버 */}
            <div className="text-center">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle mb-1"
                style={{
                  width: '50px', height: '50px',
                  backgroundColor: socialStatus.naver ? '#03C75A' : '#f0f0f0',
                  color: 'white',
                  fontSize: '1.2rem',
                  transition: '0.3s'
                }}
              >
                <SiNaver />
              </div>
              <small className={socialStatus.naver ? "fw-bold text-dark" : "text-muted"}>
                {socialStatus.naver ? "연동됨" : "미연동"}
              </small>
            </div>
          </div>
        </FormGroup>

        <Button color="dark" size="lg" block className="mt-4 w-100" onClick={handleUpdate}>
          정보 수정
        </Button>
      </Form>
    </Container>
  );
};

export default MyPage;