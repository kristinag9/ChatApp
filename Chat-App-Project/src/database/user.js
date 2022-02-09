import { db } from "./db";
import { push, ref, update, remove, query, onValue } from "firebase/database";

// Methods for the users
// Create a user in the database
// Get user by id
export const getUser = (userId) => {
   const userRef = ref(db, `users/${userId}`);
   return query(userRef);
}

// Get all chat rooms
export const usersListener = (callback) => {
   const usersRef = ref(db, "users");
   onValue(usersRef, (snapshot) => {
      callback(snapshot);
   })
}

export const createUser = (user) => {
   const userRef = ref(db, "users");
   return push(userRef, user);
}

// Update user by id
export const updateUser = (userId, user) => {
   const userRef = ref(db, `users/${userId}`);
   return update(userRef, user);
}

// Delete user by id
export const deleteUser = (userId) => {
   const userRef = ref(db, `users/${userId}`);
   return remove(userRef);
}