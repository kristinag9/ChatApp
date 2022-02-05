// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getDatabase, set, push, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFVd6h59xX3gOeP4O5LDJQ87w-hJdep64",
  authDomain: "chatapp-57119.firebaseapp.com",
  // databaseURL: "https://chatapp-57119-default-rtdb.firebaseio.com",
  projectId: "chatapp-57119",
  storageBucket: "chatapp-57119.appspot.com",
  messagingSenderId: "283809287187",
  appId: "1:283809287187:web:75605a2febde4e21d703e6",
  measurementId: "G-8NZ4H3LSQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase(app);
// console.log(db);

// const dataRef = ref(db, "messages");
// set(dataRef, {
//   "a": "b"
// })

// const messageList;
// For messages
// .addEventListener("change". event => {
//   const dataRef = ref(db, "messages");
//   const messageRef = push(dataRef);

//   Set(messageRef, {
//     "username": // from db
//     "date": Date.now().toLocaleString(),
//     "text": event.target.value
//   });

// event.target.value = "";
// })

// za da vzemem message
// .addEventListener("change", event => {
// OT HTML-A VZIMAM FORMATA ZA MESSAGE
// const message = data.val();
// const listItem = document.createElement('li');
// listItem.innerHTML = `
//   <div class="user-info">
//     <span class="username><b>${message.username}</b></span>
//     <span class="date>${message.date}</span>
//   </div>
//   <span class="message">${message.text}</span>
// `
// messageList.appendChild(listItem);
// });

function getChatRoomsTitles() {
  const dataRef = ref(db, 'chat-rooms');
  const roomsTitles = [];
  onValue(dataRef, (snapshot) => {
   snapshot.forEach((childSnapshot) => {
     const childKey = childSnapshot.key;
     const childData = childSnapshot.val();
     roomsTitles.push(childData.title);
   });
 }, {
   onlyOnce: true
 });
 return roomsTitles;
};

// Finding all emails of the users
const findUsersEmails = () => {
  const dataRef = ref(db, 'users');
  let emails = [];
  onValue(dataRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      emails.push(childData.email);
    });
  });
  return emails;
};

// Method for opening the dialog box
const toggleModal = (open) => {
  let backgroundWrapper = document.querySelector(".wrapper");
  const createRoomDialog = document.querySelector(".wrapper-modal");
  backgroundWrapper.classList.toggle("hidden-overflow", open);
  backgroundWrapper.toggleAttribute("hidden", !open);
  createRoomDialog.toggleAttribute("hidden", !open);
};

// Create s model for the new room and add it to the list of rooms
const createRoomListElement = (name) => {
  // const allChatRoomsTitles = getChatRoomsTitles();
  const chatRoomList = document.querySelector(".rooms-wrapper");
  const listItem = document.createElement('li');
  listItem.classList.add("room-details");
  // allChatRoomsTitles.map(title => {

  const btnRoom = document.createElement("button");
  btnRoom.classList.add("room-name-btn");
  btnRoom.innerText = `${name}`;
  listItem.appendChild(btnRoom);
  chatRoomList.appendChild(listItem);
  // btnRoom.addEventListener("click", event => {
  //   window.location = "/html/chatRoom.html";
  //   const headerChatRoomName = document.getElementById("chat-room-name");
  //   console.log(headerChatRoomName);
  //   headerChatRoomName.innerText = `${name}`;
  //   console.log(headerChatRoomName);
  // });
  // });
}

// For each email of the users emails in the database create a modal which appends
// each email item to the modal for creating a new room
const membersList = document.querySelector(".show-users-emails");
const memberListTemplate = (email) => {
  const listItem = document.createElement("li");
  listItem.classList.add("user");

  const emailTag = document.createElement("h4");
  emailTag.classList.add("user-email");
  emailTag.innerText = email;

  const addButton = document.createElement("button");
  addButton.classList.add("add-member-btn");
  addButton.innerText = "+";

  listItem.appendChild(emailTag);
  listItem.appendChild(addButton);
  membersList.appendChild(listItem);
}

// Saving the new room in the database
const createNewRoom = (name) => {
  const dataRef = ref(db, 'chat-rooms');
  const roomsRef = push(dataRef);
    set(roomsRef, {
      title: name,
      members: ''
    });
}

// Add functionality to the create button of the modal for creating a new room
const createRoomModalButton = document.getElementById("create-btn-modal");
if(createRoomModalButton) {
    createRoomModalButton.addEventListener("click", event => {
      event.preventDefault();
      const inputTitleRoom = document.getElementById("title-input");
      let inputValue = inputTitleRoom.value.trim();
      if(inputValue === ''){
        alert("Please, add a title to your new chat room!");
        // createRoomModalButton.setAttribute("disabled", "");
        return;
      }

      if(inputValue.length > 10){
        alert("The name of your room must be under 10 characters!");
        // createRoomModalButton.setAttribute("disabled", "");
        return;
      }

      const allRoomsTitles = getChatRoomsTitles();
      console.log(allRoomsTitles);
      if(allRoomsTitles.some(title => title = inputValue)) {
        alert("The name is already taken! Choose another one!");
        return;
      }
      createNewRoom(inputValue);
      createRoomListElement(inputValue);
      toggleModal(false);
      inputTitleRoom.value = "";
    });
}

// Add functionality to the close button of the modal for creating a new room
const closeModalBtn = document.getElementById("close-modal-btn");
closeModalBtn.addEventListener("click", event => {
    event.preventDefault();
    const inputTitleRoom = document.getElementById("title-input");
    toggleModal(false);
    inputTitleRoom.value = "";
});

// Add functionality to the create room button -> opening the modal for creating a room
const createChatRoomBtn = document.getElementById("create-room-btn");
if(createChatRoomBtn) {
  const usersEmails = findUsersEmails();
  createChatRoomBtn.addEventListener("click", event => {
    event.preventDefault();
    membersList.innerText = "";
    usersEmails.map(email => memberListTemplate(email));
    toggleModal(true);
  });
};

// FUNCTIONALITY TO CHAT ROOM PAGE

