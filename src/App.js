import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Chat from "./components/chat/Chat";
import ConnectedDisplay from "./components/common/ConnectedDisplay";
import DisplayModal from "./components/common/DisplayModal";
import Login from "./components/auth/Login";
import Room from "./components/room/Room";
import Sidebar from "./components/sidebar/Sidebar";
import { useStateValue } from "./components/global-state-provider/StateProvider";
import Profile from "./components/profile/Profile";
function App() {
  const [{ user }] = useStateValue();
  const [openModal, setOpenModal] = useState(false); // keeps state if modal is opened or not
  const [modalInput, setModalInput] = useState(""); // keeps state of user input in the modal
  const [modalType, setModalType] = useState(""); // keeps state of which type of modal should pop up
  const [isRoom, setIsRoom] = useState(null); // keeps state if the pop up modal is meant for a room or a chat
  const [isUserProfileRoom, setIsUserProfileRoom] = useState(true); // keeps state to display the profile appropriately for chat and room
  const [isFirstRender, setIsFirstRender] = useState(true); // keeps state if App component is  rending for the first time
  const [isConnectedDisplayed, setIsConnectedDisplayed] = useState(false); // keeps state if the connectedDisplay component is currently mounted
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <div className="app__body">
            <Sidebar
              isFirstRender={isFirstRender}
              setIsFirstRender={setIsFirstRender}
              setIsConnectedDisplayed={setIsConnectedDisplayed}
            />
            <Switch>
              <Route path="/rooms/:roomId">
                <Room
                  setOpenModal={setOpenModal}
                  setModalType={setModalType}
                  setIsRoom={setIsRoom}
                  setIsUserProfileRoom={setIsUserProfileRoom}
                />
              </Route>
              <Route path="/chats/:chatId">
                <Chat
                  setOpenModal={setOpenModal}
                  setModalType={setModalType}
                  setIsRoom={setIsRoom}
                  setIsUserProfileRoom={setIsUserProfileRoom}
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
            />
            <DisplayModal
              modalType={modalType}
              openModal={openModal}
              modalInput={modalInput}
              isRoom={isRoom}
              setModalInput={setModalInput}
              setOpenModal={setOpenModal}
              setIsConnectedDisplayed={setIsConnectedDisplayed}
            />
          </div>
        </Router>
      )}
    </div>
  );
}

export default React.memo(App);
