import * as userService from "../services/auth";

/**
 * Method which is listening fo authenticated users.
 * If the user is authenticated, redirect to the page with all chat rooms
*/
userService.authListener((user) => {
   if(user) {
      window.location.href = "/html/chatRoomsList.html";
   }
});

/**
 * Add event listener to the login form on submit
*/
const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', event => {
   event.preventDefault();
   const email = loginForm['email'].value.trim();
   const password = loginForm['password'].value.trim();

   // Call the login method from the auth service
   userService.login(email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error code: " + errorCode, + " " + "Error:" + errorMessage);
   })
});
