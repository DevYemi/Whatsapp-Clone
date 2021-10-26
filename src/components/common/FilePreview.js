import { IconButton } from '@material-ui/core';
import { CloseRounded, InsertEmoticon, Send } from '@material-ui/icons';
import Picker from 'emoji-picker-react';
import React from 'react'
import '../../styles/filePreview.css'
import FilePreviewFileType from './FilePreviewFileType';
import Loading from './Loading';

function FilePreview(props) {
    const { showEmojis, isFileOnPreview, setFileOnPreview, input, fileOnPreview, sendMessage, setInput, onEmojiClick, setIsFileOnPreview } = props
    const closeFilePreview = () => { // Closes file on preview
        let fileInput = document.querySelector(".chat__headerRight input");
        fileInput.value = ""
        setIsFileOnPreview(false)
        setFileOnPreview(null);
    }
    return (
        <section className={`chat__filePreview ${isFileOnPreview && "show"}`} >
            <div className={`filePreview_wr`}>
                <div className="filePreviewHeader">
                    <IconButton onClick={closeFilePreview}>
                        <CloseRounded />
                    </IconButton>
                </div>
                <div className="filePreviewType">
                    {fileOnPreview ? <FilePreviewFileType fileOnPreview={fileOnPreview} /> : <Loading size={50} visible={fileOnPreview ? "Hide" : "Show"} color={"#00BFFF"} class={"filePreviewType__loading"} />}
                </div>
                <div className="filePreviewFooter">
                    <div className="filePreviewFooterEmoji">
                        <IconButton onClick={(e) => showEmojis(e, false, "filePreviewFooterEmoji")}>
                            <InsertEmoticon />
                        </IconButton>
                        <Picker className="hide" onEmojiClick={onEmojiClick} />
                    </div>
                    <form action="">
                        <input value={input} type="text"
                            onChange={e => setInput(e.target.value)}
                            onFocus={e => showEmojis(e, true, "filePreviewFooterEmoji")}
                            placeholder="Add a input...." />
                        <button onClick={() => sendMessage(null, "file", fileOnPreview)} type="submit">Send a message</button>
                    </form>
                    <IconButton onClick={() => sendMessage(null, "file", fileOnPreview)}>
                        <Send />
                    </IconButton>
                </div>
            </div>
        </section>
    )
}

export default React.memo(FilePreview)
