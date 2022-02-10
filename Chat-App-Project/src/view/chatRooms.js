import * as authService from "../services/auth";
import * as userRepository from "../database/user";
import * as roomRepository from "../database/chatRoom";

/**
 * Get elements from the html pages which will be used for dom manipulation
*/
const closeModalBtn = document.getElementById("close-modal-btn");
const createChatRoomBtn = document.getElementById("create-room-btn");
const membersList = document.querySelector(".show-users-emails");
const createRoomForm = document.querySelector(".modal-form");
const inputTitleRoom = document.getElementById("title-input");
const chatRoomList = document.querySelector(".rooms-wrapper");

/**
 * Declare object which will keep information for the selected users
 * from the modal form to be added to the new created room.
 * It also keep information about the current user's email
*/
const data = {
   selectedUsers: [],
   currentUser: { id: "", email: "" }
};

/**
 * Call the aut service to be sure that a user is authenticated
*/
authService.authListener((user) => {
   // If the user is not authenticated, redirect to the login form
   if(!user) {
      window.location.href = "/html/login.html";
      return;
   }
   // If the user is already authenticated, save his email to the currentUser object
   data.currentUser.email = user.email;
})

/**
 * Call the users listener
*/
userRepository.usersListener((users) => {
   membersList.innerHTML = "";
   // For each user in the database schema users create a list item
   // which will be appended to the list of users in the modal form
   users.forEach((user) => {
      // Create a user object with the key and email of a user in the database
      const userObject = { id: user.key, email: user.val().email };

      // Check if the current user is creating a room, so I want to remove him
      // from the list of members to be added
      if(userObject.email === data.currentUser.email && !data.currentUser.id) {
         data.currentUser.id = userObject.id;
         data.selectedUsers = [ data.currentUser ];
         return;
      }
      // Create list item modal only for the other users in the database
      // excluding the current user
      const itemToAdd = createListItem(userObject);
      membersList.appendChild(itemToAdd);
   });
})

/**
 * Call the chat room listener
*/
roomRepository.chatRoomsListener((rooms) => {
   chatRoomList.innerHTML = "";
   // For each room create a list item with the title which the user has entered
   // and append it to the list with chat rooms
   rooms.forEach((room) => {
      const roomToAdd = createRoomListElement( { title: room.val().title, id: room.key });
      chatRoomList.appendChild(roomToAdd);
   });
})

// Create user list item for given user
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

   // Add event listener to the add member button in the modal form
   addButton.addEventListener("click", (event) => {
      event.preventDefault();
      // Find the index of the user in the list with users to be selected and added to the room
      const userIndex = data.selectedUsers.findIndex(selectedUser => selectedUser.id === user.id);
      // If the user is not found, he is already selected and may be deselected
      if(userIndex === -1) {
         addButton.innerText = "-";
         data.selectedUsers.push(user);
         return;
      }
      // If user is not already selected, he may be selected and the inner text is "+"
      addButton.innerText = "+";
      data.selectedUsers.splice(userIndex, 1);
   });

   // Return the created list item
   return listItem;
}

/**
 * Create room list item by given room name
*/
const createRoomListElement = (room) => {
   const listItem = document.createElement('li');
   listItem.classList.add("room-details");
   const btnRoom = document.createElement("a");
   btnRoom.classList.add("room-name-btn");
   btnRoom.innerText = `${room.title}`;
   listItem.appendChild(btnRoom);
   btnRoom.href = `/html/chatRoom?roomId=${room.id}`;

   // Return the list item
   return listItem;
 }

/**
 * Method for opening the dialog box
*/
const toggleModal = (open) => {
   let backgroundWrapper = document.querySelector(".wrapper");
   const createRoomDialog = document.querySelector(".wrapper-modal");
   backgroundWrapper.classList.toggle("hidden-overflow", open);
   backgroundWrapper.toggleAttribute("hidden", !open);
   createRoomDialog.toggleAttribute("hidden", !open);
}

/**
 * Handler for opening the modal
*/
const openModalHandler = (event) => {
  toggleModal(true);
}

/**
 * Handler for closing the modal when click the close button
*/
const closeModalHandler = (event) => {
  toggleModal(false);
  // Get all + buttons for the members in the list
  const addUserButtons = document.querySelectorAll(".add-member-btn");
  addUserButtons.forEach((button) => {
     if(button.innerText === "-") {
        button.innerText = "+";
     }
  })
  inputTitleRoom.value = "";
  data.selectedUsers = [ data.currentUser ];
}

/**
 * Method which creates a room and saves it in teh database when submit the form
*/
const createRoomSubmitHandler = (event) => {
   event.preventDefault();
   const title = inputTitleRoom.value.trim();
   roomRepository.createRoom({
      title,
      members: data.selectedUsers
   });

   // Close the modal
   closeModalHandler();
}

 // Add functionality to the create room button -> opening the modal for creating a room
createChatRoomBtn.addEventListener("click", openModalHandler);

// Add functionality to the close button of the modal for creating a new room
closeModalBtn.addEventListener("click", closeModalHandler);

// Add functionality to the create room button in the modal form
createRoomForm.addEventListener("submit", createRoomSubmitHandler);