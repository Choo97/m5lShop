import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const user = useAtomValue(userAtom);

  // 1. 로그인이 안 되어 있다면 -> 로그인 페이지로
  if (!user.isLogined) {
    toast.info("로그인이 필요합니다.");
    return <Navigate to="/login" replace />;
  }

  // 2. 로그인은 했는데 관리자가 아니라면 -> 메인 페이지로
  // (백엔드 DB에 'ROLE_ADMIN'으로 저장되어 있다고 가정)
  if (user.role !== 'ROLE_ADMIN') {
    toast.error("접근 권한이 없습니다. (관리자 전용)");
    return <Navigate to="/" replace />;
  }

  // 3. 통과 -> 관리자 페이지 보여줌
  return children;
};

export default AdminRoute;