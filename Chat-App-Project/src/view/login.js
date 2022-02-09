import * as userService from "../services/auth";

userService.authListener((user) => {
   if(user) {
      window.location = "/html/chatRoomsList.html";
      // history.pushState({}, "Chat rooms", "/html/chatRoomsList.html");
   }
});

const loginForm = document.querySelector('.login-form');
loginForm.addEventListener('submit', event => {
   event.preventDefault();
   const email = loginForm['email'].value.trim();
   const password = loginForm['password'].value.trim();
   userService.login(email, password).catch(window.alert)
});
