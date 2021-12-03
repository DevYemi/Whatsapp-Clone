import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, KeyboardBackspaceRounded, LiveHelp, MoreVert, SearchOutlined } from "@material-ui/icons";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import db from "../backend/firebase";
import { getMessgFromDb } from "../backend/get&SetDataToDb";
import { displayConvoForMobile, mobileDisplayConvoProfile } from "../utils/mobileScreenUtils";
import { useStateValue } from "../global-state-provider/StateProvider";
import { profile } from "../utils/profileUtils";
import { useHistory } from "react-router";

function ChatHeader(props) {
  const {
    currentDisplayConvoInfo,
    setFoundWordIndex,
    chatId,
    setMessages,
    uploadFile,
    setIsChatSearchBarOpen,
    setTotalChatWordFound,
    setOpenModal,
    setModalType,
    setIsRoom,
    isChatUserOnline,
    chatUserLastSeen,
    isChatUserTyping,
    isChatSearchBarOpen
  } = props;
  const [searchInput, setSearchInput] = useState("");
  const [{ user, isUserOnDarkMode }] = useStateValue(); // new logged in user
  const [ischatHeaderHelpOpened, setIschatHeaderHelpOpened] = useState(false); // keeps state if the chat help div is opened or not
  const history = useHistory()
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
    // handling the opeening and closing of the HelpIcon
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
      let chatHeaderHelpDiv = document.querySelector(".chatHeaderHelp__wr");
      if (e.target === null || chatHeaderHelpDiv === null || isChatSearchBarOpen) return;
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
      <div className={`chat__headerWr ${isUserOnDarkMode && "dark-mode2"}`}>
        <IconButton onClick={() => {
          displayConvoForMobile("hide", () => history.push("/home"));
        }}>
          <KeyboardBackspaceRounded
            className={`${isUserOnDarkMode && "dark-mode-color3"}`}
          />
        </IconButton>
        <Avatar src={currentDisplayConvoInfo?.avi} onClick={() => {
          mobileDisplayConvoProfile("show", false);
          profile.open(false)
        }} />
        <div className="chat__headerInfo" onClick={() => {
          mobileDisplayConvoProfile("show", false);
          profile.open(false)
        }}>
          <h3>{currentDisplayConvoInfo?.name}</h3>
          <p>
            {
              isChatUserTyping ? "Typing..."
                : isChatUserOnline ? "Online"
                  : chatUserLastSeen ? `Last seen ${new Date(chatUserLastSeen.toDate()).toUTCString()}`
                    : "Offline"}

          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton onClick={chatHeaderSearchBar.open}>
            <SearchOutlined
              className={`${isUserOnDarkMode && "dark-mode-color3"}`}
            />
          </IconButton>
          <IconButton>
            <input
              onChange={uploadFile}
              type="file"
              className="chat__attachfile"
            />
            <AttachFile
              className={`${isUserOnDarkMode && "dark-mode-color3"}`}
            />
          </IconButton>
          <div className="chatHeaderHelp__wr">
            <IconButton onClick={chatHeaderHelp.open}>
              <MoreVert
                className={`${isUserOnDarkMode && "dark-mode-color3"}`}
              />
            </IconButton>
            <div className="chatHeaderHelp" id="chatHeaderHelp">
              <ul className={`${isUserOnDarkMode && "dark-mode1"}`}>
                <li onClick={() => {
                  mobileDisplayConvoProfile("show", false);
                  profile.open(false)
                }}
                >Contact Info
                </li>
                <li>Select Messages</li>
                <li
                  onClick={() => {
                    setOpenModal(true);
                    setModalType("MUTE__CONVO");
                    setIsRoom(false);
                    chatHeaderHelp.close();
                  }}
                >
                  Mute Notification
                </li>
                <li onClick={() => {
                  setOpenModal(true);
                  setModalType("CLEAR__MESSAGES");
                  setIsRoom(false);
                  chatHeaderHelp.close();
                }}>Clear Messages</li>
                <li onClick={() => {
                  setOpenModal(true);
                  setModalType("DELETE_CHAT");
                  setIsRoom(false);
                  chatHeaderHelp.close();
                }}
                >Delelct Chat</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={`chat__headerSearch ${isUserOnDarkMode && "dark-mode2"}`}>
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
          className={`searchIcon ${isUserOnDarkMode && "dark-mode-color3"}`}
          onClick={chatHeaderSearchBar.search}
        />
        <p onClick={chatHeaderSearchBar.close}>Cancel</p>
      </div>
    </section>
  );
}

export default React.memo(ChatHeader);
