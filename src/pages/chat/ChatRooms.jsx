import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { chatRoomService } from "../../api/service/chat/ChatRoomService"

/**
 * 채팅방 목록 출력 화면
 * @returns 
 */
function ChatRooms() {

    const [rooms, setRooms] = useState([]) //채팅방 목록
    const [roomName, setRoomName] = useState('') //새로 생성될 채팅방 명
    const [message, setMessage] = useState([]) // 안내 메시지

    const navigate = useNavigate()

    //채팅방 목록을 조회한다.
    const loadRooms = async () => {
        try {
            const res = await chatRoomService.selectChatRoom();

            if (res.data.success) {
                setRooms(res.data.data)
            } else {
                setMessage(res.data.message)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '오류 발생!!!')
        }
    }

    // 채팅방 목록 조회
    useEffect(() => {
        loadRooms()
    }, [])

    // 채팅방 생성 처리
    const handleCreateRoom = async () => {
        if (!roomName.trim()) return;

        try {
            const res = await chatRoomService.createChatRoom(roomName)
            if (res.data.success) {
                setMessage('채팅방이 생성되었습니다.')
                setRooms(prev => [...prev, res.data.data])
                setRoomName('')
            } else {
                setMessage(res.data.message)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '오류 발생!!!')
        }
    }

    //채팅방 입장
    const enterRoom = (roomId) => {
        navigate(`/chat/${roomId}`)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }
    return (
        <div className="max-w-xl mx-auto mt-10 p-4">
            <div className=" flex justify-between items-start">
                <h2 className="text-xl font-bold mb-4">채팅방 목록</h2>
                {/* 오른쪽: 로그아웃 버튼 */}
                <div className="w-1/3 flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>
                </div>
            </div>
            {/* 채팅방 생성 입력창 */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    className="flex-1 border p-2 rounded"
                    placeholder="새 채팅방 이름"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleCreateRoom}
                >
                    생성
                </button>
            </div>

            {/* 채팅방 목록 */}
            <ul className="space-y-2">
                {rooms.map((room) => (
                    <li
                        key={room.id}
                        className="p-3 border rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => enterRoom(room.id)}
                    >
                        🗨️ {room.name}
                    </li>
                ))}
            </ul>

            {/* 메시지 출력 */}
            {message && <p className="mt-4 text-center text-red-600">{message}</p>}
        </div>

    )

}

export default ChatRooms