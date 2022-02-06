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

const getChatRoomsTitles = () => {
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

const getEmailsToAdd = () => {
  const dataRef = ref(db, 'added-members');
  const emailsToAdd = [];
  onValue(dataRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      emailsToAdd.push(childData.emailToAdd);
      // dataRef.childKey('emailToAdd').set(null);
    });
  }, {
    onlyOnce: true
  });
  return emailsToAdd;
}

// const allemails = getEmailsToAdd();
// console.log(allemails);

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
  btnRoom.addEventListener("click", event => {
    window.location = "/html/chatRoom.html";
  });
}

// Saving the new room in the database
const createNewRoom = (name, users) => {
  const dataRef = ref(db, 'chat-rooms');
  const roomsRef = push(dataRef);
    set(roomsRef, {
      title: name,
      members: users ?? []
    });
}

// const appendToStorage = (key, data) => {
//   var oldData = localStorage.getItem(key);
//   if(oldData === null) {
//     oldData = "";
//   }
//   localStorage.setItem(key, oldData + ' ' + data);
// }

// In local storage we cannot append data to one key. So, we can do it by assigning
// index numbers to the key name.
// This function shows how to append data to different keys
const appendToLocalStorage = (key, value) => {
  let firstFreeIndex = 0;
  while (localStorage.getItem(key + firstFreeIndex)) {
    firstFreeIndex++; // if there is an item with this index, go ahead
  }
  localStorage.setItem(key + firstFreeIndex, value); //add item at first available index number
}

// Get all the data (from the different keys) into one array
const getLocalStorage = (name) => {
  let firstFreeNumber = 0;
  let data = [];
  while (localStorage.getItem(name + firstFreeNumber)) {
      data.push(localStorage.getItem(name + firstFreeNumber++));
  }
  return data;
}

// For each email of the users emails in the database create a modal which appends
// each email item to the modal for creating a new room
const membersList = document.querySelector(".show-users-emails");
const membersModal = () => {
  const usersEmails = findUsersEmails();
  usersEmails.map(email => {
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

    const usersToAdd = [];
    window.localStorage.setItem("emailsToAdd", usersToAdd);
    addButton.addEventListener("click", event => {
      event.preventDefault();
      appendToLocalStorage("emailsToAdd", emailTag.innerText);
      // if(usersToAdd.find(email => email === emailToAdd)) {
      //   alert("This user is already added!");
      //   return;
      // }
      membersList.removeChild(listItem);
    });
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

      window.localStorage.setItem("roomName", inputValue);

      // Get the array with selected emails from the local storage
      const emailsToAdd = getLocalStorage("emailsToAdd");
      console.log(emailsToAdd);

      createNewRoom(inputValue, emailsToAdd);
      // membersModal();
      createRoomListElement(inputValue);
      toggleModal(false);
      inputTitleRoom.value = "";
    });
}

// Add functionality to the close button of the modal for creating a new room
const closeModalBtn = document.getElementById("close-modal-btn");
if(closeModalBtn) {
  closeModalBtn.addEventListener("click", event => {
      event.preventDefault();
      const inputTitleRoom = document.getElementById("title-input");
      toggleModal(false);
      inputTitleRoom.value = "";
  });
}
// Add functionality to the create room button -> opening the modal for creating a room
const createChatRoomBtn = document.getElementById("create-room-btn");
if(createChatRoomBtn) {
  createChatRoomBtn.addEventListener("click", event => {
    event.preventDefault();
    membersList.innerText = "";
    membersModal();
    toggleModal(true);

  });
};

// FUNCTIONALITY TO CHAT ROOM PAGE
const headerChatRoomName = document.getElementById("chat-room-name");
console.log(headerChatRoomName);
const roomName = window.localStorage.getItem("roomName");
headerChatRoomName.innerText = `${roomName}`;

const setUserName = document.querySelector(".sender-name");
const usernameFromLocal = window.localStorage.getItem("username");
setUserName.innerText = `${usernameFromLocal}`;

const setData = document.querySelector(".date");
const newDate = new Date();
setData.innerText = newDate.toLocaleString();