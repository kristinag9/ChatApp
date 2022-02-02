// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getDatabase, set, push, ref } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
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

// Method for opening the dialog box
const createChatRoomBtn = document.getElementById("create-room-btn");
const wrapperChatRooms = document.querySelector(".wrapper");
const modalBackground = document.getElementById("modal-background");
const createRoomDialog = document.querySelector(".wrapper-modal");

createChatRoomBtn.addEventListener("click", (event) => {
  modalBackground.classList.toggle("hidden-overflow", open);
  modalBackground.toggleAttribute("hidden", !open);
  createRoomDialog.toggleAttribute("hidden", !open);
  wrapperChatRooms.innerHTML = "";
  // window.location = "../html/createChatRoomModal.html";
});

// Adding functionality to the modal form for creating new chat room
const newRoomForm = document.querySelector(".modal-form");
const createRoomBtn = document.getElementById("create-btn");
newRoomForm.addEventListener("submit", event => {
  event.preventDefault();

  const newRoomTitle = document.getElementById("title-input").value;
  if(newRoomTitle === ''){
    alert("Please, add a title to you new chat room!");
    return;
  }
  const selectedUsers = document.getElementById("adding-section").value;
  const dataRef = ref(db, 'chat-rooms');
      const roomsRef = push(dataRef);
      set(roomsRef, {
        title: newRoomTitle,
        members: selectedUsers
    });

    createRoomDialog.innerHTML = "";
    modalBackground.classList.toggle("hidden-overflow", !open);
    modalBackground.toggleAttribute("hidden", open);
    wrapperChatRooms.toggleAttribute("hidden", !open);

    // const chatRoomList = document.querySelector(".rooms-wrapper");
    // console.log(chatRoomList);
    // const listItem = document.createElement('li');
    // listItem.innerHTML = `
    //   <button class="room-details">
    //      <a href="chatRoom.html">${newRoomTitle}</a>
    //   </button>
    // `;
    // chatRoomList.appendChild(listItem);
})