import { db } from "./db";
import { push, ref, update, remove } from "firebase/database";

// Methods for the users
// Create a user in the database
export const createUser = (user) => {
   const userRef = ref(db, "users");
   const newUserRef = push(userRef, user);
}

// Update user by id
export const updateUser = (userId, user) => {
   const userRef = ref(db, `users/${userId}`);
   const updatedUserRef = update(userRef, user);
}

// Delete user by id
export const deleteUser = (userId) => {
   const userRef = ref(db, `users/${userId}`);
   const removedUserRef = remove(userRef);
}