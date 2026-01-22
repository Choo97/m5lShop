import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Badge } from 'reactstrap';
import { myAxios } from '../config';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaUserCog } from 'react-icons/fa';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    myAxios.get('/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  // 강제 탈퇴
  const handleDelete = async (id) => {
    if (!window.confirm("정말 이 회원을 탈퇴시키겠습니까? (되돌릴 수 없습니다)")) return;
    try {
      await myAxios.delete(`/api/admin/users/${id}`);
      toast.success("회원이 삭제되었습니다.");
      fetchUsers();
    } catch (err) {
      toast.error("삭제 실패");
    }
  };

  // 권한 변경 (토글)
  const handleRoleChange = async (user) => {
    const newRole = user.role === 'ROLE_USER' ? 'ADMIN' : 'USER';
    if (!window.confirm(`${user.name}님의 권한을 ${newRole}로 변경하시겠습니까?`)) return;

    try {
      await myAxios.patch(`/api/admin/users/${user.id}/role`, { role: newRole });
      toast.success("권한이 변경되었습니다.");
      fetchUsers();
    } catch (err) {
      toast.error("권한 변경 실패");
    }
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">회원 관리</h2>
      
      <Table hover responsive className="align-middle text-center bg-white shadow-sm rounded">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>이메일</th>
            <th>이름 (닉네임)</th>
            <th>가입경로</th>
            <th>가입일</th>
            <th>권한</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>
                {user.name} <br/>
                <span className="text-muted small">({user.nickname})</span>
              </td>
              <td>
                {user.provider ? (
                   <Badge color={user.provider === 'kakao' ? 'warning' : 'success'}>
                     {user.provider.toUpperCase()}
                   </Badge>
                ) : (
                   <Badge color="secondary">일반</Badge>
                )}
              </td>
              <td className="text-muted small">{user.regTime}</td>
              <td>
                <span 
                    className={`fw-bold ${user.role === 'ROLE_ADMIN' ? 'text-danger' : 'text-primary'}`}
                    style={{cursor: 'pointer'}}
                    onClick={() => handleRoleChange(user)}
                    title="클릭하여 권한 변경"
                >
                    {user.role === 'ROLE_ADMIN' ? '관리자' : '일반회원'}
                </span>
              </td>
              <td>
                <Button size="sm" color="light" className="text-danger" onClick={() => handleDelete(user.id)}>
                  <FaTrashAlt /> 탈퇴
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminUserList;