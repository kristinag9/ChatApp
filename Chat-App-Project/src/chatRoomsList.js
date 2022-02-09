
 // In local storage we cannot append data to one key. So, we can do it by assigning
// index numbers to the key name.
// This function shows how to append data to different keys
// const appendToLocalStorage = (key, value) => {
//    let firstFreeIndex = 0;
//    while (localStorage.getItem(key + firstFreeIndex)) {
//      firstFreeIndex++; // if there is an item with this index, go ahead
//    }
//    localStorage.setItem(key + firstFreeIndex, value); //add item at first available index number
//  }

// // Get all the data (from the different keys) into one array
// const getLocalStorage = (name) => {
//    let firstFreeNumber = 0;
//    let data = [];
//    while (localStorage.getItem(name + firstFreeNumber)) {
//        data.push(localStorage.getItem(name + firstFreeNumber++));
//    }
//    return data;
// }

// Add functionality to the create button of the modal for creating a new room
const allRoomsTitles = getChatRoomsTitles();
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

      // console.log(allRoomsTitles);
      if(allRoomsTitles.some(title => title === inputValue)) {
        alert("The name is already taken! Choose another one!");
        return;
      }

      window.localStorage.setItem("roomName", inputValue);

      // Get the array with selected emails from the local storage
      const emailsToAdd = getLocalStorage("emailsToAdd");

      const messageToAdd = {};
      createNewRoom(inputValue, emailsToAdd, messageToAdd);
      // membersModal();
      createRoomListElement(inputValue);
      toggleModal(false);
      inputTitleRoom.value = "";
    });
}





