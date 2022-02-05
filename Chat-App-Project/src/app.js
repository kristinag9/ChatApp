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
  btnRoom.addEventListener("click", event => {
    window.location = "/html/chatRoom.html";
    const headerChatRoomName = document.getElementById("chat-room-name");
    console.log(headerChatRoomName);
    headerChatRoomName.innerText = `${name}`;
    console.log(headerChatRoomName);
  });
  // });
}

// const listMembers = document.querySelector(".show-users-emails");
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

// console.log(usersEmails);
// const loadUsersEmails = async() => {
//   const usersEmails = findUsersEmails();
//   console.log(usersEmails);
//   usersEmails.map((email) => memberListTemplate(email));
// };


// Adding functionality to the modal form for creating new chat room
const createNewRoom = () => {
  const inputTitleRoom = document.getElementById("title-input");
  inputTitleRoom.addEventListener("change", (event) => {
    let newRoomTitle = inputTitleRoom.value;
     if(newRoomTitle === ''){
        alert("Please, add a title to your new chat room!");
        // createRoomModalButton.setAttribute("disabled", "");
        return;
      }

      if(newRoomTitle.length > 10){
        alert("The name of your room must be under 10 characters!");
        // createRoomModalButton.setAttribute("disabled", "");
        return;
      }

      const allRoomsTitles = getChatRoomsTitles();
      if(allRoomsTitles.some(title => title = newRoomTitle)) {
        alert("The name is already taken! Choose another one!");
        return;
      }

        // const searchingUsers = document.getElementById("adding-section").value;

          // const textArea = document.querySelector(".text-area");
          // const usersEmails = findUsersEmails();
          // if(usersEmails.some(email => email !== searchingUsers.value)) {
          //   alert("No user found!");
          // }
          // usersEmails.forEach((email) => memberListTemplate(email));
          // memberListTemplate(searchingUsers.value);
          // loadUsers();

      const dataRef = ref(db, 'chat-rooms');
      const roomsRef = push(dataRef);
        set(roomsRef, {
          title: newRoomTitle,
          members: ''
        });
      createRoomListElement(newRoomTitle);
  });
}

const usersEmails = findUsersEmails();

const createChatRoomBtn = document.getElementById("create-room-btn");
if(createChatRoomBtn) {
  createChatRoomBtn.addEventListener("click", (event) => {
    membersList.innerText = "";
    usersEmails.map(email => memberListTemplate(email));
    toggleModal(true);
  });
};
createNewRoom();

const createRoomModalButton = document.getElementById("create-btn-modal");
if(createRoomModalButton) {
    createRoomModalButton.addEventListener("click", event => {
      const inputTitleRoom = document.getElementById("title-input");
      inputTitleRoom.value = "";
      toggleModal(false);

    });
}

const closeModalBtn = document.getElementById("close-modal-btn");
closeModalBtn.addEventListener("click", event => {
    toggleModal(false);
});

// FUNCTIONALITY TO CHAT ROOM PAGE

