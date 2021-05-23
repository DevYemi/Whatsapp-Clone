import { IconButton } from '@material-ui/core'
import { ExpandLessRounded, ExpandMoreRounded, InsertEmoticon } from '@material-ui/icons'
import Picker from 'emoji-picker-react';
import React, { useState } from 'react'
import VoiceNoteRecoder from './VoiceNoteRecoder'

function RoomFooter(props) {
    const { showEmojis,roomInfo, onEmojiClick, input,setFoundWordIndex, setInput,foundWordIndex, sendMessage, roomId, scrollroomBody, isroomSearchBarOpen, totalroomWordFound } = props
    const [vnIsRecoding, setVnIsRecoding] = useState(false); // keeps state if the user is currently recording a voice note
    const navigateToFoundWord = (key) => {
        let newIndex;
        switch (key) {
            case "PLUS":
                newIndex = foundWordIndex + 1
                if (newIndex > totalroomWordFound) return
                scrollroomBody.toSearchedMssg(newIndex,totalroomWordFound);
                setFoundWordIndex(newIndex);
                break;
            case "MINUS":
                newIndex = foundWordIndex - 1
                if (newIndex < 1) return
                scrollroomBody.toSearchedMssg(newIndex,totalroomWordFound);
                setFoundWordIndex(newIndex);
                break;

            default:
                break;
        }
    }


    if (isroomSearchBarOpen) {
        
        return (
            <section className="room__footer searching">
                <div className="room__footerSearchNav">
                    <IconButton onClick={() => navigateToFoundWord("MINUS")}>
                        <ExpandLessRounded />
                    </IconButton>
                    <IconButton onClick={() => navigateToFoundWord("PLUS")}>
                        <ExpandMoreRounded />
                    </IconButton>
                </div>
                <div className="room__footerSearchDetails">
                    <span>{foundWordIndex} of {totalroomWordFound} matches</span>
                </div>
            </section>
        )
    } else {
        return (
            <section className="room__footer">
                <div className={`footer__emoji ${vnIsRecoding && "hide"}`}>
                    <IconButton onClick={(e) => showEmojis(e, false, "footer__emoji")}>
                        <InsertEmoticon />
                    </IconButton>
                    <Picker className="hide" onEmojiClick={onEmojiClick} />
                </div>
                <form className={vnIsRecoding ? "hide" : ""} action="">
                    <input value={input} type="text"
                        onChange={e => setInput(e.target.value)}
                        onFocus={e => showEmojis(e, true, "footer__emoji")}
                        placeholder="Type a message" />
                    <button onClick={(e) => sendMessage(e, "text")} type="submit">Send a message</button>
                </form>
                <VoiceNoteRecoder
                    vnIsRecoding={vnIsRecoding}
                    setVnIsRecoding={setVnIsRecoding}
                    convoId={roomId}
                    convoInfo={roomInfo}
                    scrollroomBody={scrollroomBody}
                />
            </section>
        )
    }
}

export default React.memo(RoomFooter)
