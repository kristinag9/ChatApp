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
 * Add event listener to the register form on submit
*/
const registrationForm = document.querySelector(".register-form");
  registrationForm.addEventListener("submit", event => {
    event.preventDefault();

    const userName = registrationForm["username"].value.trim();
    const email = registrationForm["email"].value.trim();
    const password = registrationForm["password"].value.trim();
    const confirmPassword = registrationForm["confirm-pass"].value.trim();

    // Email validation
    if (!email.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")) {
      alert("Invalid email!");
      return;
   }

   // Password validation
   // At least one upper case letter, (?=.*?[A-Z])
   // At least one lower case letter, (?=.*?[a-z])
   // At least one digit, (?=.*?[0-9])
   // At least one special character, (?=.*?[#?!@$%^&*-])
   // Minimum eight in length .{6,} (with the anchors)
   if (password.length < 6 || !password.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")) {
        alert('Weak password!');
        return;
   }

   // Check if the passwords a user entered are equal
   if(password !== confirmPassword) {
      alert("Different passwords!");
      return;
   }

   // Call the register method from the auth service
   userService.register(email, password, userName)
   .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Error code: " + errorCode, + " " + "Error:" + errorMessage);
   })
});
