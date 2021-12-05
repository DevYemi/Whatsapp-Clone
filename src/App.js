import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import Chat from "./components/chat/Chat";
import ConnectedDisplay from "./components/common/ConnectedDisplay";
import DisplayModal from "./components/common/DisplayModal";
import Login from "./components/auth/Login";
import Room from "./components/room/Room";
import Sidebar from "./components/sidebar/Sidebar";
import { useStateValue } from "./components/global-state-provider/StateProvider";
import Profile from "./components/profile/Profile";
import { getIsUserOnDarkModeOnDb, getTotalUsersFromDb, resetIsUserOnlineOnDb } from "./components/backend/get&SetDataToDb";
import ImageFullScreen from "./components/common/ImageFullScreen";
import gsap from "gsap";
function App() {
  const [{
    user,
    selectedPreviewMember,
    isUserOnDarkMode,
  }, dispatch] = useStateValue();
  const [openModal, setOpenModal] = useState(false); // keeps state if modal is opened or not
  const [imageFullScreen, setImageFullScreen] = useState({ isFullScreen: false }); // keeps state if there currently an image on fullScreen and also keeps details of the image if it is
  const [isChatBeingCleared, setIsChatBeingCleared] = useState(false) // keeps state if current displayed chat messages is being cleared
  const [modalInput, setModalInput] = useState(""); // keeps state of user input in the modal
  const [modalType, setModalType] = useState(""); // keeps state of which type of modal should pop up
  const [isRoom, setIsRoom] = useState(null); // keeps state if the pop up modal is meant for a room or a chat
  const [isUserProfileRoom, setIsUserProfileRoom] = useState(true); // keeps state to display the profile appropriately for chat and room
  const [isFirstRender, setIsFirstRender] = useState(true); // keeps state if App component is  rending for the first time
  const [isConvoSearchBarOpen, setIsConvoSearchBarOpen] = useState(false) // keeps state if the convoheader search bar is open
  const [isConnectedDisplayed, setIsConnectedDisplayed] = useState(false); // keeps state if the connectedDisplay component is currently mounted
  const [isAddChatFromRoomProfile, setIsAddChatFromRoomProfile] = useState(false); // keeps state if user has successfully started a chat with a fellow member and redirect to chat
  const [isThereInternetConnection, setIsThereInternetConnection] = useState(navigator.onLine)  // keeps state and returns a boalean if a user has an internet connection or not
  const addChatBg = { url: "url(/img/chat-bg.svg)", position: "right bottom", size: "contain" } // addchat modal bg-image styles
  const addRoomBg = { url: "url(/img/room-bg.svg)", position: "right bottom", size: "97px" } // addroom modal bg-image styles

  useEffect(() => {
    //  KEEPS A USER LOGGED IN CONSISTENT
    if (localStorage.whatsappCloneUser) {
      let user = JSON.parse(localStorage.whatsappCloneUser)
      dispatch({
        type: "SET_USER",
        user: user,
      })
      resetIsUserOnlineOnDb(user.info.uid, true)
    }
  }, [dispatch]);
  useEffect(() => {
    // Gets if logged in user is on dark mode
    let unsubGetIsUserOnDarkModeOnDb;
    if (user) {
      unsubGetIsUserOnDarkModeOnDb = getIsUserOnDarkModeOnDb(user.info.uid, dispatch)
    }
    return () => unsubGetIsUserOnDarkModeOnDb && unsubGetIsUserOnDarkModeOnDb();
  }, [user, dispatch])
  useEffect(() => { // Gets the total registertered user on db
    let unsubcribeGetToUserFromDb = getTotalUsersFromDb(dispatch);
    return () => { unsubcribeGetToUserFromDb(); }
  }, [dispatch])
  useEffect(() => {
    // adds an event listener thats shows an animated text when a user loses internet connection
    const internetOnline = {
      open: function () {
        const tl = gsap.timeline()
        tl.to(".sidebar_offline", { duration: .2, ease: "power2", display: "none", left: "-100%" })
          .to(".sidebar_online",
            {
              duration: 1,
              onComplete: () => { setIsThereInternetConnection(navigator.onLine); setTimeout(internetOnline.close, 7000) },
              ease: "power3",
              left: "10px"
            })
      },
      close: function () {
        gsap.to(".sidebar_online",
          {
            duration: .5,
            ease: "power3.out",
            left: "-100%"
          })
      }
    }

    const internetOffline = {
      open: function () {
        gsap.to(".sidebar_offline",
          {
            duration: 1,
            ease: "power2",
            display: "",
            left: "10px"
          })
      },
    }

    window.addEventListener("online", internetOnline.open)
    window.addEventListener("offline", internetOffline.open)
    return () => {
      window.removeEventListener("online", internetOnline.open)
      window.removeEventListener("offline", internetOffline.open)
    }

  }, [])
  return (
    <Router>
      {isAddChatFromRoomProfile && <Redirect to={`/chats/${selectedPreviewMember.id}`} />} {/* Redirect to  chat when a user adds chat from romm */}
      <div className={`app ${isUserOnDarkMode && "dark-mode1"}`}>
        {!user ? (
          <Login />
        ) : (
          <div className={`app__body ${isUserOnDarkMode && "dark-mode1"}`}>
            <Sidebar
              setOpenModal={setOpenModal}
              setModalType={setModalType}
              isFirstRender={isFirstRender}
              setIsFirstRender={setIsFirstRender}
              setIsConnectedDisplayed={setIsConnectedDisplayed}
              setIsConvoSearchBarOpen={setIsConvoSearchBarOpen}
              isConvoSearchBarOpen={isConvoSearchBarOpen}
              isThereInternetConnection={isThereInternetConnection}
            />
            <Switch>
              <Route path="/rooms/:roomId">
                <Room
                  setOpenModal={setOpenModal}
                  setModalType={setModalType}
                  setIsRoom={setIsRoom}
                  setIsUserProfileRoom={setIsUserProfileRoom}
                  isRoomSearchBarOpen={isConvoSearchBarOpen}
                  setIsRoomSearchBarOpen={setIsConvoSearchBarOpen}
                  setImageFullScreen={setImageFullScreen}
                />
              </Route>
              <Route path="/chats/:chatId">
                <Chat
                  setOpenModal={setOpenModal}
                  setIsAddChatFromRoomProfile={setIsAddChatFromRoomProfile}
                  setModalType={setModalType}
                  setIsRoom={setIsRoom}
                  setIsUserProfileRoom={setIsUserProfileRoom}
                  isChatSearchBarOpen={isConvoSearchBarOpen}
                  setIsChatSearchBarOpen={setIsConvoSearchBarOpen}
                  isChatBeingCleared={isChatBeingCleared}
                  setIsChatBeingCleared={setIsChatBeingCleared}
                  setImageFullScreen={setImageFullScreen}
                />
              </Route>
              <Route path="/home">
                <ConnectedDisplay />
              </Route>
            </Switch>
            <Profile
              setOpenModal={setOpenModal}
              setModalType={setModalType}
              setIsRoom={setIsRoom}
              isRoom={isUserProfileRoom}
              isFirstRender={isFirstRender}
              isConnectedDisplayed={isConnectedDisplayed}
              setImageFullScreen={setImageFullScreen}
            />
            <DisplayModal
              modalType={modalType}
              openModal={openModal}
              modalInput={modalInput}
              bgStyles={modalType === "ADD_CHAT" ? addChatBg : modalType === "ADD_ROOM" ? addRoomBg : {}}
              isRoom={isRoom}
              setModalInput={setModalInput}
              setOpenModal={setOpenModal}
              setIsConnectedDisplayed={setIsConnectedDisplayed}
              setModalType={setModalType}
              setIsAddChatFromRoomProfile={setIsAddChatFromRoomProfile}
              setIsChatBeingCleared={setIsChatBeingCleared}
            />

            <ImageFullScreen
              imageFullScreen={imageFullScreen}
              setImageFullScreen={setImageFullScreen}
            />

          </div>

        )}
      </div>
    </Router>
  );
}

export default React.memo(App);
