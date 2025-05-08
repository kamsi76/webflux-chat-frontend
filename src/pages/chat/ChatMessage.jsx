import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { chatRoomService } from '../../api/service/chat/ChatRoomService';
import { chateMessageService } from '../../api/service/chat/chateMessageService';

export default function ChatMessage() {

  const { roomId } = useParams();

  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUser] = useState('myUsername'); // 예시 사용자
  const [participants, setParticipants] = useState([]);
  const socketRef = useRef(null);
  const messageEndRef = useRef();

  useEffect(() => {

    async function loadRooms() {
        const res = await chatRoomService.selectChatRoom()
        const fetchedRooms = res.data.data;
        setRooms(fetchedRooms)

        const selected = fetchedRooms.find((r) => r.id.toString() == roomId )
        if( selected ) {
            setCurrentRoom(selected)

            //채팅방에 입장처리 한다.
            await chatRoomService.enterChatRoom(selected.id)

            const participantsRes = await chatRoomService.selectParticipants(selected.id)
            if (participantsRes.data.success) {
              const names = participantsRes.data.data.map(u => u.nickname); // 또는 username
              setParticipants(names);
            }

            const messageRes = await chateMessageService.selectMessagesByRoomId(selected.id);
            if( messageRes.data.success ) {
              setMessages(messageRes.data.data)
            }

        }
    }

    loadRooms()

  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const socket = new WebSocket(`ws://localhost:8080/ws/chat/${roomId}`);
    socketRef.current = socket;
    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      setMessages((prev) => [...prev, msg]);
    };
    return () => socket.close();
  }, [roomId]);

  const handleSend = () => {
    if (input.trim()) {
      const msg = {
        sender: currentUser,
        content: input,
        avatar: '/avatar.png',
      };
      debugger
      socketRef.current.send(JSON.stringify(msg));
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen">
      {/* 채팅방 목록 */}
      <div className="w-1/5 border-r bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">채팅방</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li key={room.id} className="p-2 rounded bg-white shadow">
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
            const isMine = msg.sender === currentUser;
            return (
              <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                  <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full border shadow" />
                  <div className="flex flex-col max-w-[66%]">
                    <p className={`text-xs text-gray-500 mb-1 ${isMine ? 'text-right' : 'text-left'}`}>{msg.sender}</p>
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
          {participants.map((name, idx) => (
            <li key={idx} className="p-2 bg-white rounded shadow">👤 {name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
