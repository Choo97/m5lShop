import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';
import { toast } from 'react-toastify';

const PrivateRoute = ({ children }) => {
  const user = useAtomValue(userAtom);

  // 1. 로그인이 안 되어 있으면
  if (!user.isLogined) {
    // 알림을 띄우고
    // (렌더링 중에 toast를 띄우면 두 번 뜨는 이슈가 있을 수 있어, 보통은 생략하거나 useEffect 안에서 처리하지만 간단히는 이렇게 합니다)
    // alert("로그인이 필요한 서비스입니다."); 
    
    // 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  // 2. 로그인이 되어 있으면 자식 컴포넌트(MyPage 등)를 보여줌
  return children;
};

export default PrivateRoute;