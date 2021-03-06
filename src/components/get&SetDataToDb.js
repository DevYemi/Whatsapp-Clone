import db, { storage } from "../firebase";
import firebase from "firebase";
export function getUserInfoFromDb(id, hookCallBack, isReducerCallback) {
  if (isReducerCallback) {
    // if its a reducer callback handle it
    db.collection("registeredUsers")
      .doc(id)
      .onSnapshot((snapshot) =>
        hookCallBack({
          type: "SET_CURRENTDISPLAYCONVOINFO",
          currentDisplayConvoInfo: snapshot.data(),
        })
      );
  } else {
    //handle it like a react state callback
    return db
      .collection("registeredUsers")
      .doc(id)
      .onSnapshot((snapshot) => hookCallBack(snapshot.data()));
  }
}
export function getChatsFromDb(id, setChats) {
  return db
    .collection("registeredUsers")
    .doc(id)
    .collection("chats")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      setChats(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
}
export function getRoomsFromDb(id, setRooms) {
  // gets rooms fromdb
  return db
    .collection("registeredUsers")
    .doc(id)
    .collection("rooms")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      setRooms(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
}

export function createNewChatInDb(user, chatUser) {
  // create new chat when a user clicks on add chat
  db.collection("registeredUsers") // add chat to user currently online
    .doc(user?.info.uid)
    .collection("chats")
    .doc(chatUser.uid)
    .set({
      name: chatUser.name,
      id: chatUser.uid,
      isRoom: false,
      email: chatUser.email,
      read: false,
      muted: false,
      phoneNumber: chatUser.phoneNumber,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  db.collection("registeredUsers")
    .doc(chatUser.uid)
    .collection("chats")
    .doc(user?.info.uid)
    .set({
      name: user?.info.displayName,
      id: user?.info.uid,
      isRoom: false,
      muted: false,
      email: user?.info.email,
      read: false,
      phoneNumber: user?.phoneNumber,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}
export function createNewRoomInDb(user, roomName) {
  var newRoomKey = firebase.database().ref().child("rooms").push().key;
  db.collection("registeredUsers") // add room to creator db
    .doc(user?.info.uid)
    .collection("rooms")
    .doc(newRoomKey)
    .set({
      id: newRoomKey,
      isRoom: true,
      admin: true,
      read: false,
      muted: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  db.collection("rooms") // add room to Rooms db
    .doc(newRoomKey)
    .set({
      roomName: roomName,
      roomId: newRoomKey,
      isRoom: true,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      read: false,
      muted: false,
      description: "",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      addNewMemberToRoomToDb(newRoomKey, user);
    });
}
export function addNewMemberToRoomToDb(roomId, user) {
  db.collection("rooms") // add room to Rooms db
    .doc(roomId)
    .collection("members")
    .doc(user?.info.uid)
    .set({
      name: user?.info.displayName,
      phoneNumber: user?.phoneNumber,
      id: user?.info.uid,
      isAdmin: true,
    });
}
export function getRoomMembersFromDb(roomId, hookCallback) {
  return db
    .collection("rooms") // add room to Rooms db
    .doc(roomId)
    .collection("members")
    .onSnapshot((snapshot) => {
      let members = snapshot.docs.map((doc) => doc.data());
      hookCallback(members);
    });
}
export function getMessgFromDb(
  userId,
  convoId,
  isRoom,
  order,
  hookCallback,
  getLastMessage
) {
  // gets all the message in a room fromdb
  if (isRoom) {
    return db
      .collection("rooms")
      .doc(convoId)
      .collection("messages")
      .orderBy("timestamp", order)
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => doc.data());
        if (getLastMessage) {
          hookCallback(data[0]);
        } else {
          hookCallback(data);
        }
      });
  } else {
    return db
      .collection("registeredUsers")
      .doc(userId)
      .collection("chats")
      .doc(convoId)
      .collection("messages")
      .orderBy("timestamp", order)
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => doc.data());
        if (getLastMessage) {
          hookCallback(data[0]);
        } else {
          hookCallback(data);
        }
      });
  }
}

export function getRoomInfoFromDb(roomId, hookCallBack) {
  // gets the name of a specific room from db
  return db
    .collection("rooms")
    .doc(roomId)
    .onSnapshot((snapshot) => {
      hookCallBack({
        type: "SET_CURRENTDISPLAYCONVOINFO",
        currentDisplayConvoInfo: snapshot.data(),
      })
    });
}
export function getCurrentChatNameFromDb(userId, chatId, hookCallback) {
  // gets the name of a specific room from db
  let docRef = db
    .collection("registeredUsers")
    .doc(userId)
    .collection("chats")
    .doc(chatId);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        hookCallback(doc.data()?.name);
      } else {
      }
    })
    .catch((e) => {});
}
export function setNewMessageToDb(
  convoId,
  text,
  user,
  scrollChatBody,
  isRoom,
  fileType
) {
  // send new sent message to db
  var newMssgKey = firebase.database().ref().child("messages").push().key;
  if (isRoom) {
    db.collection("rooms")
      .doc(convoId)
      .collection("messages")
      .add({
        message: text,
        senderId: user?.info.uid,
        fileType: fileType,
        name: user?.info.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        resetLatestMssgWithTimeStamp(user?.info.uid, convoId, isRoom);
        scrollChatBody.toEnd();
      });
  } else {
    db.collection("registeredUsers") // set to sender
      .doc(user?.info.uid)
      .collection("chats")
      .doc(convoId)
      .collection("messages")
      .doc(newMssgKey)
      .set({
        message: text,
        senderId: user?.info.uid,
        receiverId: convoId,
        fileType: fileType,
        name: user?.info.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        //set to reciever
        db.collection("registeredUsers") // set to reciever
          .doc(convoId)
          .collection("chats")
          .doc(user?.info.uid)
          .collection("messages")
          .doc(newMssgKey)
          .set({
            message: text,
            senderId: user?.info.uid,
            receiverId: convoId,
            fileType: fileType,
            name: user?.info.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            resetRecieverMssgReadOnDb(user?.info.uid, convoId, false);
            resetLatestMssgWithTimeStamp(user?.info.uid, convoId, isRoom);
            scrollChatBody.toEnd();
          });
      });
  }
}
export function resetLatestMssgWithTimeStamp(senId, recId, isRoom) {
  if (isRoom) {
    db.collection("registeredUsers")
      .doc(senId)
      .collection("rooms")
      .doc(recId)
      .update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    db.collection("rooms").doc(recId).update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    db.collection("registeredUsers") // update receiver
      .doc(recId)
      .collection("chats")
      .doc(senId)
      .update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    db.collection("registeredUsers") // update sender
      .doc(senId)
      .collection("chats")
      .doc(recId)
      .update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }
}
export function resetRecieverMssgReadOnDb(senId, recId, value) {
  db.collection("registeredUsers")
    .doc(recId)
    .collection("chats")
    .doc(senId)
    .update({
      read: value,
    });
}
export function getAndComputeNumberOfNewMssgOnDb(
  userId,
  isRoom,
  convoId,
  setNewMssgNum,
  currentUrl
) {
  const mssgCallback = (messages) => {
    let numOfNewMessages = 0;
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (message.senderId !== userId) {
        numOfNewMessages++;
      } else {
        i = messages.length + 1;
      }
    }
    let currentLocation = isRoom ? `/rooms/${convoId}` : `/chats/${convoId}`;
    if (currentLocation === currentUrl) {
      // if the user is already on chat reset it to zero
      setNewMssgNum(0);
    } else {
      setNewMssgNum(numOfNewMessages);
    }
  };
  if (isRoom) {
    // get it from the rooms in db
    db.collection("registeredUsers")
      .doc(userId)
      .collection("rooms")
      .doc(convoId)
      .onSnapshot((snapshot) => {
        let isChatRead = snapshot.data()?.read;
        if (!isChatRead) {
          // if chat hasn't been read by user commute the amount of message sent by other sender
          getMessgFromDb(userId, convoId, isRoom, "desc", mssgCallback, false);
        }
      });
  } else {
    db.collection("registeredUsers")
      .doc(userId)
      .collection("chats")
      .doc(convoId)
      .onSnapshot((snapshot) => {
        let isChatRead = snapshot.data()?.read;
        if (!isChatRead) {
          // if chat hasn't been read by user commute the amount of message sent by sender
          getMessgFromDb(userId, convoId, isRoom, "desc", mssgCallback, false);
        }
      });
  }
}
export function uploadFileToDb(file, fileInfo, setFileOnPreview) {
  // upload files e.g image, audio, video to strorage and returns the URL
  const uploadTask = storage.ref(`${fileInfo.type}/${file.name}`).put(file); // saved new image to storage
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(progress);
    },
    (error) => {
      alert(error.message);
    },
    () => {
      storage
        .ref(fileInfo.type)
        .child(file.name)
        .getDownloadURL()
        .then((url) => {
          setFileOnPreview({ url, info: fileInfo });
        });
    }
  );
}
export function setVoiceNoteToDb(
  file,
  fileSize,
  chatId,
  user,
  scrollChatBody,
  convoInfo,
  min,
  sec
) {
  // upload the new created voice note to strorage and send the url to db
  const uploadTask = storage.ref(`audio/voice-note${fileSize}`).put(file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(progress);
    },
    (error) => {
      alert(error.message);
    },
    () => {
      storage
        .ref("audio")
        .child(`voice-note${fileSize}`)
        .getDownloadURL()
        .then((url) => {
          setNewMessageToDb(
            chatId,
            "",
            user,
            scrollChatBody,
            convoInfo?.isRoom,
            {
              url,
              info: {
                type: "voice-note",
                min,
                sec,
                exten: "mp3",
                avi: user?.info.photoURL,
              },
            }
          );
        });
    }
  );
}
export function registerNewUserInDb(email, phoneNumber, uid, name, avi) {
  // register a new user on the db
  // registers a new user to the db
  db.collection("totalUsers")
    .doc(uid)
    .set({ email, phoneNumber, uid, name, avi });
  db.collection("registeredUsers")
    .doc(uid)
    .set({ email, phoneNumber, uid, name, avi });
}
export function getTotalUsersFromDb(setTotalUserOnDb) {
  // gets the total number of users on the db
  // gets all the total registered users on db
  return db.collection("totalUsers").onSnapshot((snapshot) => {
    let data = snapshot.docs.map((doc) => doc.data());
    setTotalUserOnDb(data);
  });
}

export function muteConvoOnDb(userId, convoId, isRoom, hookCallback) {
  // mute contact chat or room on the db
    db.collection("registeredUsers")
      .doc(userId)
      .collection(isRoom? "rooms": "chats")
      .doc(convoId)
      .update({
        muted: true,
      })
      .then(() => {
        hookCallback({
          type: "SET_ISMUTENOTIFICHECKED",
          isMuteNotifichecked: true,
        })
      });
}
export function unmuteConvoOnDb(userId, convoId, isRoom, hookCallback) {
  // unmute contact chat or room on the db

    db.collection("registeredUsers")
      .doc(userId)
      .collection(isRoom? "rooms": "chats")
      .doc(convoId)
      .update({
        muted: false,
      })
      .then(() => {
        hookCallback({
          type: "SET_ISMUTENOTIFICHECKED",
          isMuteNotifichecked: false,
        })
      });
}
export function isConvoMutedOnDb (userId,convoId,isRoom,hookCallback) { // checks if a convo is muted or not
  console.log(userId,convoId,isRoom,hookCallback);
  let docRef = db
    .collection("registeredUsers")
    .doc(userId)
    .collection(isRoom? "rooms": "chats")
    .doc(convoId);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        hookCallback({
          type: "SET_ISMUTENOTIFICHECKED",
          isMuteNotifichecked: doc.data()?.muted,
        })
      } else {
      }
    })
    .catch((e) => {});
}
export function setNewGroupNameOnDb (roomId, newRoomName) { // Set a new name for a group on the db

  db.collection("rooms") 
  .doc(roomId)
  .update({
    roomName: newRoomName,
  })
}
export function setNewGroupDescriptionOnDb (roomId, newRoomDescription) { // set a new description for the group on the db
  db.collection("rooms") 
  .doc(roomId)
  .update({
    description: newRoomDescription,
  })
}
export function getGroupMemberFromDb (roomId, reactHookCallback) {
  return db
  .collection("rooms")
  .doc(roomId)
  .collection("members")
  .onSnapshot((snapshot) => {
    reactHookCallback(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
  });
}
export function getIfCurrentUserIsGroupAdminFromDb (userId, roomId, reactHookCallback) {
  return db
  .collection("registeredUsers")
  .doc(userId)
  .collection("rooms")
  .doc(roomId)
  .onSnapshot((snapshot) => {
    reactHookCallback(snapshot.data()?.admin);
  });
}