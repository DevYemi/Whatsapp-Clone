import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, KeyboardBackspaceRounded, LiveHelp, MoreVert, SearchOutlined, } from "@material-ui/icons";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import db from "../backend/firebase";
import { getMessgFromDb } from "../backend/get&SetDataToDb";
import { displayConvoForMobile, mobileDisplayConvoProfile } from "../utils/mobileScreenUtils";
import { useStateValue } from "../global-state-provider/StateProvider";
import { profile } from "../utils/profileUtils";
import { useHistory } from "react-router";

function RoomHeader(props) {
  const {
    roomMembers,
    setFoundWordIndex,
    roomId,
    setMessages,
    uploadFile,
    setIsRoomSearchBarOpen,
    setTotalRoomWordFound,
    setOpenModal,
    setModalType,
    setIsRoom,
    roomMemberWhomTyping,
    isRoomSearchBarOpen
  } = props;
  const [searchInput, setSearchInput] = useState("");
  const [{ user, currentDisplayConvoInfo, isUserOnDarkMode }] = useStateValue(); // new logged in user
  const [isroomHeaderHelpOpened, setIsroomHeaderHelpOpened] = useState(false); // keeps state if the room help div is opened or not
  const history = useHistory()
  const roomHeaderSearchBar = {
    // opens room header search bar with a smooth animation
    open: function () {
      let headerContent = document.querySelector(".room__headerWr");
      let headerSearchBar = document.querySelector(".room__headerSearch");
      let roomHeader = document.querySelector(".room__header");
      let tl = gsap.timeline({
        onComplete: () => setIsRoomSearchBarOpen(true),
        defaults: { duration: 1, ease: "power2" },
      });
      tl.to(headerContent, { y: "50%", opacity: 0 }, "slide")
        .to(headerSearchBar, { y: 0, opacity: 1 }, "slide")
        .to(headerContent, { display: "none" }, "display-=2")
        .to(headerSearchBar, { display: "flex" }, "display-=2")
        .to(roomHeader, { backgroundColor: "white" });
    },
    close: function () {
      // closes room header search bar with a smooth animation
      setSearchInput("");
      setTotalRoomWordFound(0);
      setFoundWordIndex(0);
      getMessgFromDb(user?.info.uid, roomId, true, "asc", setMessages, false); // get a new snapshot of message from db
      let headerContent = document.querySelector(".room__headerWr");
      let headerSearchBar = document.querySelector(".room__headerSearch");
      let roomHeader = document.querySelector(".room__header");
      let tl = gsap.timeline({
        onComplete: () => {
          setIsRoomSearchBarOpen(false);
        },
        defaults: { duration: 1, ease: "power2" },
      });
      tl.to(headerContent, { y: 0, opacity: 1 }, "slide")
        .to(headerSearchBar, { y: "-200%", opacity: 0 }, "slide")
        .to(headerContent, { display: "flex" }, "display-=2")
        .to(headerSearchBar, { display: "none" }, "display-=2")
        .to(roomHeader, { backgroundColor: "#EDEDED" });
    },
    search: function () {
      // search for the inputed word by user
      if (searchInput === "") return;
      let unsubcribeModifyMssg = db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          let data = snapshot.docs.map((doc) => doc.data());
          let matched = 0;
          let messagesModify = [...data];
          data.forEach((mssg, parentIndex) => {
            let wordInMssg = mssg.message.split(" ");
            wordInMssg.forEach((word, childIndex) => {
              let wordCase = word.toLowerCase();
              let searchInputCase = searchInput.toLowerCase();
              if (wordCase === searchInputCase) {
                matched++;
                let newMessage = roomHeaderSearchBar.filterChange(
                  messagesModify,
                  word,
                  parentIndex,
                  matched
                );
                messagesModify[parentIndex].message = newMessage;
              }
            });
          });
          unsubcribeModifyMssg();
          setFoundWordIndex(0);
          setTotalRoomWordFound(matched);
          setMessages(messagesModify);
        });
    },
    filterChange: function (messagesModify, word, parentIndex, matched) {
      // modify the word in the message
      let specificMssg = messagesModify[parentIndex].message;
      const regexWord = new RegExp(`${word}`);
      let newMessage = specificMssg.replace(
        regexWord,
        `<strong id="mssg${matched}">${word}</strong>`
      );
      return newMessage;
    },
  };
  const roomHeaderHelp = {
    // handling the opening and closing of the HelpIcon
    open: function () {
      let roomHeaderHelpDiv = document.querySelector(".roomHeaderHelp");
      roomHeaderHelpDiv.style.display = "flex";
      setIsroomHeaderHelpOpened(true);
    },
    close: function () {
      let roomHeaderHelpDiv = document.querySelector(".roomHeaderHelp");
      roomHeaderHelpDiv.style.display = "none";
      setIsroomHeaderHelpOpened(false);
    },
    handle: function (e) {
      // checks if the roomHeaderHelp Div is open and closes it vice versa
      let roomHeaderHelpDiv = document.querySelector(".roomHeaderHelp__wr");
      if (e.target === null || roomHeaderHelpDiv === null || isRoomSearchBarOpen) return;
      let isDecendent = roomHeaderHelpDiv.contains(e.target);
      if (
        e.target.id !== "roomHeaderHelp" &&
        isDecendent === false &&
        isroomHeaderHelpOpened === true
      ) {
        roomHeaderHelp.close();
      }
    },
  };
  useEffect(() => {
    // adds and remove an eventlistener that closes and open the roomHeaderHelp Div
    document.addEventListener("click", roomHeaderHelp.handle);
    return () => {
      document.removeEventListener("click", roomHeaderHelp.handle);
    };
  });

  return (
    <section className="room__header">
      <div className={`room__headerWr ${isUserOnDarkMode && "dark-mode2"}`}>
        <IconButton onClick={() => displayConvoForMobile("hide", () => history.push("/home"))}>
          <KeyboardBackspaceRounded
            className={`${isUserOnDarkMode && "dark-mode-color3"}`}
          />
        </IconButton>
        <Avatar src={currentDisplayConvoInfo?.avi} onClick={() => {
          mobileDisplayConvoProfile("show", true);
          profile.open(true)
        }} />
        <div className="room__headerInfo" onClick={() => {
          mobileDisplayConvoProfile("show", true);
          profile.open(true)
        }}>
          <h3>{currentDisplayConvoInfo?.roomName}</h3>
          <p>
            {roomMemberWhomTyping ?
              `${roomMemberWhomTyping.name} Typing...`
              : roomMembers.length > 0
                ? roomMembers.map((member, index) => (
                  <small key={index}>{`${member.data.name}, `}</small>
                ))
                : "There are no member in this room"}
          </p>
        </div>
        <div className="room__headerRight">
          <IconButton onClick={roomHeaderSearchBar.open}>
            <SearchOutlined
              className={`${isUserOnDarkMode && "dark-mode-color3"}`}
            />
          </IconButton>
          <IconButton>
            <input
              onChange={uploadFile}
              type="file"
              className="room__attachfile"
            />
            <AttachFile
              className={`${isUserOnDarkMode && "dark-mode-color3"}`}
            />
          </IconButton>
          <div className="roomHeaderHelp__wr">
            <IconButton onClick={roomHeaderHelp.open}>
              <MoreVert
                className={`${isUserOnDarkMode && "dark-mode-color3"}`}
              />
            </IconButton>
            <div className="roomHeaderHelp" id="roomHeaderHelp">
              <ul className={`${isUserOnDarkMode && "dark-mode1"}`}>
                <li onClick={() => {
                  mobileDisplayConvoProfile("show", true);
                  profile.open(true)
                }}>
                  Group Info
                </li>
                <li>Select Messages</li>
                <li
                  onClick={() => {
                    setOpenModal(true);
                    setModalType("MUTE__CONVO");
                    setIsRoom(true);
                    roomHeaderHelp.close();
                  }}
                >
                  Mute Notification
                </li>
                <li onClick={() => {
                  setOpenModal(true);
                  setModalType("CLEAR__MESSAGES");
                  setIsRoom(true);
                  roomHeaderHelp.close();
                }}
                >Clear Messages</li>
                <li onClick={() => {
                  setOpenModal(true);
                  setModalType("EXIT_GROUP");
                  setIsRoom(true);
                  roomHeaderHelp.close();
                }}
                >Exit Group</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={`room__headerSearch ${isUserOnDarkMode && "dark-mode2"}`}>
        <div>
          <LiveHelp className="helpIcon" />
          <small>Search one word Only</small>
        </div>
        <input
          value={searchInput}
          className={`${isUserOnDarkMode && "dark-mode1"}`}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
        />
        <SearchOutlined
          onClick={roomHeaderSearchBar.search}
          className={`searchIcon ${isUserOnDarkMode && "dark-mode-color3"}`}
        />
        <p onClick={roomHeaderSearchBar.close}>Cancel</p>
      </div>
    </section>
  );
}

export default React.memo(RoomHeader);
