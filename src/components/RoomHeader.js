import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  KeyboardBackspaceRounded,
  LiveHelp,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import db from "../firebase";
import { getMessgFromDb } from "./get&SetDataToDb";
import { displayConvoForMobile } from "./SidebarConvo";
import { useStateValue } from "./StateProvider";

function RoomHeader(props) {
  const {
    roomInfo,
    seed,
    roomMembers,
    setFoundWordIndex,
    roomId,
    setMessages,
    uploadFile,
    setIsRoomSearchBarOpen,
    setTotalRoomWordFound,
  } = props;
  const [searchInput, setSearchInput] = useState("");
  const [{ user }] = useStateValue(); // new logged in user
  const [isroomHeaderHelpOpened, setIsroomHeaderHelpOpened] = useState(false);
  const roomHeaderSearchBar = {
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
      setSearchInput("");
      setTotalRoomWordFound(0);
      setFoundWordIndex(0);
      getMessgFromDb(user?.info.uid, roomId, false, "asc", setMessages, false); // get a new snapshot of message from db
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
      if (searchInput === "") return;
      let unsubcribeModifyMssg = db
        .collection("registeredUsers")
        .doc(user?.info?.uid)
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
    // handling the opeeninga and closing of the HelpIcon
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
      let roomHeaderHelpDiv = document.querySelector(".roomHeaderHelp");
      if (e.target === null || roomHeaderHelpDiv === null) return;
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
      <div className="room__headerWr">
        <IconButton onClick={() => displayConvoForMobile("hide")}>
          <KeyboardBackspaceRounded />
        </IconButton>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="room__headerInfo">
          <h3>{roomInfo?.roomName}</h3>
          <p>
            {roomMembers.length > 0
              ? roomMembers.map((member, index) => (
                  <small key={index}>{member.name}</small>
                ))
              : "There are no member in this room"}
          </p>
        </div>
        <div className="room__headerRight">
          <IconButton onClick={roomHeaderSearchBar.open}>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <input
              onChange={uploadFile}
              type="file"
              className="room__attachfile"
            />
            <AttachFile />
          </IconButton>
          <div>
            <IconButton onClick={roomHeaderHelp.open}>
              <MoreVert />
            </IconButton>
            <div className="roomHeaderHelp" id="roomHeaderHelp">
              <ul>
                <li>Contact Info</li>
                <li>Select Messages</li>
                <li>Mute Notification</li>
                <li>Clear Messages</li>
                <li>Delelct Chat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="room__headerSearch">
        <div>
          <LiveHelp className="helpIcon" />
          <small>Search one word Only</small>
        </div>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
        />
        <SearchOutlined
          onClick={roomHeaderSearchBar.search}
          className="searchIcon"
        />
        <p onClick={roomHeaderSearchBar.close}>Cancel</p>
      </div>
    </section>
  );
}

export default React.memo(RoomHeader);
