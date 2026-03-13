import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router-dom"; // URL 파라미터 받기
import { baseUrl, myAxios } from "../config";
import { useAtomValue } from 'jotai';
import { userAtom } from '../atoms';

const AdminChatRoom = () => {
  const { userId } = useParams(); // ★ URL에서 대화할 유저 ID를 가져옴 (예: 10)
  const roomId = userId; // 그 유저 ID가 곧 방 번호임

  const adminUser = useAtomValue(userAtom); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const stompClient = useRef(null);

  useEffect(() => {
    myAxios
      .get(`/api/chat/history/${roomId}`)
      .then((res) => {
        // 서버에서 가져온 내역으로 초기화
        setMessages(res.data);
        console.log("✅ 대화 내역 로드 완료", res.data);
      })
      .catch((err) => console.error("대화 내역 로드 실패", err));

    // 1. 관리자 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    // 2. 소켓 연결 (기존과 동일하지만, 관리자 권한으로 접속)
    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws-stomp`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log(`✅ 관리자: ${roomId}번방 연결 성공`);

        // ★ 해당 유저의 방을 구독
        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const recv = JSON.parse(message.body);
          setMessages((prev) => [...prev, recv]);
        });
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim() || !stompClient.current) return;

    const msgData = {
      roomId: roomId,
      senderId: adminUser.id,  // 관리자 ID (또는 현재 로그인한 관리자의 ID)
       senderName: adminUser.nickname || "관리자",  // 이름 고정
      message: input,
      
    };

    stompClient.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(msgData),
    });
    setInput("");
  };

  return (
    <div className="p-3 border rounded">
      <h5>📞 {userId}번 회원님과의 대화</h5>

      <div
        className="chat-body flex-grow-1 overflow-auto mb-3 p-2 bg-light"
        style={{ height: "400px" }}
      >
        {messages.map((msg, idx) => {

          // 1. 관리자 여부 판단 (이름보다는 ID로 판단하는 게 정확합니다)
          // sendMessage에서 9999로 보냈으므로, 받은 데이터의 senderId가 9999인지 확인
          // (주의: 백엔드에서 senderId가 Long 타입이면 숫자 비교, String이면 문자열 비교)
          const isAdmin = msg.senderRole === 'ROLE_ADMIN' || msg.senderRole === 'ADMIN';

          return (
            <div
              key={idx}
              className={`mb-2 ${isAdmin ? "text-end" : "text-start"}`}
            >
              <div
                style={{
                  display: "inline-block",
                  maxWidth: "70%",
                  textAlign: "left",
                }}
              >
                {/* 이름 표시 (상대방일 경우) */}
                {!isAdmin && (
                  <div className="small text-muted ms-1">{msg.senderName}</div>
                )}

                {/* 말풍선 */}
                <span
                  className={`d-inline-block p-2 rounded ${isAdmin ? "bg-primary text-white" : "bg-white border"}`}
                >
                  {/* ★ 필드명 확인: msg.message가 없으면 msg.content 등을 시도 */}
                  {msg.message || msg.content || "내용 없음"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex">
        <input
          className="form-control me-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button className="btn btn-dark" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
};

export default AdminChatRoom;
