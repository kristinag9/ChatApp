import * as userService from "./services/auth";

// Log out
const logoutBtn = document.getElementById("logout-btn");
if(logoutBtn) {
  logoutBtn.addEventListener("click", event => userService.logout())
}