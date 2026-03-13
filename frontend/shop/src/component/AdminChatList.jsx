import React, { useEffect, useState } from 'react';
import { Container, ListGroup, ListGroupItem, Badge, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../config';
import { FaUserCircle, FaCommentDots } from 'react-icons/fa';

const AdminChatList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = () => {
    myAxios.get('/api/chat/rooms')
      .then(res => {
        setRooms(res.data);
      })
      .catch(err => console.error("채팅방 목록 로드 실패", err));
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <h2 className="fw-bold mb-4 text-center">1:1 문의 목록</h2>
      
      <div className="bg-white p-4 border rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 fw-bold">대화 요청 ({rooms.length})</h5>
          <Button size="sm" outline color="dark" onClick={fetchChatRooms}>새로고침</Button>
        </div>

        {rooms.length > 0 ? (
          <ListGroup flush>
            {rooms.map((room, idx) => (
              <ListGroupItem 
                key={idx}
                action
                className="d-flex justify-content-between align-items-center py-3"
                onClick={() => navigate(`/admin/chat/${room.roomId}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <FaUserCircle size={36} className="text-secondary me-3" />
                  <div>
                    <div className="fw-bold">{room.roomName}</div>
                    
                    <div className="text-muted small">
                      <FaCommentDots className="me-1"/> 
                      최근 대화 기록이 있습니다.
                    </div>
                  </div>
                </div>
                
                <Badge color="primary" pill>입장 &gt;</Badge>
              </ListGroupItem>
            ))}
          </ListGroup>
        ) : (
          <div className="text-center py-5 text-muted">
            아직 생성된 채팅방이 없습니다.
          </div>
        )}
      </div>
    </Container>
  );
};

export default AdminChatList;