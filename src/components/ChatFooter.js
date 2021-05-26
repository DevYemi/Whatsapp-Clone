import { IconButton } from '@material-ui/core'
import { ExpandLessRounded, ExpandMoreRounded, InsertEmoticon } from '@material-ui/icons'
import Picker from 'emoji-picker-react';
import React, { useState } from 'react'
import VoiceNoteRecoder from './VoiceNoteRecoder'

function ChatFooter(props) {
    const { showEmojis,currentDisplayConvoInfo, onEmojiClick, input,setFoundWordIndex, setInput,foundWordIndex, sendMessage, chatId, scrollChatBody, isChatSearchBarOpen, totalChatWordFound } = props
    const [vnIsRecoding, setVnIsRecoding] = useState(false); // keeps state if the user is currently recording a voice note
    const navigateToFoundWord = (key) => {
        let newIndex;
        switch (key) {
            case "PLUS":
                newIndex = foundWordIndex + 1
                if (newIndex > totalChatWordFound) return
                scrollChatBody.toSearchedMssg(newIndex,totalChatWordFound);
                setFoundWordIndex(newIndex);
                break;
            case "MINUS":
                newIndex = foundWordIndex - 1
                if (newIndex < 1) return
                scrollChatBody.toSearchedMssg(newIndex,totalChatWordFound);
                setFoundWordIndex(newIndex);
                break;

            default:
                break;
        }
    }


    if (isChatSearchBarOpen) {
        
        return (
            <section className="chat__footer searching">
                <div className="chat__footerSearchNav">
                    <IconButton onClick={() => navigateToFoundWord("MINUS")}>
                        <ExpandLessRounded />
                    </IconButton>
                    <IconButton onClick={() => navigateToFoundWord("PLUS")}>
                        <ExpandMoreRounded />
                    </IconButton>
                </div>
                <div className="chat__footerSearchDetails">
                    <span>{foundWordIndex} of {totalChatWordFound} matches</span>
                </div>
            </section>
        )
    } else {
        return (
            <section className="chat__footer">
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
                    convoId={chatId}
                    convoInfo={currentDisplayConvoInfo}
                    scrollChatBody={scrollChatBody}
                />
            </section>
        )
    }
}

export default React.memo(ChatFooter)
