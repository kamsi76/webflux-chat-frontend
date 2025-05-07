import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { chatRoomService } from "../../api/service/chat/ChatRoomService"

function ChatRooms() {

    const [rooms, setRooms] = useState([]) //채팅방 목록
    const [roomName, setRoomName] = useState('') //새로 생성될 채팅방 명
    const [message, setMessage] = useState([]) // 안내 메시지

    const navigate = useNavigate()

    const loadRooms = async () => {
        try {
            const res = await chatRoomService.selectChatRoom();

            console.log( res )
            debugger
            if (res.data.success) {
                setRooms(res.data.data)
            } else {
                setMessage(res.data.message)
            }
        } catch (error) {
            debugger
            setMessage(error.response?.data?.message || '오류 발생!!!')
        }
    }


    // 채팅방 목록 조회
    useEffect(() => {
        loadRooms()
    }, [])

    const handleCreateRoom = async () => {
        if( !roomName.trim() ) return;

        try {
            const res = await chatRoomService.createChatRoom(roomName)
            if( res.data.success ) {
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

    const enterRoom = (roomId) => {
        navigate(`/chat/${roomId}`)
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-4">
            <h2 className="text-xl font-bold mb-4">채팅방 목록</h2>

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