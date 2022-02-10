import { getAuth, setPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import * as userRepository from "../database/user";

/**
 * Auth listener to thе user's sign-in state
*/
export const authListener = (callback) => {
   const auth = getAuth();
   onAuthStateChanged(auth, (user) => {
     callback(user);
   });
}

/**
 * Register user with username, email and password
 * By default the user's session is persisted even after the user closes the browser
 * By setting the setPersistence to browserSessionPersistence
*/
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

/**
 * Log out
*/
export const logout = () => {
   const auth = getAuth();
   return auth.signOut()
}