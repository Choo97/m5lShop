import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client/dist/sockjs'; 
import { Client } from '@stomp/stompjs'; 
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';
import { baseUrl, myAxios } from '../config'; // myAxios 추가
import { FaHeadset } from 'react-icons/fa'; // 상담원 아이콘

const ChatRoom = () => {
  const user = useAtomValue(userAtom);
  
  // 초기 안내 메시지 (화면 표시용)
  const [messages, setMessages] = useState([]);
  
  const [input, setInput] = useState('');
  const roomId = user.id ? String(user.id) : null; 
  const stompClient = useRef(null);

  useEffect(() => {
    // 1. 필수 조건 체크
    if (!user.isLogined || !roomId) return;

    // ★ [추가] 과거 채팅 내역 불러오기
    myAxios.get(`/api/chat/history/${roomId}`)
      .then(res => {
        // 과거 내역이 있으면 그것으로 설정, 없으면 빈 배열
        // 안내 메시지를 맨 앞에 추가하고 싶다면 아래처럼 병합 가능
        const history = res.data;
        const systemMsg = {
          senderName: "시스템",
          message: "문의 내용을 남겨주시면 담당 관리자가 답변해 드립니다.",
          isSystem: true
        };
        setMessages([systemMsg, ...history]);
      })
      .catch(err => console.error("채팅 내역 로드 실패", err));

    // 2. 소켓 중복 연결 방지
    if (stompClient.current && stompClient.current.active) return;

    console.log("🔌 소켓 연결 시도 중...");
    const token = localStorage.getItem('accessToken');

    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws-stomp`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      
      onConnect: () => {
        console.log("✅ Chat Connected!");
        
        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const recv = JSON.parse(message.body);
          setMessages((prev) => [...prev, recv]);
        });
      },
      onStompError: (frame) => {
        console.error('❌ 소켓 에러:', frame.headers['message']);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [user.isLogined, roomId]);

  const sendMessage = () => {
    if (!input.trim() || !stompClient.current || !stompClient.current.connected) return;

    const msgData = {
      roomId: roomId,
      senderId: user.id,
      senderName: user.nickname,
      senderProfile: user.profileImage,
      message: input
    };

    stompClient.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(msgData),
    });

    setInput('');
  };

  return (
    <div className="chat-container border rounded bg-white shadow-sm" style={{ width: '500px', height: '600px', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
      
      {/* 헤더 */}
      <div className="chat-header border-bottom p-3 bg-dark text-white d-flex align-items-center">
        <FaHeadset size={24} className="me-3" />
        <div>
            <div className="fw-bold">고객센터</div>
            <div className="extra-small text-white-50">1:1 문의하기</div>
        </div>
      </div>
      
      <div className="chat-body flex-grow-1 overflow-auto p-3 bg-light">
        {messages.map((msg, idx) => {
          // 시스템 메시지 처리
          if (msg.isSystem) {
             return (
                 <div key={idx} className="text-center my-3">
                    <span className="badge bg-secondary opacity-75 fw-normal text-wrap p-2">
                        {msg.message}
                    </span>
                 </div>
             )
          }

          // 본인 확인 (내 메시지인가?)
          const isMe = msg.senderId === user.id; 
          
          return (
            <div key={idx} className={`mb-3 d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
              
              {/* ★ 수정: 상대방(관리자)일 때 프로필 고정 */}
              {!isMe && (
                <div className="me-2 text-center">
                   <div className="rounded-circle bg-white border d-flex align-items-center justify-content-center" style={{width:'35px', height:'35px', overflow:'hidden'}}>
                     {/* 관리자는 무조건 헤드셋 아이콘 표시 (msg.senderProfile 무시) */}
                     <FaHeadset color="#333" size={20}/>
                   </div>
                   {/* 관리자는 무조건 '관리자'로 이름 표시 (msg.senderName 무시) */}
                   <div className="small text-muted mt-1" style={{fontSize:'0.7rem'}}>관리자</div>
                </div>
              )}

              {/* 말풍선 */}
              <div 
                className={`p-2 px-3 rounded shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white border'}`} 
                style={{maxWidth: '75%', wordBreak: 'break-word', borderTopLeftRadius: !isMe ? '0' : '1rem', borderTopRightRadius: isMe ? '0' : '1rem'}}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input p-3 border-top bg-white">
        <div className="input-group">
            <input 
            type="text" 
            className="form-control border-end-0"
            placeholder="문의 내용을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Enter') sendMessage();
            }}
            />
            <button className="btn btn-primary" onClick={sendMessage}>전송</button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;