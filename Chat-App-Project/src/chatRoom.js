import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getDatabase, set, push, update, ref, onValue, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyAFVd6h59xX3gOeP4O5LDJQ87w-hJdep64",
   authDomain: "chatapp-57119.firebaseapp.com",
   databaseURL: "https://chatapp-57119-default-rtdb.firebaseio.com",
   projectId: "chatapp-57119",
   storageBucket: "chatapp-57119.appspot.com",
   messagingSenderId: "283809287187",
   appId: "1:283809287187:web:75605a2febde4e21d703e6",
   measurementId: "G-8NZ4H3LSQH"
 };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get reference to the database
const db = getDatabase(app);

// Get all the data (from the different keys) into one array
const getLocalStorage = (name) => {
  let firstFreeNumber = 0;
  let data = [];
  while (localStorage.getItem(name + firstFreeNumber)) {
      data.push(localStorage.getItem(name + firstFreeNumber++));
  }
  return data;
}

const headerChatRoomName = document.getElementById("chat-room-name");
const roomName = window.localStorage.getItem("roomName");
headerChatRoomName.innerText = `${roomName}`;

const emailsToAdd = getLocalStorage("emailsToAdd");

emailsToAdd.map(email => {
  const usersInfoPart = document.querySelector(".users-info-part");
  const currentUsr = document.createElement("div");
  currentUsr.classList.add("current-user");
  const userInRoom = document.createElement("p");
  userInRoom.classList.add("user-in-room");
  userInRoom.innerText = `${email}`;
  currentUsr.appendChild(userInRoom);
  usersInfoPart.appendChild(currentUsr);
});

// FUNCTIONALITY TO CHAT ROOM PAGE
const messagesList = document.querySelector(".messages-list");

const messageModalTemplate = (name, date, text) => {
  const listItem = document.createElement('li');
  listItem.classList.add("message-modal");

  const sectionItem = document.createElement("section");
  sectionItem.classList.add("message-info");

  // First row of message
  const firstRowDiv = document.createElement("div");
  firstRowDiv.classList.add("first-row-msg");
  const msgUserInfo = document.createElement("div");
  msgUserInfo.classList.add("msg-user-info");
  const senderName = document.createElement("span");
  senderName.classList.add("sender-name");
  senderName.innerText = name;
  const dateSpan = document.createElement("span");
  dateSpan.classList.add("date");
  dateSpan.innerText = date;
  msgUserInfo.appendChild(senderName);
  msgUserInfo.appendChild(dateSpan);

  const msgOptions = document.createElement("div");
  msgOptions.classList.add("msg-options");

  const editButton = document.createElement("button");
  editButton.classList.add("edit-msg-icon");
  const iconEdit = document.createElement("i");
  iconEdit.classList.add("far");
  iconEdit.innerHTML = "&#xf044;";
  editButton.appendChild(iconEdit);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-msg-btn");
  const iconDelete = document.createElement("i");
  iconDelete.classList.add("far");
  iconDelete.innerHTML = "&#xf2ed;";
  deleteButton.appendChild(iconDelete);

  msgOptions.appendChild(editButton);
  msgOptions.appendChild(deleteButton);

  firstRowDiv.appendChild(msgUserInfo);
  firstRowDiv.appendChild(msgOptions);

  // Second row of message
  const sndRowDiv = document.createElement("div");
  sndRowDiv.classList.add("second-row-msg");
  const curMsgSpan = document.createElement("span");
  curMsgSpan.classList.add("current-msg");
  curMsgSpan.innerText = text;
  sndRowDiv.appendChild(curMsgSpan);

  // Third row of message
  const thirdRowDiv = document.createElement("div");
  thirdRowDiv.classList.add("third-row-msg");

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-msg-icon");
  const likeIcon = document.createElement("i");
  likeIcon.classList.add("far");
  likeIcon.innerHTML = "&#xf164";
  likeButton.appendChild(likeIcon);

  const dislikeButton = document.createElement("button");
  dislikeButton.classList.add("dislike-msg-btn");
  const dislikeIcon = document.createElement("i");
  dislikeIcon.classList.add("far");
  dislikeIcon.innerHTML = "&#xf165;";
  dislikeButton.appendChild(dislikeIcon);

  thirdRowDiv.appendChild(likeButton);
  thirdRowDiv.appendChild(dislikeButton);

  sectionItem.appendChild(firstRowDiv);
  sectionItem.appendChild(sndRowDiv);
  sectionItem.appendChild(thirdRowDiv);
  listItem.appendChild(sectionItem);
  messagesList.appendChild(listItem);


  // Add functionality to edit message button
  editButton.addEventListener("click", event => {
    event.preventDefault();
    console.log("here");
    const enteredText = document.getElementById("user-msg");
    enteredText.value = curMsgSpan.innerText;

    const newData = {
        username: senderName.innerText,
        date: dateSpan.innerText,
        text: curMsgSpan.innerText
      };


    // const newMessageKey = push(child(ref(db), "messages")).key;
    const updates = {};
    updates["messages" + newMessageKey] = newData;
    update(ref(db), updates);

    sndRowDiv.removeChild(curMsgSpan);
    sectionItem.removeChild(sndRowDiv);
    listItem.removeChild(sectionItem);
    messagesList.removeChild(listItem);
    // if(enteredText.value !== '') {
    //   alert("First edit the current message, please!");
    //   return;
    // }
    });

  // Add functionality to delete message button
    deleteButton.addEventListener("click", event => {
      // const messageToDelete = curMsgSpan;
      // const msgValue = curMsgSpan.innerText;
      // sndRowDiv.removeChild(messageToDelete);
      // sectionItem.removeChild(sndRowDiv);
      // listItem.removeChild(sectionItem);
      // messagesList.removeChild(listItem);
      // alert("Successfully deleted message!");

      deleteMessage(msgValue);
    });
}

// Get the rooms messages by the name of the room
const getChatRoomMessages = (name) => {
  const dataRef = ref(db, "chat-rooms");
  const roomMessages = [];
  onValue(dataRef, (snapshot) => {
   snapshot.forEach((childSnapshot) => {
     const childKey = childSnapshot.key;
     const childData = childSnapshot.val();
     if(childData.title === name) {
        roomMessages.push(childData.messages);
     }
   });
  });
 return roomMessages;
}


// const msgs = getChatRoomMessages("fsdfsd");
// const newmsg = {
//   username: "Krisi",
//   date: Date.now().toLocaleString(),
//   text: "textValue"
// }
// msgs.push(newmsg);
// console.log("new msgs" + JSON.stringify(msgs));

// const roomName = window.localStorage.getItem("roomName");
// const dataRef = ref(db, "chat-rooms/");
//   onValue(dataRef, (snapshot) => {
//    snapshot.forEach((childSnapshot) => {
//      const childKey = childSnapshot.key;
//      const childData = childSnapshot.val();

//    });
//   });

// const messagesInRoom = getChatRoomMessages("hey");
// console.log(messagesInRoom);

// Add functionality to "Send" button
const buttonSend = document.getElementById("send-msg");
if(buttonSend) {
  buttonSend.addEventListener("click", event => {
    event.preventDefault();
    // get the name from the local storage
    const usernameFromLocal = window.localStorage.getItem("username");
    const newDate = new Date();

    // get the entered message
    const enteredText = document.getElementById("user-msg");
    let textValue = enteredText.value;

    if(textValue === ''){
      alert("First enter a message!");
      return;
    }
    // save the message into the database
    // const dataRef = ref(db, "messages");
    const roomName = window.localStorage.getItem("roomName");

    // take the room with the current name
    const messageToAdd = {
      username: `${usernameFromLocal}`,
      date: newDate.toLocaleString(),
      text: textValue
    }

    const roomMessages = getChatRoomMessages(roomName);
    // console.log(roomMessages);
    // console.log(stringifies);
    roomMessages.push({message: messageToAdd});
    // console.log(roomMessages);

    const dataRef = ref(db, "chat-rooms");
    const roomsRef = push(dataRef);
    onValue(dataRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const childKeys = childSnapshot.key;
        console.log(childKeys);
        const childData = childSnapshot.val();
        // console.log(childData);
        // if(childData.title === roomName) {
        //   set(`${roomsRef}/${childKey}/messages`, {
        //     message: { ...messageToAdd }
        //   });
        // }
        // roomMessages.push(childData.messages);
      });
    });

    // messagesInRoom.push(messageToAdd);
    // const messageRef = push(dataRef);
    // set(messageRef, {
    //   ...messagesInRoom
    // });
    enteredText.value = "";
  });
}

// Showing message in the message area (must be only for the current chat room)
const dataRef = ref(db, "chat-rooms");
onChildAdded(dataRef, (data) => {
  const messages = data.val().messages;
  console.log(messages);
      messageModalTemplate(messages?.message?.date, messages?.message?.text, messages?.message?.username);
  //  console.log(JSON.stringify(message.date));
  // const message = data.val();
});

// const getAllMessages = () => {
//   const dataRef = ref(db, 'messages');
//   const messages = [];
//   onValue(dataRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const childKey = childSnapshot.key;
//       const childData = childSnapshot.val();
//       messages.push(childData);
//     });
//   });
//     return messages;
// };

// const getAllMessagesText = () => {
//   const dataRef = ref(db, 'messages');
//   const texts = [];
//   onValue(dataRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//       const childKey = childSnapshot.key;
//       const childData = childSnapshot.val();
//       texts.push(childData.text);
//     });
//   });
//   return texts;
// };

// const texts = getAllMessagesText();
// console.log(texts);
// const msgs = getAllMessages();
// console.log(msgs);

const deleteMessage = (toDelete) => {
  const dataRef = ref(db, 'messages');
  onValue(dataRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      let childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      if(childData.text === toDelete) {
        // console.log("hey");
        // console.log(childKey);

        // console.log(childKey);

        // console.log(snapshot.child(childKey));
        // childData.setValue(null);
        // console.log(childSnapshot.val());
        // console.log(childSnapshot.ref.remove());
        // dataRef.child(snapshot).child(childKey).setValue(null);
      }
    });
  });


  // console.log(toDelete);
  // const messages = getAllMessages();
  // console.log(messages);
  // const messagesTexts = getAllMessagesText();
  // console.log(messagesTexts);
  // //messages.map(message => message.text);
  // const messageToDelete = messages.filter(message => message.text === toDelete); //.indexOf(String(key));
  // console.log(messageToDelete);
  // const indexToDelete = messages.indexOf(messageToDelete);
  // console.log(indexToDelete);
  // let newMessages = messages.splice(indexToDelete, 1);
  // // messages = newMessages;
  // const dataRef = ref(db, 'messages');
  // const messagesRef = push(dataRef);
  // // console.log(messagesRef);
  //     set(messagesRef, null);
  //     set(messagesRef, newMessages);
}

// deleteMessage("hello");

// onChildRemoved(dataRef, (data) => {
//   console.log("here2");
//   const message = data.val();
//   console.log(message);
//   // messageModalTemplate(message.username, message.date, message.text);
//   deleteMessage(message.text);
//   // console.log('The message of user \'' + deletedPost.username + '\' has been deleted');
// })
