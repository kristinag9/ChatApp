import { db } from "./db";
import { push, ref, update, remove, query, onValue } from "firebase/database";

// Methods for the chat room
// Get chat room by id
export const getChatRoom = (roomId) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   return query(roomRef);
}

// Get all chat rooms
export const chatRoomsListener = (callback) => {
   const roomsRef = ref(db, "chat-rooms");
   onValue(roomsRef, (snapshot) => {
      callback(snapshot);
   })
}

// Create a room in the database
export const createRoom = ({ title, members }) => {
   const roomRef = ref(db, "chat-rooms");
   const newRoomRef = push(roomRef, { title });
   members.forEach(member => addMemberToRoom(newRoomRef.key, member.email));
}

// Update chat room by id
export const updateRoom = (roomId, room) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   return update(roomRef, room);
}

// Delete chat room by id
export const deleteRoom = (roomId) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   return remove(roomRef);
}

// Methods for the members of a chat room
// Add member to a chat room
export const addMemberToRoom = (roomId, member) => {
   const membersRef = ref(db, `chat-rooms/${roomId}/members`);
   return push(membersRef, member);
}

// Remove member from a chat room by id
export const removeMemberFromRoom = (roomId, memberId) => {
   const memberRef = ref(db, `chat-rooms/${roomId}/members/${memberId}`);
   return remove(memberRef);
}

// Methods for the messages of a chat room
// Add message to a chat room
export const addMessageToRoom = (roomId, message) => {
   const messagesRef = ref(db, `chat-rooms/${roomId}/messages`);
   return push(messagesRef, message);
}

// Remove message from a chat room
export const removeMessageFromRoom = (roomId, messageId) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/messages/${messageId}`);
   return remove(messageRef);
}

// Update (Edit) message from a chat room by given messageId
export const updateMessage = (roomId, messageId, message) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/members/${messageId}`);
   return update(messageRef, message);
}

