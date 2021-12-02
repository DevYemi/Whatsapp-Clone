import db, { storage } from "./firebase";
import firebase from "firebase/app";

export function getUserInfoFromDb(id, hookCallBack, isReducerCallback) {
  if (isReducerCallback) {
    // if its a reducer callback handle it
    return db.collection("registeredUsers")
      .doc(id)
      .onSnapshot((snapshot) =>
        hookCallBack({
          type: "SET_CURRENTDISPLAYCONVOINFO",
          currentDisplayConvoInfo: snapshot.data(),
        })
      )
  } else {
    //handle it like a react state callback
    return db
      .collection("registeredUsers")
      .doc(id)
      .onSnapshot((snapshot) => hookCallBack(snapshot.data()))
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
    })
}
export function getRoomsFromDb(id, setRooms) {
  // gets rooms fromdb
  return db
    .collection("registeredUsers")
    .doc(id)
    .collection("rooms")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      // get rooms where user belong to
      let roomsInfo = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
      db.collection("rooms")
        .orderBy("timestamp", "desc")
        .get()
        .then(querySnapshot => {
          // then get all the rooms in db
          let datas = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
          let array = [];
          roomsInfo.forEach(room => { // loop through all the rooms in db and pull out the ones where user belong to
            array = [...array, ...datas.filter(data => data.id === room.id)]
          })
          array.forEach((arr, arrIndex) => { // loop through room info and merge with user room info 
            for (let i = 0; i < roomsInfo.length; i++) {
              const roomInfo = roomsInfo[i];
              if (arr.id === roomInfo.id) {
                array[arrIndex].data.muted = roomsInfo[i].data.muted
                i = roomsInfo.length + 1
              }

            }
          })
          setRooms(array);
        }).catch(e => console.log(e))

      // setRooms(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    })
}

export function createNewChatInDb(user, chatUser, shouldOpenChatCallback) {
  // create new chat when a user clicks on add chat
  db.collection("registeredUsers") // add chat to user currently online
    .doc(user?.info.uid)
    .collection("chats")
    .doc(chatUser.uid || chatUser.id)
    .set({
      id: chatUser.uid || chatUser.id,
      isBlocked: "",
      isRoom: false,
      email: chatUser.email || chatUser.data.email,
      isRead: true,
      muted: false,
      phoneNumber: chatUser.phoneNumber || chatUser.data.phoneNumber,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).then(() => {
      db.collection("registeredUsers") // add chat to other user
        .doc(chatUser.uid || chatUser.id)
        .collection("chats")
        .doc(user?.info.uid)
        .set({
          id: user?.info.uid,
          isRoom: false,
          muted: false,
          email: user?.info.email,
          isRead: false,
          phoneNumber: user?.phoneNumber,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }).then(() => {
      if (shouldOpenChatCallback) { // if callback exist call it
        shouldOpenChatCallback()
      }
    })
    .catch(e => console.log(e))
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
      isCreator: true,
      muted: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(e => console.log(e))
  db.collection("rooms") // add room to Rooms db
    .doc(newRoomKey)
    .set({
      avi: "",
      roomName: roomName,
      roomId: newRoomKey,
      isRoom: true,
      createdBy: user?.info.uid,
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
      muted: false,
      description: "",
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      addNewMemberToRoomToDb(newRoomKey, user, true, true);
    }).catch(e => console.log(e))
}
export function addNewMemberToRoomToDb(roomId, user, admin, isCreator) {
  db.collection("rooms") // add room to Rooms db
    .doc(roomId)
    .collection("members")
    .doc(user?.info.uid)
    .set({
      phoneNumber: user?.phoneNumber || user.info.phoneNumber,
      id: user?.info.uid,
      isAdmin: admin,
      isCreator: isCreator,
      isOnScreen: false
    }).catch(e => console.log(e))
}
export function addRoomToUserConvoInDb(roomId, users, admin, hookCallback) {
  if (Array.isArray(users)) {
    try {
      users.forEach((user, index) => {
        // add room to user convo in db
        db.collection("registeredUsers")
          .doc(user?.info.uid)
          .collection("rooms")
          .doc(roomId)
          .set({
            id: roomId,
            isRoom: true,
            isCreator: false,
            muted: false,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          }).then(() => {
            // add user to room members in db
            addNewMemberToRoomToDb(roomId, user, admin, false);
          })
          .catch(e => { console.log(e) })
        if (index === users.length - 1) hookCallback({ loading: false, success: true })
      })
    } catch (e) {
      console.log(e)
      hookCallback({ loading: false, success: false })
    }

  }
}
export function getMessgFromDb(userId, convoId, isRoom, order, hookCallback, getLastMessage) {
  // gets all the message in a room fromdb
  if (isRoom) {
    return db
      .collection("rooms")
      .doc(convoId)
      .collection("messages")
      .orderBy("timestamp", order)
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (getLastMessage) {
          hookCallback(data[0]);
        } else {
          hookCallback(data);
        }
      })
  } else {
    return db
      .collection("registeredUsers")
      .doc(userId)
      .collection("chats")
      .doc(convoId)
      .collection("messages")
      .orderBy("timestamp", order)
      .onSnapshot((snapshot) => {
        let data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (getLastMessage) {
          hookCallback(data[0]);
        } else {
          hookCallback(data);
        }
      })
  }
}

export function getRoomInfoFromDb(id, hookCallBack, isReducerCallback) {
  // gets the name of a specific room from db
  if (isReducerCallback) {
    // if its a reducer callback handle it
    return db
      .collection("rooms")
      .doc(id)
      .onSnapshot((snapshot) => {
        hookCallBack({
          type: "SET_CURRENTDISPLAYCONVOINFO",
          currentDisplayConvoInfo: snapshot.data(),
        })
      });
  } else {
    //handle it like a react state callback
    return db
      .collection("rooms")
      .doc(id)
      .onSnapshot((snapshot) => hookCallBack(snapshot.data()))

  }

}
export function getCurrentChatNameFromDb(userId, chatId, hookCallback) {
  // gets the name of a specific chat from db
  let docRef = db
    .collection("registeredUsers")
    .doc(userId)
    .collection("chats")
    .doc(chatId)
    .catch(e => console.log(e))

  docRef.get()
    .then((doc) => {
      if (doc.exists) {
        hookCallback(doc.data()?.name);
      }
    }).catch(e => console.log(e))
}
export function setNewMessageToDb(convoId, text, user, scrollConvoBody, isRoom, fileType) {
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
        resetRecieverMssgReadOnDb(user?.info?.uid, convoId, true, isRoom);
        resetOtherMembersReadOnDbToFalse(user?.info?.uid, convoId)
        resetLatestMssgWithTimeStamp(user?.info.uid, convoId, isRoom);
        scrollConvoBody.toEnd();
      })
      .catch(e => console.log(e))
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
        isRead: true,
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
            senderId: user?.info?.uid,
            isRead: false,
            receiverId: convoId,
            fileType: fileType,
            name: user?.info.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            resetLatestMssgWithTimeStamp(user?.info.uid, convoId, isRoom);
            scrollConvoBody.toEnd();
          })
          .catch(e => console.log(e))
      });
  }
}
export function resetOtherMembersReadOnDbToFalse(userId, convoId) {
  // gets all the members of a room in db except current logged in user
  db.collection("rooms")
    .doc(convoId)
    .collection("members")
    .where("id", "!=", userId)
    .where("isOnScreen", "==", false)
    .get()
    .then(snapshot => {
      // then set their isRead to false
      let membersId = snapshot.docs.map(doc => ({ id: doc.id }))
      membersId.forEach(memId => {
        db.collection("rooms")
          .doc(convoId)
          .collection("members")
          .doc(memId.id)
          .update({
            isRead: false
          })
      })
    }).catch(e => console.log(e))
}
export function resetLatestMssgWithTimeStamp(senId, recId, isRoom) {
  if (isRoom) {
    db.collection("registeredUsers")
      .doc(senId)
      .collection("rooms")
      .doc(recId)
      .update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch(e => console.log(e))
    db.collection("rooms").doc(recId).update({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(err => console.log(err));
  } else {
    db.collection("registeredUsers") // update receiver
      .doc(recId)
      .collection("chats")
      .doc(senId)
      .update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }).catch(err => console.log(err.message));
    db.collection("registeredUsers") // update sender
      .doc(senId)
      .collection("chats")
      .doc(recId)
      .update({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }).catch(err => console.log(err));
  }
}
export function resetRecieverMssgReadOnDb(recId, senId, value, isRoom) {
  // resets all user isRead messages to true when user opens or is on current chat or room
  if (isRoom) { // handles as a room
    db.collection("rooms")
      .doc(senId)
      .collection("members")
      .doc(recId)
      .update({
        isRead: value,
      }).catch(err => console.log(err));
  } else { // else handle has a chat
    // gets all messages where isRead is false
    db.collection("registeredUsers")
      .doc(recId)
      .collection("chats")
      .doc(senId)
      .collection("messages")
      .where("isRead", "==", false)
      .get()
      .then(snapshot => {
        // then update isRead of such messages to true
        let messagesId = snapshot.docs.map(doc => ({ id: doc.id }))
        messagesId.forEach(mssgId => {
          db.collection("registeredUsers")
            .doc(recId)
            .collection("chats")
            .doc(senId)
            .collection("messages")
            .doc(mssgId.id)
            .update({
              isRead: true,
            })
        })
      })
  }
}
export function getAndComputeNumberOfNewMssgOnDb(userId, isRoom, convoId, setNewMssgNum) {
  if (isRoom) {
    // get it from the rooms in db
    return db.collection("rooms")
      .doc(convoId)
      .collection("members")
      .doc(userId)
      .onSnapshot((snapshot) => {
        let isRoomRead = snapshot.data()?.isRead;
        if (!isRoomRead) {
          setNewMssgNum(1);
        } else {
          setNewMssgNum(0);
        }
      })
  } else {
    // get it from the chats in db
    return db.collection("registeredUsers")
      .doc(userId)
      .collection("chats")
      .doc(convoId)
      .collection("messages")
      .where("isRead", "==", false)
      .onSnapshot((snapshot) => {
        setNewMssgNum(snapshot.docs.length);
      });
  }
}
export function resetUserRoomOnScreenInDb(userId, roomId, value) {
  db.collection("rooms")
    .doc(roomId)
    .collection("members")
    .doc(userId)
    .update({
      isOnScreen: value
    })
}
export function uploadFileToDb(file, fileInfo, setFileOnPreview, setIsFileOnPreviewLoading) {
  // upload files e.g image, audio, video to strorage and returns the URL
  const newKey = firebase.database().ref().child("file").push().key;
  console.log(newKey)
  const uploadTask = storage.ref(`${fileInfo.type}/${newKey}`).put(file); // saved new image to storage
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
        .child(newKey)
        .getDownloadURL()
        .then((url) => {
          setFileOnPreview({ url, info: fileInfo });
          setIsFileOnPreviewLoading(false);
        });
    }
  );
}
export function setVoiceNoteToDb(file, chatId, user, scrollConvoBody, convoInfo, min, sec) {
  // upload the new created voice note to strorage and send the url to db
  const newKey = firebase.database().ref().child("file").push().key;
  const uploadTask = storage.ref(`audio/voice-note${newKey}`).put(file);
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
        .child(`voice-note${newKey}`)
        .getDownloadURL()
        .then((url) => {
          setNewMessageToDb(chatId, "", user, scrollConvoBody, convoInfo?.isRoom, { url, info: { type: "voice-note", min, sec, exten: "mp3", avi: user?.info.photoURL, } }
          );
        });
    }
  );
}
export function registerNewUserInDb(email, phoneNumber, uid, name, avi) {
  // register a new user on the db
  // registers a new user to the db
  let about = "Hey there! I am using WhatsApp."
  db.collection("totalUsers")
    .doc(uid)
    .set({ email, phoneNumber, uid, name, avi })
    .catch(e => console.log(e));
  db.collection("registeredUsers")
    .doc(uid)
    .set({ email, phoneNumber, uid, name, avi, about })
    .catch(e => console.log(e));
}
export function getTotalUsersFromDb(reducerCallback) {
  // gets all the total registered users on db
  return db
    .collection("registeredUsers")
    .onSnapshot((snapshot) => {
      let data = snapshot.docs.map((doc) => doc.data());
      reducerCallback({
        type: "SET_TOTALUSERONDB",
        totalUserOnDb: data
      })
    })
}

export function muteConvoOnDb(userId, convoId, isRoom, hookCallback) {
  // mute contact chat or room on the db
  db.collection("registeredUsers")
    .doc(userId)
    .collection(isRoom ? "rooms" : "chats")
    .doc(convoId)
    .update({
      muted: true,
    })
    .then(() => {
      hookCallback({
        type: "SET_ISMUTENOTIFICHECKED",
        isMuteNotifichecked: true,
      });
    }).catch(err => console.log(err));
}
export function unmuteConvoOnDb(userId, convoId, isRoom, hookCallback) {
  // unmute contact chat or room on the db
  db.collection("registeredUsers")
    .doc(userId)
    .collection(isRoom ? "rooms" : "chats")
    .doc(convoId)
    .update({
      muted: false,
    })
    .then(() => {
      hookCallback({
        type: "SET_ISMUTENOTIFICHECKED",
        isMuteNotifichecked: false,
      });
    }).catch(err => console.log(err));
}
export function isConvoMutedOnDb(userId, convoId, isRoom, hookCallback) {
  // checks if a convo is muted or not
  let docRef = db
    .collection("registeredUsers")
    .doc(userId)
    .collection(isRoom ? "rooms" : "chats")
    .doc(convoId);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        hookCallback({
          type: "SET_ISMUTENOTIFICHECKED",
          isMuteNotifichecked: doc.data()?.muted,
        });
      } else {
      }
    })
    .catch(e => console.log(e));
}
export function setNewGroupNameOnDb(roomId, newRoomName) {
  // Set a new name for a group on the db

  db.collection("rooms").doc(roomId).update({
    roomName: newRoomName,
  }).catch(err => console.log(err));
}
export function setNewGroupDescriptionOnDb(roomId, newRoomDescription) {
  // set a new description for the group on the db
  db.collection("rooms").doc(roomId).update({
    description: newRoomDescription,
  }).catch(err => console.log(err));
}
export function getGroupMemberFromDb(roomId, reactHookCallback) {
  let modifiedMemebers = [];
  return db // first get members from db
    .collection("rooms")
    .doc(roomId)
    .collection("members")
    .onSnapshot((snapshot) => {
      let upperSnapshot = snapshot.docs;
      snapshot.docs.forEach((member, index) => {
        // for each members go get their current individual avi

        db.collection("registeredUsers")
          .doc(member.id)
          .get()
          .then((snapshot) => {
            modifiedMemebers.push({
              id: member.id,
              data: snapshot.data(),
              isAdmin: member.data().isAdmin
            });
            if (upperSnapshot.length === modifiedMemebers.length) {
              // when members list length equal modifiedMemebers list length call reactHookCallback
              reactHookCallback(modifiedMemebers);
              modifiedMemebers = [];
            }
          });
      });
    });
}
export function getIfCurrentUserIsGroupAdminFromDb(userId, roomId, reactHookCallback) {
  // gets if the current logged in user is an admin of the group
  return db
    .collection("rooms")
    .doc(roomId)
    .collection("members")
    .doc(userId)
    .onSnapshot((snapshot) => {
      reactHookCallback(snapshot.data()?.isAdmin);
    });
}
export function exitFromGroupOnDb(userId, roomId) {
  // Delete Room Info from user Data
  db.collection('registeredUsers')
    .doc(userId)
    .collection('rooms')
    .doc(roomId)
    .delete()
    .then(() => {
      // Delete User Info As A Group Members On Db
      db.collection('rooms')
        .doc(roomId)
        .collection('members')
        .doc(userId)
        .delete()
    })
    .catch(e => console.log(e));
}
export function setMemberAdminStatusInDb(roomId, memId, admin) {
  // Reset member admin status in db
  db.collection("rooms")
    .doc(roomId)
    .collection("members")
    .doc(memId)
    .update({
      isAdmin: admin
    })
}
export function removeMemberFromRoomInDb(roomId, memId) {
  // Remove member from groups
  db.collection("registeredUsers") // remove in members db rooms info
    .doc(memId)
    .collection("rooms")
    .doc(roomId)
    .delete()
    .then(() => { // then remove in rooms members info
      db.collection("rooms")
        .doc(roomId)
        .collection("members")
        .doc(memId)
        .delete()
        .catch(e => console.log(e))
    }).catch(e => console.log(e))
}
export function getUserProfilePictureFromDb(userId, callBackFunc) {
  return db
    .collection("registeredUsers")
    .doc(userId)
    .onSnapshot((snapshot) => {
      callBackFunc(snapshot.data().avi);
    })
}

export function setNewAviForGroupOnDb(image, roomId, setLoadingChangeAvi) {
  const setImageUrlOnDb = (url) => {
    // set new avi url on db
    db.collection("rooms")
      .doc(roomId)
      .update({
        avi: url,
      }).then(() => {
        setLoadingChangeAvi(false)
      }).catch(err => console.log(err));
  };
  const sendImgToStorage = () => {
    // saved new image to storage and create a url for it
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        console.log(error.message);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setImageUrlOnDb(url);
          });
      }
    );
  };
  sendImgToStorage();
}
export function getIsConvoBlockedOnDb(userId, chatId, hookCallback) {
  return db
    .collection("registeredUsers")
    .doc(userId)
    .collection("chats")
    .doc(chatId)
    .onSnapshot((snapshot) => {
      hookCallback({
        type: "SET_ISCURRENTCONVOBLOCKED",
        isCurrentConvoBlocked: snapshot?.data()?.isBlocked,
      });
    })
}
export function unBlockChatOnDb(userId, chatId) {
  const unBlockOncurrentLoggedInUserDb = () => {
    db.collection("registeredUsers")
      .doc(userId)
      .collection("chats")
      .doc(chatId)
      .update({
        isBlocked: "",
      }).catch(err => console.log(err));
  };
  const unBlockOnOtherUserDb = () => {
    db.collection("registeredUsers")
      .doc(chatId)
      .collection("chats")
      .doc(userId)
      .update({
        isBlocked: "",
      }).catch(err => console.log(err));
  };
  unBlockOncurrentLoggedInUserDb();
  unBlockOnOtherUserDb();
}
export function blockChatOnDb(userId, chatId) {
  const blockOncurrentLoggedInUserDb = () => {
    db.collection("registeredUsers")
      .doc(userId)
      .collection("chats")
      .doc(chatId)
      .update({
        isBlocked: userId,
      }).catch(err => console.log(err));
  };
  const blockOnOtherUserDb = () => {
    db.collection("registeredUsers")
      .doc(chatId)
      .collection("chats")
      .doc(userId)
      .update({
        isBlocked: userId,
      }).catch(err => console.log(err));
  };
  blockOncurrentLoggedInUserDb();
  blockOnOtherUserDb();
}
export async function clearChatOnDb(userId, chatId, reactHookCallback) {
  db.collection("registeredUsers")
    .doc(userId)
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .get()
    .then(querySnapshot => {
      // get each message and delete it individualy
      querySnapshot.forEach((mssg, index) => {
        db.collection("registeredUsers")
          .doc(userId)
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .doc(mssg.id)
          .delete()
          .catch(err => console.log(err));
      })
    }).then(() => {
      // all messages has been cleared reset chat being cleared to false
      if (reactHookCallback) {
        reactHookCallback(false);
      }
    })

}
export function deleteConvoOnDb(userId, chatId) {
  clearChatOnDb(userId, chatId);
  db.collection("registeredUsers")
    .doc(userId)
    .collection("chats")
    .doc(chatId)
    .delete()
    .catch(err => console.log(err));
}

export function setNewLoggedInUserNameOnDb(userId, newName) {
  // Set a new name for Logged in user on db

  db.collection("registeredUsers")
    .doc(userId)
    .update({
      name: newName,
    }).catch(err => console.log(err));
}
export function setNewLoggedInUserAboutOnDb(userId, newAbout) {
  // Set a new about for Logged in user on db

  db.collection("registeredUsers")
    .doc(userId)
    .update({
      about: newAbout,
    }).catch(err => console.log(err));
}
export function setNewLoggedInUserAviOnDb(userId, newAvi, hookCallback) {
  // Set a new avi for Logged in user on db

  const uploadTask = storage.ref(`image/${newAvi.name}`).put(newAvi); // saved new image to storage
  uploadTask.on("state_changed", (snapshot) => {
    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    console.log(progress);
  },
    (error) => { alert(error.message); },
    () => {
      storage
        .ref('image')
        .child(newAvi.name)
        .getDownloadURL()
        .then(async (url) => {
          await db.collection("registeredUsers")
            .doc(userId)
            .update({
              avi: url,
            }).catch(err => console.log(err));
          hookCallback(false);
        });
    }
  );

}
export function getIfMessageHasBeenReadFromDb(receiverId, senderId, mssgId, reactHookCallback) {
  // checks if a specific message has been read by the other chat user e.g receiver
  return db.collection("registeredUsers")
    .doc(receiverId)
    .collection("chats")
    .doc(senderId)
    .collection("messages")
    .doc(mssgId)
    .onSnapshot(snapshot => {
      reactHookCallback(snapshot.data()?.isRead)
    })
}

export function resetIsUserOnlineOnDb(userId, value) {
  // resets user online value
  db.collection("registeredUsers")
    .doc(userId)
    .update({
      isOnline: value,
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(e => console.log(e))
}

export function getIsUserOnlineOnDb(userId, reactHookCallback) {
  // gets if a user is online
  return db.collection("registeredUsers")
    .doc(userId)
    .onSnapshot(snapshot => {
      reactHookCallback(snapshot.data()?.isOnline)
    })
}

export function getUserLastSeenTime(userId, reactHookCallback) {
  // Gets a user last seen date from db
  return db.collection("registeredUsers")
    .doc(userId)
    .onSnapshot(snapshot => {
      reactHookCallback(snapshot.data()?.lastSeen)
    })
}

export function resetIsUserTypingOnDb(userId, convoId, isRoom, value) {
  if (isRoom) {
    db.collection("rooms")
      .doc(convoId)
      .collection("members")
      .doc(userId)
      .update({
        isTyping: value
      }).catch(err => console.log(err));
  } else {
    db.collection("registeredUsers")
      .doc(convoId)
      .collection("chats")
      .doc(userId)
      .update({
        isTyping: value
      }).catch(err => console.log(err));
  }
}

export function getIsUserTypingFromDb(userId, convoId, isRoom, reactHookCallback) {
  if (isRoom) {
    // gets members that are typing on db
    db.collection("rooms")
      .doc(convoId)
      .collection("members")
      .where("isTyping", "==", true)
      .onSnapshot(snapshot => {
        let members = snapshot.docs.map(doc => doc.id)
        if (members.length !== 0) {
          // pick one user & get their current infos
          let member = members[0];
          db.collection("registeredUsers")
            .doc(userId)
            .get()
            .then(doc => {
              reactHookCallback({ ...member, name: doc.data()?.name });
            }).catch(err => console.log(err));
        } else {
          reactHookCallback(null);
        }
      })

  } else {
    return db.collection("registeredUsers")
      .doc(userId)
      .collection("chats")
      .doc(convoId)
      .onSnapshot(snapshot => {
        reactHookCallback(snapshot.data()?.isTyping)
      })
  }
}

export function resetIsUserOnDarkModeOnDb(userId, value) {
  db.collection("registeredUsers")
    .doc(userId)
    .update({
      darkMode: value,
    })
}

export function getIsUserOnDarkModeOnDb(userId, reducerDispatch) {
  return db.collection("registeredUsers")
    .doc(userId)
    .onSnapshot(snapshot => {
      reducerDispatch({
        type: "SET_ISUSERONDARKMODE",
        isUserOnDarkMode: snapshot.data()?.darkMode
      })
    })
}



