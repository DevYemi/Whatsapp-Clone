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

function ChatHeader(props) {
  const {
    userInfoDb,
    messages,
    setFoundWordIndex,
    chatId,
    setMessages,
    uploadFile,
    setIsChatSearchBarOpen,
    setTotalChatWordFound,
  } = props;
  const [searchInput, setSearchInput] = useState("");
  const [{ user }] = useStateValue(); // new logged in user
  const [ischatHeaderHelpOpened, setIschatHeaderHelpOpened] = useState(false);
  const chatHeaderSearchBar = {
    open: function () {
      let headerContent = document.querySelector(".chat__headerWr");
      let headerSearchBar = document.querySelector(".chat__headerSearch");
      let chatHeader = document.querySelector(".chat__header");
      let tl = gsap.timeline({
        onComplete: () => setIsChatSearchBarOpen(true),
        defaults: { duration: 1, ease: "power2" },
      });
      tl.to(headerContent, { y: "50%", opacity: 0 }, "slide")
        .to(headerSearchBar, { y: 0, opacity: 1 }, "slide")
        .to(headerContent, { display: "none" }, "display-=2")
        .to(headerSearchBar, { display: "flex" }, "display-=2")
        .to(chatHeader, { backgroundColor: "white" });
    },
    close: function () {
      setSearchInput("");
      setTotalChatWordFound(0);
      setFoundWordIndex(0);
      getMessgFromDb(user?.info.uid, chatId, false, "asc", setMessages, false); // get a new snapshot of message from db
      let headerContent = document.querySelector(".chat__headerWr");
      let headerSearchBar = document.querySelector(".chat__headerSearch");
      let chatHeader = document.querySelector(".chat__header");
      let tl = gsap.timeline({
        onComplete: () => {
          setIsChatSearchBarOpen(false);
        },
        defaults: { duration: 1, ease: "power2" },
      });
      tl.to(headerContent, { y: 0, opacity: 1 }, "slide")
        .to(headerSearchBar, { y: "-200%", opacity: 0 }, "slide")
        .to(headerContent, { display: "flex" }, "display-=2")
        .to(headerSearchBar, { display: "none" }, "display-=2")
        .to(chatHeader, { backgroundColor: "#EDEDED" });
    },
    search: function () {
      if (searchInput === "") return;
      let unsubcribeModifyMssg = db
        .collection("registeredUsers")
        .doc(user?.info?.uid)
        .collection("chats")
        .doc(chatId)
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
                let newMessage = chatHeaderSearchBar.filterChange(
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
          setTotalChatWordFound(matched);
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
  const chatHeaderHelp = {
    // handling the opeeninga and closing of the HelpIcon
    open: function () {
      let chatHeaderHelpDiv = document.querySelector(".chatHeaderHelp");
      chatHeaderHelpDiv.style.display = "flex";
      setIschatHeaderHelpOpened(true);
    },
    close: function () {
      let chatHeaderHelpDiv = document.querySelector(".chatHeaderHelp");
      chatHeaderHelpDiv.style.display = "none";
      setIschatHeaderHelpOpened(false);
    },
    handle: function (e) {
      // checks if the chatHeaderHelp Div is open and closes it vice versa
      let chatHeaderHelpDiv = document.querySelector(".chatHeaderHelp");
      if (e.target === null || chatHeaderHelpDiv === null) return;
      let isDecendent = chatHeaderHelpDiv.contains(e.target);
      if (
        e.target.id !== "chatHeaderHelp" &&
        isDecendent === false &&
        ischatHeaderHelpOpened === true
      ) {
        chatHeaderHelp.close();
      }
    },
  };
  useEffect(() => {
    // adds and remove an eventlistener that closes and open the chatHeaderHelp Div
    document.addEventListener("click", chatHeaderHelp.handle);
    return () => {
      document.removeEventListener("click", chatHeaderHelp.handle);
    };
  });

  return (
    <section className="chat__header">
      <div className="chat__headerWr">
        <IconButton onClick={() => displayConvoForMobile("hide")}>
          <KeyboardBackspaceRounded />
        </IconButton>
        <Avatar src={userInfoDb?.avi} />
        <div className="chat__headerInfo">
          <h3>{userInfoDb?.name}</h3>
          <p>
            Last seen{" "}
            {messages[messages.length - 1]?.timestamp
              ? new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toUTCString()
              : "offline"}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton onClick={chatHeaderSearchBar.open}>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <input
              onChange={uploadFile}
              type="file"
              className="chat__attachfile"
            />
            <AttachFile />
          </IconButton>
          <div>
            <IconButton onClick={chatHeaderHelp.open}>
              <MoreVert />
            </IconButton>
            <div className="chatHeaderHelp" id="chatHeaderHelp">
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
      <div className="chat__headerSearch">
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
          onClick={chatHeaderSearchBar.search}
          className="searchIcon"
        />
        <p onClick={chatHeaderSearchBar.close}>Cancel</p>
      </div>
    </section>
  );
}

export default React.memo(ChatHeader);
