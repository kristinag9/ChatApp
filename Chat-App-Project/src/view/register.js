import * as userService from "../services/auth";

userService.authListener((user) => {
   if(user) {
      window.location.href = "/html/chatRoomsList.html";
   }
});
const registrationForm = document.querySelector('.register-form');
  registrationForm.addEventListener('submit', event => {
    event.preventDefault();

    // Get user info
    const userName = registrationForm['username'].value.trim();
    const email = registrationForm['email'].value.trim();
    const password = registrationForm['password'].value.trim();
    const confirmPassword = registrationForm['confirm-pass'].value.trim();

    if(password !== confirmPassword) {
       alert("Different passwords!");
       return;
    }

    userService.register(email, password, userName).catch(window.alert)
  });
