import * as authService from "../services/auth";
import * as roomRepository from "../database/chatRoom";
import * as userRepository from "../database/user";
import * as userService from "../services/auth"

const headerChatRoomName = document.getElementById("chat-room-name");
const usersInfoPart = document.querySelector(".users-info-part");
const messagesList = document.querySelector(".messages-list");
const enteredText = document.getElementById("user-msg");
const buttonSend = document.getElementById("send-msg");

const data = { currentUser: {id: "", email: ""}, room: { id: "", title: ""}, message: null };
data.room.id = new URLSearchParams(window.location.search).get("roomId");
if(!data.room.id) {
   window.location.href = "/html/chatRoomsList.html";
}

authService.authListener(user => {
   if(!user) {
      window.location.href = "/html/login.html";
      return;
   }
   data.currentUser.email = user.email;
})

userRepository.usersListener(users => {
   users.forEach(user => {
      const email = user.val().email;
      if(email === data.currentUser.email && !data.currentUser.id) {
         data.currentUser.id = user.key;
         return;
      }
   });
})

roomRepository.chatRoomTitleListener(data.room.id, title => {
   data.room.title = title.val();
   document.title = data.room.title;
   headerChatRoomName.innerText = data.room.title;
})

roomRepository.chatRoomMembersListener(data.room.id, members => {
   const membersArray = Object.values(members.val());
   if(!membersArray.includes(data.currentUser.email)) {
      window.location.href = "/html/chatRoomsList.html";
      roomRepository.addMemberToRoom(data.room.id, data.currentUser.email);
      return;
   }

   usersInfoPart.innerHTML = "";
   const userInfo = document.createElement("p");
   userInfo.id = "users-room-info";
   userInfo.innerText = "Users in the room:";
   usersInfoPart.appendChild(userInfo);
   membersArray.forEach(member => {
      usersInfoPart.appendChild(createUserListItem(member));
   })
})

const createUserListItem = (email) => {
   const listItem = document.createElement("div");
   listItem.classList.add("current-user");
   const userInRoom = document.createElement("p");
   userInRoom.classList.add("user-in-room");
   userInRoom.innerText = `${email}`;
   listItem.appendChild(userInRoom);
   return listItem;
}

const createMessageListItem = (message) => {
  const listItem = document.createElement('li');
  listItem.classList.add("message-modal");
  listItem.id = message.id;

  const sectionItem = document.createElement("section");
  sectionItem.classList.add("message-info");

  // First row of message
  const firstRowDiv = document.createElement("div");
  firstRowDiv.classList.add("first-row-msg");
  const msgUserInfo = document.createElement("div");
  msgUserInfo.classList.add("msg-user-info");
  const senderName = document.createElement("span");
  senderName.classList.add("sender-name");
  senderName.innerText = message.username;
  const dateSpan = document.createElement("span");
  dateSpan.classList.add("date");
  dateSpan.innerText = message.date;
  msgUserInfo.appendChild(senderName);
  msgUserInfo.appendChild(dateSpan);

  const msgOptions = document.createElement("div");
  msgOptions.classList.add("msg-options");

  if(message.username === data.currentUser.email) {
      const editButton = document.createElement("button");
      editButton.classList.add("edit-msg-icon");
      const iconEdit = document.createElement("i");
      iconEdit.classList.add("far");
      iconEdit.innerHTML = "&#xf044;";
      editButton.appendChild(iconEdit);

      editButton.addEventListener("click", event => {
         enteredText.value = message.text;
         data.message = message;
      })
      msgOptions.appendChild(editButton);

     const deleteButton = document.createElement("button");
     deleteButton.classList.add("delete-msg-btn");
     const iconDelete = document.createElement("i");
     iconDelete.classList.add("far");
     iconDelete.innerHTML = "&#xf2ed;";
     deleteButton.appendChild(iconDelete);

     deleteButton.addEventListener("click", event => {
      roomRepository.removeMessageFromRoom(data.room.id, message.id);
     })

     msgOptions.appendChild(deleteButton);
  }

  firstRowDiv.appendChild(msgUserInfo);
  firstRowDiv.appendChild(msgOptions);

  // Second row of message
  const sndRowDiv = document.createElement("div");
  sndRowDiv.classList.add("second-row-msg");
  const curMsgSpan = document.createElement("span");
  curMsgSpan.classList.add("current-msg");
  curMsgSpan.innerText = message.text;
  sndRowDiv.appendChild(curMsgSpan);

  // Third row of message
  const thirdRowDiv = document.createElement("div");
  thirdRowDiv.classList.add("third-row-msg");

  const likeButton = document.createElement("button");
  likeButton.classList.add("like-msg-icon");
  const likeIcon = document.createElement("i");
  likeIcon.classList.add("far");
  likeIcon.innerHTML = "&#xf164";

  const likes = document.createElement("span");
  likes.innerText = message.likes;
  likeButton.appendChild(likes);
  likeButton.appendChild(likeIcon);

  likeButton.addEventListener("click", event => {
     const { username, text, date } = message;
     const messageItem = document.getElementById(message.id);
     const messageLikes = messageItem.querySelector(".like-msg-icon > span");
     const messageDislikes = messageItem.querySelector(".dislike-msg-btn > span");
     roomRepository.updateMessage(
        data.room.id,
        message.id,
        { username, text, date, likes: +messageLikes.innerText + 1, dislikes: +messageDislikes.innerText }
     );
  })

  const dislikeButton = document.createElement("button");
  dislikeButton.classList.add("dislike-msg-btn");
  const dislikeIcon = document.createElement("i");
  dislikeIcon.classList.add("far");
  dislikeIcon.innerHTML = "&#xf165;";

  const dislikes = document.createElement("span");
  dislikes.innerText = message.dislikes;
  dislikeButton.appendChild(dislikes)
  dislikeButton.appendChild(dislikeIcon);

  dislikeButton.addEventListener("click", event => {
      const { username, text, date } = message;
      const messageItem = document.getElementById(message.id);
      const messageLikes = messageItem.querySelector(".like-msg-icon > span");
      const messageDislikes = messageItem.querySelector(".dislike-msg-btn > span");
      roomRepository.updateMessage(
         data.room.id,
         message.id,
         { username, text, date, likes: +messageLikes.innerText, dislikes: +messageDislikes.innerText + 1 }
      );
  })

  thirdRowDiv.appendChild(likeButton);
  thirdRowDiv.appendChild(dislikeButton);

  sectionItem.appendChild(firstRowDiv);
  sectionItem.appendChild(sndRowDiv);
  sectionItem.appendChild(thirdRowDiv);
  listItem.appendChild(sectionItem);

  return listItem;
}

roomRepository.chatRoomMessageAddListener(data.room.id, message => {
   const newMessage = createMessageListItem({ ...message.val(), id: message.key });
   messagesList.appendChild(newMessage);
   newMessage.scrollIntoView();
})

roomRepository.chatRoomMessageRemoveListener(data.room.id, message => {
   const messageItem = document.getElementById(message.key);
   messageItem.remove();
})

roomRepository.chatRoomMessageUpdateListener(data.room.id, message => {
   const messageItem = document.getElementById(message.key);
   const messageText = messageItem.querySelector(".second-row-msg > span");
   messageText.innerText = message.val().text;
   const messageLikes = messageItem.querySelector(".like-msg-icon > span");
   messageLikes.innerText = message.val().likes;
   const messageDislikes = messageItem.querySelector(".dislike-msg-btn > span");
   messageDislikes.innerText = message.val().dislikes;
})

buttonSend.addEventListener("click", event => {
   const textValue = enteredText.value;
   if(!textValue) {
      return;
   }

   const message = {
      username: data.currentUser.email,
      text: textValue,
      date: new Date().toString().slice(4, 21),
      likes: 0,
      dislikes: 0
   };

   if(data.message) {
      message.date = data.message.date;
      message.likes = data.message.likes;
      message.dislikes = data.message.dislikes;
      roomRepository.updateMessage(data.room.id, data.message.id, message);
      data.message = null;
   } else {
      roomRepository.addMessageToRoom(data.room.id, message);
   }
   enteredText.value = "";
})

// Log out
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", event => userService.logout());
