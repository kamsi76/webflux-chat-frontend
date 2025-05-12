import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatRoomService } from '../../api/service/chat/ChatRoomService';
import { chateMessageService } from '../../api/service/chat/chateMessageService';

export default function ChatMessage() {

  const { roomId } = useParams(); // URL 파라미터에서 roomId를 가져온다.

  const [rooms, setRooms] = useState([]); // 채팅방 목록
  const [currentRoom, setCurrentRoom] = useState({}); // 현재 선택된 채팅방
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [input, setInput] = useState(''); // 메시지 입력값
  const [currentUser, setCurrentUser] = useState({}); // 사용자 정보
  const [participants, setParticipants] = useState([]); // 채팅방 참여자 목록
  const socketRef = useRef(null); // WebSocket 참조
  const messageEndRef = useRef(); // 메시지 목록 끝 참조

  const navigate = useNavigate()

  /**
   * 채팅방 목록을 조회한다.
   */
  async function loadRooms() {

    // 채팅방 입장처리 한다.
    await chatRoomService.enterChatRoom(roomId);

    
    // 내가 입장한 채팅방 목록을 조회한다.
    const res = await chatRoomService.selectMyChatRoom()
    const fetchedRooms = res.data.data;
    setRooms(fetchedRooms)

    // 로그인한 사용자 정보
    const user = localStorage.getItem('user')
    setCurrentUser(JSON.parse(user))

    // 현재 입장한 채팅방 정보
    const selected = fetchedRooms.find((r) => r.id.toString() == roomId)
    if (selected) {

      setCurrentRoom(selected)

      // 채팅방에 입장 중인 참여자 정보를 조회한다.
      const participantsRes = await chatRoomService.selectParticipants(selected.id)
      if (participantsRes.data.success) {
        const participants = participantsRes.data.data; // 참여자 목록
        setParticipants(participants);
      }

      // 채팅방에 있는 메시지 목록을 조회한다.
      const messageRes = await chateMessageService.selectMessagesByRoomId(selected.id);
      if (messageRes.data.success) {
        setMessages(messageRes.data.data)
      }
    }
  }

  /**
   * WebSocket 연결을 초기화한다.
   */
  async function initWebSocket() {

    // 이전 WebSocket 연결이 있다면 닫는다.
    if (socketRef.current) {
      socketRef.current.close();
    }    

    // WebSocket 연결을 초기화한다.
    const socket = new WebSocket(`ws://localhost:8080/ws/chat/${roomId}`);
    socketRef.current = socket;
    socket.onopen = () => {
      console.log('WebSocket 연결 성공');
    };

    // WebSocket 메시지 전달 받은 경우
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);

       // roomId가 없는 경우 무시
      if( !msg.roomId ) return;

      // 메시지 수신 시 메시지 목록에 추가한다.
      if (msg.roomId.toString() !== roomId.toString()) return;

      setMessages((prev) => [...prev, msg]);
    };

  }

  useEffect(() => {

    if (!roomId) return;

    // 🔁 채팅방이 바뀔 때 메시지 초기화
    setMessages([]);
    
    // WebSocket 연결을 초기화한다.
    initWebSocket()
    
    // 채팅방 목록을 조회한다.
    loadRooms()
    
    // Component가 unmount 될 때 WebSocket을 닫는다.
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };

  }, [roomId]);

  // 메시지를 전송한다.
  const handleSend = () => {
    if (input.trim()) {
      const msg = {
        sender: currentUser.id,
        content: input,
        avatar: '/avatar.png',
      };

      socketRef.current.send(JSON.stringify(msg));
      setInput('');
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // sender id로 nickname 찾기
  const getNickname = (senderId) => {
    const found = participants.find(p => p.id == senderId);
    return found ? found.nickname : `사용자(${senderId})`;
  };

  const handlerMoveRoom = (roomId) => {
    navigate(`/chat/${roomId}`)
  }

  return (
    <div className="flex h-screen">
      {/* 채팅방 목록 */}
      <div className="w-1/5 border-r bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">채팅방</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li 
              key={room.id} 
              className="p-2 rounded bg-white shadow" 
              onClick={() => handlerMoveRoom(room.id)}
            >
              🗨️ {room.name}
            </li>
          ))}
        </ul>
      </div>

      {/* 메시지 영역 */}
      <div className="flex flex-col flex-1">
        <div className="p-4 border-b bg-white shadow font-bold text-xl">📢 {currentRoom.name}</div>
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 bg-white">
          {messages.map((msg, idx) => {
            const isMine = msg.sender == currentUser.id; // 메시지의 발신자가 현재 사용자와 같은지 확인
            return (
              <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                  <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full border shadow" />
                  <div className="flex flex-col max-w-[66%]">
                    <p className={`
                        text-xs text-gray-500 mb-1 
                        ${isMine ? 'text-right' : 'text-left'}`}
                    >{getNickname(msg.sender)}</p> {/* 사용자 nickname 처리*/}
                    <div
                      className={`
                        px-4 py-2 rounded-xl shadow inline-block min-w-[10rem] break-words whitespace-normal 
                        ${isMine ? 'bg-blue-500 text-white self-end' : 'bg-gray-100 text-black self-start'}
                      `}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messageEndRef} />
        </div>
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">전송</button>
        </div>
      </div>

      {/* 참여자 목록 */}
      <div className="w-1/5 border-l bg-gray-50 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">참여자</h2>
        <ul className="space-y-2">
          {participants.map((p, idx) => (
            <li key={idx} className="p-2 bg-white rounded shadow">👤 {p.nickname}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
