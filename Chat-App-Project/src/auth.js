// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getDatabase, push, onValue, set, ref } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();

function getAllUsers() {
  const dataRef = ref(db, 'users');
  const users = [];
  onValue(dataRef, (snapshot) => {
   snapshot.forEach((childSnapshot) => {
     const childKey = childSnapshot.key;
     const childData = childSnapshot.val();
     users.push(childData);
   });
 }, {
   onlyOnce: true
 });
 return users;
};
const allUsers = getAllUsers();
// console.log(allUsers);

// REGISTRATION FORM
const registrationForm = document.querySelector('.register-form');
if(registrationForm) {
  registrationForm.addEventListener('submit', event => {
    event.preventDefault();

    // Get user info
    const userName = registrationForm['username'].value.trim();
    const email = registrationForm['email'].value.trim();
    const password = registrationForm['password'].value.trim();
    const confirmPassword = registrationForm['confirm-pass'].value.trim();

    // Validation for empty fields
    if (userName === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Please, fill in all fields!');
        return;
    }

    // Email validation
    if (!email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")) {
        alert('Invalid email!');
        return;
    }

    // Password validation
    // At least one upper case English letter, (?=.*?[A-Z])
    // At least one lower case English letter, (?=.*?[a-z])
    // At least one digit, (?=.*?[0-9])
    // At least one special character, (?=.*?[#?!@$%^&*-])
    // Minimum eight in length .{8,} (with the anchors)
    if (password.length < 6 || !password.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")) {
        alert('Weak password!');
        return;
    }

    // Confirming password
    if (password != confirmPassword) {
      alert('Different passwords!');
      return;
    }

    // Save the user data into the database
    const dataRef = ref(db, 'users');
    const usersRef = push(dataRef);
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // When the user is signed in, take the data and save it
      set(usersRef, {
        username: userName,
        email: email,
        password: password
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error code: " + errorCode, + " " + "Error:" + errorMessage);
    });
    userRedirect();
  });
        // registrationForm.reset();
}

// Finding all emails of the users
// function findUsersEmails() {
//   let emails = [];
//   onValue(dataRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const childKey = childSnapshot.key;
//       const childData = childSnapshot.val();
//       emails.push(childData.email);
//     });
//   }, {
//     onlyOnce: true
//   });
//   return emails;
// };

// LOG IN
const loginForm = document.querySelector('.login-form');
if(loginForm) {
  loginForm.addEventListener('submit', event => {
    event.preventDefault();

    // Get user info
    const userName = loginForm['username'].value.trim();
    const email = loginForm['email'].value.trim();
    const password = loginForm['password'].value.trim();

    // Retrieve the data from the database
    const usersNames = allUsers.map(user => user.username);
    const usersEmails = allUsers.map(user => user.email);
    const usersPasswords = allUsers.map(user => user.password);

     // Validation for empty fields
    if (userName === '' || email === '' || password === '') {
        alert('Please, fill in all fields!');
        return;
    }

    // Username validation -> check if the database contains a user with this username
    if (!usersNames.some(name => name === userName)) {
        alert('Incorrect username! Try again!');
        return;
    }

      // Email validation -> check if the database contains a user with this email
      if (!usersEmails.some(em => em === email)) {
        alert('Incorrect email! Try again!');
        return;
    }

     // Email validation -> check if the database contains a user with this password
     if (!usersPasswords.some(pass => pass === password)) {
        alert('Incorrect password! Try again!');
        return;
     }

    signInWithEmailAndPassword(auth, email, password)
    // when the user is signed in, check for errors
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error code: " + errorCode, + " " + "Error:" + errorMessage);
    });
    userRedirect();
  });
}

// Redirect the user to the page of char rooms
function userRedirect() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location = "/html/chatRoomsList.html";
    }
  });
}