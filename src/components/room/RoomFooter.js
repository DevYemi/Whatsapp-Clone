import { IconButton } from '@material-ui/core'
import { ExpandLessRounded, ExpandMoreRounded, InsertEmoticon, Send } from '@material-ui/icons'
import Picker from 'emoji-picker-react';
import React, { useState } from 'react'
import { resetIsUserTypingOnDb } from '../backend/get&SetDataToDb';
import VoiceNoteRecoder from '../common/VoiceNoteRecoder'
import { useStateValue } from '../global-state-provider/StateProvider';

function RoomFooter(props) {
    const {
        showEmojis,
        onEmojiClick,
        input,
        setFoundWordIndex,
        setInput,
        foundWordIndex,
        sendMessage,
        roomId,
        scrollRoomBody,
        isRoomSearchBarOpen,
        totalRoomWordFound } = props
    const [vnIsRecoding, setVnIsRecoding] = useState(false); // keeps state if the user is currently recording a voice note
    const [{ user, isUserOnDarkMode }] = useStateValue();
    const navigateToFoundWord = (key) => {
        let newIndex;
        switch (key) {
            case "PLUS":
                newIndex = foundWordIndex + 1
                if (newIndex > totalRoomWordFound) return
                scrollRoomBody.toSearchedMssg(newIndex, totalRoomWordFound);
                setFoundWordIndex(newIndex);
                break;
            case "MINUS":
                newIndex = foundWordIndex - 1
                if (newIndex < 1) return
                scrollRoomBody.toSearchedMssg(newIndex, totalRoomWordFound);
                setFoundWordIndex(newIndex);
                break;

            default:
                break;
        }
    }
    if (isRoomSearchBarOpen) {

        return (
            <section className={`room__footer searching ${isUserOnDarkMode && "dark-mode1"}`}>
                <div className="room__footerSearchNav">
                    <IconButton onClick={() => navigateToFoundWord("MINUS")}>
                        <ExpandLessRounded />
                    </IconButton>
                    <IconButton onClick={() => navigateToFoundWord("PLUS")}>
                        <ExpandMoreRounded />
                    </IconButton>
                </div>
                <div className="room__footerSearchDetails">
                    <span>{foundWordIndex} of {totalRoomWordFound} matches</span>
                </div>
            </section>
        )
    } else {
        return (
            <section className={`room__footer ${isUserOnDarkMode && "dark-mode2"}`}>
                <div className={`footer__emoji ${vnIsRecoding && "hide"}`}>
                    <InsertEmoticon
                        onClick={(e) => showEmojis(e, false, "footer__emoji")}
                        className={` footer__emojiIcon ${isUserOnDarkMode && "dark-mode-color3"}`} />
                    <Picker className="hide" onEmojiClick={onEmojiClick} />
                </div>
                <form className={vnIsRecoding ? "hide" : ""} action="">
                    <input
                        value={input}
                        type="text"
                        className={`${isUserOnDarkMode && "dark-mode1"}`}
                        onChange={e => setInput(e.target.value)}
                        onFocus={e => {
                            resetIsUserTypingOnDb(user?.info?.uid, roomId, true, true)
                            showEmojis(e, true, "footer__emoji")
                        }}
                        onBlur={() => resetIsUserTypingOnDb(user?.info?.uid, roomId, true, false)}
                        placeholder="Type a message" />
                    <button onClick={(e) => sendMessage(e, "text")} type="submit">Send a message</button>
                </form>
                <VoiceNoteRecoder
                    vnIsRecoding={vnIsRecoding}
                    setVnIsRecoding={setVnIsRecoding}
                    convoId={roomId}
                    scrollConvoBody={scrollRoomBody}
                />
                {!vnIsRecoding && <Send
                    onClick={(e) => sendMessage(e, "text")}
                    className="room_footerSendIcon" />}
            </section>
        )
    }
}

export default React.memo(RoomFooter)
