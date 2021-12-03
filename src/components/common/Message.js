import { Avatar } from "@material-ui/core";
import { Mic, ArrowDropDownRounded, Check } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import "../../styles/message.css";
import { getIfMessageHasBeenReadFromDb } from "../backend/get&SetDataToDb";
import { useStateValue } from "../global-state-provider/StateProvider";
import { openImageFullScreen } from "../utils/imageFullScreenUtils";

function Message({ convo, setImageFullScreen }) {
  const { message, name, fileType, timestamp, senderId, receiverId, id } = convo;
  const [{ user, currentDisplayedConvoMessages, isUserOnDarkMode }] = useStateValue();
  const [isRead, setIsRead] = useState(false); //keeps state if this message has been read

  useEffect(() => { // checks if receiver has seen or read this message
    let unsubGetIfMessageHasBeenReadFromDb;
    if (senderId && receiverId && id) {
      unsubGetIfMessageHasBeenReadFromDb = getIfMessageHasBeenReadFromDb(receiverId, senderId, id, setIsRead)
    }
    return () => unsubGetIfMessageHasBeenReadFromDb && unsubGetIfMessageHasBeenReadFromDb();
  }, [senderId, receiverId, id])
  if (currentDisplayedConvoMessages.length === 0) {
    return (
      <></>
    )
  }
  else if (fileType?.type === "text") {
    return (
      <div className={`message ${isUserOnDarkMode && "dark-mode-color2"}`}>
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className={`message__name  ${isUserOnDarkMode && "dark-mode-color1"}  `}>
            {(user?.info.uid === senderId) ? "" : name}
          </span>
          <div
            className={`message__text ${user?.info.uid === senderId && "message__sender"
              }`}
          >
            <span className="message__name user">
              {user?.info.uid === senderId ? "You" : ""}
            </span>
            <p dangerouslySetInnerHTML={{ __html: message }}></p>
            <div className="message__timeStamp">
              <span>
                {new Date(timestamp?.toDate()).toUTCString()}
              </span>
              <div className={`message__check ${isRead && "read"}`}>
                <Check />
                <Check />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "image") {
    return (
      <div className={`message ${isUserOnDarkMode && "dark-mode-color2"}`}>
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className={`message__name  ${isUserOnDarkMode && "dark-mode-color1"}  `}>
            {user?.info.uid === senderId ? "" : name}
          </span>
          <div
            className={`message__image ${user?.info.uid === senderId && "message__sender"
              }`}
          >
            <span className="message__name user">
              {user?.info.uid === senderId ? "You" : ""}
            </span>
            <div onClick={() => openImageFullScreen(setImageFullScreen, fileType?.url, message)}>
              <img src={fileType?.url} alt="" />
            </div>
            <p
              dangerouslySetInnerHTML={{ __html: message }}
              className="message__caption"
            ></p>
            <div className="message__timeStamp">
              <span>
                {new Date(timestamp?.toDate()).toUTCString()}
              </span>
              <div className={`message__check ${isRead && "read"}`}>
                <Check />
                <Check />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "audio") {
    return (
      <div className={`message ${isUserOnDarkMode && "dark-mode-color2"}`}>
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className={`message__name  ${isUserOnDarkMode && "dark-mode-color1"}  `}>
            {user?.info.uid === senderId ? "" : name}
          </span>
          <div
            className={`message__audio ${user?.info.uid === senderId && "message__sender"
              }`}
          >
            <span className="message__name user">
              {user?.info.uid === senderId ? "You" : ""}
            </span>
            <audio controls src={fileType?.url}></audio>
            <p
              dangerouslySetInnerHTML={{ __html: message }}
              className="message__caption"
            ></p>
            <div className="message__timeStamp">
              <span>
                {new Date(timestamp?.toDate()).toUTCString()}
              </span>
              <div className={`message__check ${isRead && "read"}`}>
                <Check />
                <Check />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "video") {
    return (
      <div className={`message ${isUserOnDarkMode && "dark-mode-color2"}`}>
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className={`message__name  ${isUserOnDarkMode && "dark-mode-color1"}  `}>
            {user?.info.uid === senderId ? "" : name}
          </span>
          <div
            className={`message__video ${user?.info.uid === senderId && "message__sender"
              }`}
          >
            <span className="message__name user">
              {user?.info.uid === senderId ? "You" : ""}
            </span>
            <video controls src={fileType?.url} />
            <p
              dangerouslySetInnerHTML={{ __html: message }}
              className="message__caption"
            ></p>
            <div className="message__timeStamp">
              <span>
                {new Date(timestamp?.toDate()).toUTCString()}
              </span>
              <div className={`message__check ${isRead && "read"}`}>
                <Check />
                <Check />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "voice-note") {
    return (
      <div className={`message ${isUserOnDarkMode && "dark-mode-color2"}`}>
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className={`message__name  ${isUserOnDarkMode && "dark-mode-color1"}  `}>
            {user?.info.uid === senderId ? "" : name}
          </span>
          <div
            className={`message__VN_wr ${user?.info.uid === senderId && "message__sender"
              } `}
          >
            <span className="message__name user">
              {user?.info.uid === senderId ? "You" : ""}
            </span>
            <div className="message__VN">
              <div className="message__VN_wrap1">
                <Avatar src={fileType?.info?.avi} />
                <Mic />
              </div>
              <audio controls src={fileType?.url}></audio>
            </div>
            <div className="message__timeStamp">
              <span>
                {new Date(timestamp?.toDate()).toUTCString()}
              </span>
              <div className={`message__check ${isRead && "read"}`}>
                <Check />
                <Check />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Im a bug</p>;
  }
}

export default React.memo(Message);
