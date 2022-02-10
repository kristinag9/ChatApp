/**
 * This file contains the crud operations for the users in my application
 * which are related to the database
*/
import { db } from "./db";
import { push, ref, update, remove, query, onValue } from "firebase/database";

/** Methods for the users */

// Get user by id
export const getUser = (userId) => {
   const userRef = ref(db, `users/${userId}`);
   return query(userRef);
}

/**
 * Method - Listener, which is listening for incoming changes
 * with the users in the database
*/
export const usersListener = (callback) => {
   const usersRef = ref(db, "users");
   onValue(usersRef, (snapshot) => {
      callback(snapshot);
   });
}

/**
 * Create user
*/
export const createUser = (user) => {
   const userRef = ref(db, "users");
   return push(userRef, user);
}

/**
 * Update user by id
*/
export const updateUser = (userId, user) => {
   const userRef = ref(db, `users/${userId}`);
   return update(userRef, user);
}

/**
 * Delete user by id
*/
export const deleteUser = (userId) => {
   const userRef = ref(db, `users/${userId}`);
   return remove(userRef);
}