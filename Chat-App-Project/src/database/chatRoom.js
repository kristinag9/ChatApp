/**
 * This file contains the crud operations for the chat rooms in my application
 * which are related to the database
*/
import { db } from "./db";
import { push, ref, update, remove, onValue, onChildAdded, onChildRemoved, onChildChanged } from "firebase/database";

/** Methods for the chat room */

/**
 * Listener which is listening for event when changing the chat room title
*/
export const chatRoomTitleListener = (roomId, callback) => {
   const roomRef = ref(db, `chat-rooms/${roomId}/title`);
   onValue(roomRef, (snapshot) => {
      callback(snapshot);
   })
}

/**
 * Get all chat rooms
*/
export const chatRoomsListener = (callback) => {
   const roomsRef = ref(db, "chat-rooms");
   onValue(roomsRef, (snapshot) => {
      callback(snapshot);
   })
}

/**
 * Create room with title and members in the database
*/
export const createRoom = ({ title, members }) => {
   const roomRef = ref(db, "chat-rooms");
   const newRoomRef = push(roomRef, { title });
   members.forEach(member => addMemberToRoom(newRoomRef.key, member.email));
}

/**
 * Update chat room by id
*/
export const updateRoom = (roomId, room) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   return update(roomRef, room);
}

/**
 * Delete chat room by id
*/
export const deleteRoom = (roomId) => {
   const roomRef = ref(db, `chat-rooms/${roomId}`);
   return remove(roomRef);
}

/** Methods for the members of a chat room */

/**
 * Method - Listener, which is listening for incoming changes
 * with the members of the room
*/
export const chatRoomMembersListener = (roomId, callback) => {
   const roomRef = ref(db, `chat-rooms/${roomId}/members`);
   onValue(roomRef, (snapshot) => {
      callback(snapshot);
   })
}

/**
 * Add member to a chat room
*/
export const addMemberToRoom = (roomId, member) => {
   const membersRef = ref(db, `chat-rooms/${roomId}/members`);
   return push(membersRef, member);
}

/**
 * Remove member from a chat room by id
*/
export const removeMemberFromRoom = (roomId, memberId) => {
   const memberRef = ref(db, `chat-rooms/${roomId}/members/${memberId}`);
   return remove(memberRef);
}

/** Methods for the messages of a chat room */

/**
 * Add message to a chat room
*/
export const addMessageToRoom = (roomId, message) => {
   const messagesRef = ref(db, `chat-rooms/${roomId}/messages`);
   return push(messagesRef, message);
}

/**
 * Method - Listener, which is listening for event which happens
 * when a message is added
 */
export const chatRoomMessageAddListener = (roomId, callback) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/messages`);
   onChildAdded(messageRef, callback);
}

/**
 * Remove message from a chat room
*/
export const removeMessageFromRoom = (roomId, messageId) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/messages/${messageId}`);
   return remove(messageRef);
}

/**
 * Method - Listener, which is listening for event which happens
 * when a message is removed
*/
export const chatRoomMessageRemoveListener = (roomId, callback) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/messages`);
   onChildRemoved(messageRef, callback);
}

/**
 * Update  message from a chat room
*/
export const updateMessage = (roomId, messageId, message) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/messages/${messageId}`);
   return update(messageRef, message);
}

/**
* Method - Listener, which is listening for event which happens
* when a message is updated
*/
export const chatRoomMessageUpdateListener = (roomId, callback) => {
   const messageRef = ref(db, `chat-rooms/${roomId}/messages`);
   onChildChanged(messageRef, callback);
}
