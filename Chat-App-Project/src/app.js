// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFVd6h59xX3gOeP4O5LDJQ87w-hJdep64",
  authDomain: "chatapp-57119.firebaseapp.com",
  projectId: "chatapp-57119",
  storageBucket: "chatapp-57119.appspot.com",
  messagingSenderId: "283809287187",
  appId: "1:283809287187:web:75605a2febde4e21d703e6",
  measurementId: "G-8NZ4H3LSQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
console.log(app);

// Validate registration
const form = document.querySelector(".register-form");
const userName = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmedPassword = document.getElementById("confirm-pass");

const submitBtn = document.getElementById("submit");
submitBtn.addEventListener(("click"), (event) => {
  // userName.value.trim();
  // email.value.trim();
  // password.value.trim();
  // confirmedPassword.value.trim();

  if(userName.value === '' ||  email.value === '' || password.value === '' || confirmedPassword.value === '') {
    // Swal.fire("Please, fill all fields!");
    alert("Please, fill in all fields!");
    return;
  }

  // if (!email.value.matches("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")) {
  //   alert("Invalid email!");
  //   return;
  // }

  if (password.value.length < 6 || !password.value.includes('.') && !password.value.includes('!')) {
    alert('Weak password');
    return;
  }

  if (password.value != confirmedPassword.value) {
    alert('Different passwords');
    return;
  }

});
