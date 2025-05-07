import axiosInstance from "../../instance/axiosInterceptor";

/**
 * 채팅메시지 관리 Service
 */
class ChateMessageService {

    /**
     * 특정 채팅방의 메시지 목록 조회
     * @param {number} roomId
     * @returns {Promise<Response<ChatMessage[]>>}
     */
    async selectMessagesByRoomId(roomId) {
        return await axiosInstance.get(`/chatroom/${roomId}/messages`)
    }

}

export const chateMessageService = new ChateMessageService();