import { Avatar } from "@material-ui/core";
import { Mic, ArrowDropDownRounded } from "@material-ui/icons";
import React from "react";
import "../../styles/message.css";
import { useStateValue } from "../global-state-provider/StateProvider";

function Message({ convo, setImageFullScreen }) {
  const { message, name, fileType, timestamp, senderId } = convo;
  const [{ user }] = useStateValue();
  const openImageFullScreen = () => {
    // Open image on full screen when a user clicks on a message
    setImageFullScreen({
      isFullScreen: true,
      url: fileType?.url,
      caption: message ? message : "",
    });
  };

  if (fileType?.type === "text") {
    return (
      <div className="message">
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className="message__name">
            {user?.info.uid === senderId ? "" : name}
          </span>
          <div
            className={`message__text ${user?.info.uid === senderId && "message__sender"
              }`}
          >
            <span className="message__name user">
              {user?.info.uid === senderId ? "You" : ""}
            </span>
            <p dangerouslySetInnerHTML={{ __html: message }}></p>
            <span className="message__timeStamp">
              {new Date(timestamp?.toDate()).toUTCString()}
            </span>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "image") {
    return (
      <div className="message">
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className="message__name">
            {user?.info.uid === senderId ? "" : name}
          </span>
          <div
            className={`message__image ${user?.info.uid === senderId && "message__sender"
              }`}
          >
            <span className="message__name user">
              {user?.info.uid === senderId ? "You" : ""}
            </span>
            <div onClick={openImageFullScreen}>
              <img src={fileType?.url} alt="" />
            </div>
            <p
              dangerouslySetInnerHTML={{ __html: message }}
              className="message__caption"
            ></p>
            <span className="message__timeStamp">
              {new Date(timestamp?.toDate()).toUTCString()}
            </span>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "audio") {
    return (
      <div className="message">
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className="message__name">
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
            <span className="message__timeStamp">
              {new Date(timestamp?.toDate()).toUTCString()}
            </span>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "video") {
    return (
      <div className="message">
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className="message__name">
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
            <span className="message__timeStamp">
              {new Date(timestamp?.toDate()).toUTCString()}
            </span>
          </div>
        </div>
      </div>
    );
  } else if (fileType?.info?.type === "voice-note") {
    return (
      <div className="message">
        <ArrowDropDownRounded className={`${user?.info.uid === senderId ? "sender" : "receiver"
          }`} />
        <div className="message-wr">
          <span className="message__name">
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
            <span className="message__timeStamp">
              {new Date(timestamp?.toDate()).toUTCString()}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Im a bug</p>;
  }
}

export default React.memo(Message);
