import { getAuth, setPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import * as userRepository from "../database/user";

export const authListener = (callback) => {
   const auth = getAuth();
   onAuthStateChanged(auth, (user) => {
     callback(user);
   });
}

// Register
export const register = (email, password, username) => {
   const auth = getAuth();
   return setPersistence(auth, browserSessionPersistence)
  .then(() => createUserWithEmailAndPassword(auth, email, password))
  .then((userCredential) => {
     const user = { username, email };
     return userRepository.createUser(user);
  })
}

/**
 * Log in
*/
export const login = (email, password) => {
   const auth = getAuth();
   return setPersistence(auth, browserSessionPersistence)
   .then(() => signInWithEmailAndPassword(auth, email, password))
}

export const logout = () => {
   const auth = getAuth();
   return auth.signOut()
}