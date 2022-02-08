import { db } from "./db";
import { push, ref, update, remove, query } from "firebase/database";

// Methods for the chat room
// Get chat room by id
export const getChatRoom = (roomId) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   const returnedRoom = query(roomRef);
}

// Get all chat rooms
export const getChatRooms = () => {
   const roomsRef = ref(db, "chat-rooms");
   const returnedRoom = query(roomsRef);
}

// Create a room in the database
export const createRoom = (room) => {
   const roomRef = ref(db, "chat-rooms");
   const newRoomRef = push(roomRef, room);
}

// Update chat room by id
export const updateRoom = (roomId, room) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   const updatedRoomRef = update(roomRef, room);
}

// Delete chat room by id
export const deleteRoom = (roomId) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   const removedRoomRef = remove(roomRef);
}

// Methods for the members of a chat room
// Add member to a chat room
export const addMemberToRoom = (roomId, member) => {
   const membersRef = ref(db, `chat-rooms/${roomId}/members`);
   const newMemberRef = push(membersRef, member);
}

// Remove member from a chat room by id
export const removeMemberFromRoom = (roomId, memberId) => {
   const memberRef = ref(db, `chat-rooms/${roomId}/members/${memberId}`);
   const removedMemberRef = remove(memberRef);
}

// Methods for the messages of a chat room
// Add message to a chat room
export const addMessageToRoom = (roomId, message) => {
   const messagesRef = ref(db, `chat-rooms/${roomId}/messages`);
   const newMessageRef = push(messagesRef, message);
}

// Remove message from a chat room
export const removeMessageFromRoom = (roomId, messageId) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/messages/${messageId}`);
   const removedMessageRef = remove(messageRef);
}

// Update (Edit) message from a chat room by given messageId
export const updateMessage = (roomId, messageId, message) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/members/${messageId}`);
   const updatedMessageRef = update(messageRef, message);
}

