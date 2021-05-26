import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat";
import DisplayModal from "./components/DisplayModal";
import Login from "./components/Login";
import Room from "./components/Room";
import Sidebar from "./components/Sidebar";
import { useStateValue } from "./components/StateProvider";
import UserProfile from "./components/UserProfile";
function App() {
  const [{ user }] = useStateValue();
  const [openModal, setOpenModal] = useState(false); // keeps state if modal is opened or not
  const [modalInput, setModalInput] = useState(""); // keeps state of user input in the modal
  const [modalType, setModalType] = useState(""); // keeps state of which type of modal should pop up
  const [isRoom, setIsRoom] = useState(null); // keeps state if the pop up modal is meant for a room or a chat
  console.log(user);
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <Router>
          <div className="app__body">
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Room
                  setOpenModal={setOpenModal}
                  setModalType={setModalType}
                  setIsRoom={setIsRoom}
                />
              </Route>
              <Route path="/chats/:chatId">
                <Chat
                  setOpenModal={setOpenModal}
                  setModalType={setModalType}
                  setIsRoom={setIsRoom}
                />
              </Route>
            </Switch>
            <UserProfile
              setOpenModal={setOpenModal}
              setModalType={setModalType}
              setIsRoom={setIsRoom}
            />
            <DisplayModal
              modalType={modalType}
              openModal={openModal}
              modalInput={modalInput}
              isRoom={isRoom}
              setModalInput={setModalInput}
              setOpenModal={setOpenModal}
            />
          </div>
        </Router>
      )}
    </div>
  );
}

export default App;
