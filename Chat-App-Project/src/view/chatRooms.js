import * as authService from "../services/auth";
import * as userRepository from "../database/user";
import * as roomRepository from "../database/chatRoom";

const closeModalBtn = document.getElementById("close-modal-btn");
const createChatRoomBtn = document.getElementById("create-room-btn");
const membersList = document.querySelector(".show-users-emails");
const createRoomForm = document.querySelector(".modal-form");
const inputTitleRoom = document.getElementById("title-input");
const chatRoomList = document.querySelector(".rooms-wrapper");


const data = { selectedUsers: [], currentUser: {id: "", email: ""} };

authService.authListener(user => {
   if(!user) {
      window.location.href = "/html/login.html";
      return;
   }
   data.currentUser.email = user.email;
})

userRepository.usersListener(users => {
   membersList.innerHTML = "";
   users.forEach(user => {
      const userObject = { id: user.key, email: user.val().email };
      if(userObject.email === data.currentUser.email && !data.currentUser.id) {
         data.currentUser.id = userObject.id;
         data.selectedUsers = [ data.currentUser ];
         return;
      }
      membersList.appendChild(createListItem(userObject));
   });
})

roomRepository.chatRoomsListener(rooms => {
   chatRoomList.innerHTML = "";
   rooms.forEach(room => {
      chatRoomList.appendChild(createRoomListElement( { title: room.val().title, id: room.key }));
   });
})

// For each email of the users emails in the database create a modal which appends
// each email item to the modal for creating a new room
const createListItem = (user) => {
   const listItem = document.createElement("li");
   listItem.classList.add("user");

   const emailTag = document.createElement("h4");
   emailTag.classList.add("user-email");
   emailTag.innerText = user.email;

   const addButton = document.createElement("button");
   addButton.classList.add("add-member-btn");
   addButton.type = "custom";
   addButton.innerText = "+";

   listItem.appendChild(emailTag);
   listItem.appendChild(addButton);

   addButton.addEventListener("click", event => {
      event.preventDefault();
      const userIndex = data.selectedUsers.findIndex(selectedUser => selectedUser.id === user.id);
      if(userIndex === -1) {
         addButton.innerText = "-";
         data.selectedUsers.push(user);
         return;
      }
      addButton.innerText = "+";
      data.selectedUsers.splice(userIndex, 1);
   })
   return listItem;
}

const createRoomListElement = (room) => {
   const listItem = document.createElement('li');
   listItem.classList.add("room-details");
   const btnRoom = document.createElement("a");
   btnRoom.classList.add("room-name-btn");
   btnRoom.innerText = `${room.title}`;
   listItem.appendChild(btnRoom);
   btnRoom.href = `/html/chatRoom?roomId=${room.id}`;
   return listItem;
 }

// Method for opening the dialog box
const toggleModal = (open) => {
   let backgroundWrapper = document.querySelector(".wrapper");
   const createRoomDialog = document.querySelector(".wrapper-modal");
   backgroundWrapper.classList.toggle("hidden-overflow", open);
   backgroundWrapper.toggleAttribute("hidden", !open);
   createRoomDialog.toggleAttribute("hidden", !open);
};

const openModalHandler = (event) => {
  toggleModal(true);
}

const closeModalHandler = (event) => {
  toggleModal(false);
  const addUserButtons = document.querySelectorAll(".add-member-btn");
  addUserButtons.forEach(button => {
     if(button.innerText === "-") {
        button.innerText = "+";
     }
  })
  inputTitleRoom.value = "";
  data.selectedUsers = [ data.currentUser ];
}

const createRoomSubmitHandler = (event) => {
   event.preventDefault();
   const title = inputTitleRoom.value.trim();
   console.log(data.selectedUsers);
   roomRepository.createRoom({ title, members: data.selectedUsers });
   closeModalHandler();
}

 // Add functionality to the create room button -> opening the modal for creating a room
createChatRoomBtn.addEventListener("click", openModalHandler);

// Add functionality to the close button of the modal for creating a new room
closeModalBtn.addEventListener("click", closeModalHandler);

createRoomForm.addEventListener("submit", createRoomSubmitHandler);