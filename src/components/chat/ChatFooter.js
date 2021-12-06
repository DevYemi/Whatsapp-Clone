import { IconButton } from "@material-ui/core";
import {
  ExpandLessRounded,
  ExpandMoreRounded,
  InsertEmoticon,
  Send,
} from "@material-ui/icons";
import Picker from "emoji-picker-react";
import React, { useState } from "react";
import { useStateValue } from "../global-state-provider/StateProvider";
import VoiceNoteRecoder from "../common/VoiceNoteRecoder";
import { resetIsUserTypingOnDb } from "../backend/get&SetDataToDb";

function ChatFooter(props) {
  const {
    showEmojis,
    currentDisplayConvoInfo,
    onEmojiClick,
    input,
    setFoundWordIndex,
    setInput,
    foundWordIndex,
    sendMessage,
    chatId,
    scrollChatBody,
    isChatSearchBarOpen,
    totalChatWordFound,
  } = props;
  const [vnIsRecoding, setVnIsRecoding] = useState(false); // keeps state if the user is currently recording a voice note
  const [{ user, isCurrentConvoBlocked, isUserOnDarkMode }] = useStateValue();
  const navigateToFoundWord = (key) => {
    let newIndex;
    switch (key) {
      case "PLUS":
        newIndex = foundWordIndex + 1;
        if (newIndex > totalChatWordFound) return;
        scrollChatBody.toSearchedMssg(newIndex, totalChatWordFound);
        setFoundWordIndex(newIndex);
        break;
      case "MINUS":
        newIndex = foundWordIndex - 1;
        if (newIndex < 1) return;
        scrollChatBody.toSearchedMssg(newIndex, totalChatWordFound);
        setFoundWordIndex(newIndex);
        break;

      default:
        break;
    }
  };

  if (isChatSearchBarOpen) {
    return (
      <section className={`chat__footer searching ${isUserOnDarkMode && "dark-mode1"}`}>
        <div className="chat__footerSearchNav">
          <IconButton onClick={() => navigateToFoundWord("MINUS")}>
            <ExpandLessRounded />
          </IconButton>
          <IconButton onClick={() => navigateToFoundWord("PLUS")}>
            <ExpandMoreRounded />
          </IconButton>
        </div>
        <div className="chat__footerSearchDetails">
          <span>
            {foundWordIndex} of {totalChatWordFound} matches
          </span>
        </div>
      </section>
    );
  } else if (isCurrentConvoBlocked && isCurrentConvoBlocked !== "") { // checks if the curren convo has been blocked
    if (isCurrentConvoBlocked === user?.info?.uid) {
      // if it was the current logged in user that blocked the convo
      return (
        <div className={`chat__footer blocked ${isUserOnDarkMode && "dark-mode2"}`}>
          <p>You can't send message to a Blocked contact</p>
        </div>
      );
    } else {
      //else it is the other  user that bloked the convo
      return (
        <div className="chat__footer blocked">
          <p>You have been Blocked by this user</p>
        </div>
      );
    }
  } else {
    return (
      <section className={`chat__footer ${isUserOnDarkMode && "dark-mode2"}`}>
        <div className={`footer__emoji ${vnIsRecoding && "hide"}`}>

          <InsertEmoticon
            onClick={(e) => showEmojis(e, false, "footer__emoji")}
            className={`footer__emojiIcon ${isUserOnDarkMode && "dark-mode-color3"}`}
          />

          <Picker className="hide" onEmojiClick={onEmojiClick} />
        </div>
        <form className={vnIsRecoding ? "hide" : ""} action="">
          <input
            value={input}
            type="text"
            className={`${isUserOnDarkMode && "dark-mode1"}`}
            onChange={(e) => setInput(e.target.value)}
            onFocus={(e) => {
              resetIsUserTypingOnDb(user.info.uid, chatId, false, true)
              showEmojis(e, true, "footer__emoji");
            }}
            onBlur={() => resetIsUserTypingOnDb(user.info.uid, chatId, false, false)}
            placeholder="Type a message"
          />
          <button onClick={(e) => sendMessage(e, "text")} type="submit">
            Send a message
          </button>
        </form>
        <VoiceNoteRecoder
          vnIsRecoding={vnIsRecoding}
          setVnIsRecoding={setVnIsRecoding}
          convoId={chatId}
          convoInfo={currentDisplayConvoInfo}
          scrollConvoBody={scrollChatBody}
        />

        {!vnIsRecoding && <Send
          onClick={(e) => sendMessage(e, "text")}
          className="chat_footerSendIcon" />}

      </section>
    );
  }
}

export default React.memo(ChatFooter);
