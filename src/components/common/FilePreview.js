import { IconButton } from '@material-ui/core';
import { CloseRounded, InsertEmoticon, Send } from '@material-ui/icons';
import Picker from 'emoji-picker-react';
import gsap from 'gsap/all';
import React, { useEffect } from 'react'
import '../../styles/filePreview.css'
import FilePreviewFileType from './FilePreviewFileType';
import Loading from './Loading';

function FilePreview(props) {
    const {
        showEmojis,
        isFileOnPreview,
        setFileOnPreview,
        input,
        fileOnPreview,
        sendMessage,
        setInput,
        onEmojiClick,
        setIsFileOnPreview,
        isFileSupported,
        setIsFileSupported,
        isFileTooBig,
        setIsFileTooBig,
        setIsFileOnPreviewLoading,
        isFileOnPreviewLoading,
        isRoom } = props

    const closeFilePreview = async () => { // Closes file on preview
        let done = await filePreviewAnimation.close();
        if (done) {
            let fileInput = document.querySelector(`.${isRoom ? "room" : "chat"}__headerRight input`);
            fileInput.value = ""
            setInput("")
            setIsFileOnPreview(false);
            setIsFileOnPreviewLoading(false);
            setIsFileSupported(true);
            setIsFileTooBig(false);
            setFileOnPreview(null);
        }

    }
    const sendFileOnPreview = async (e) => {
        e.preventDefault();
        if (isFileOnPreviewLoading) return;
        let done = await filePreviewAnimation.close();
        if (fileOnPreview && done) {
            sendMessage(null, "file", fileOnPreview);
        }
    }
    const filePreviewAnimation = {
        open: function () {
            if (isFileOnPreview) {
                gsap.to(`.${isRoom ? "room" : "chat"}__filePreview`, {
                    ease: "power4.in",
                    duration: 0.5,
                    display: "block",
                    top: 0,
                })
            }
        },
        close: function () {
            return new Promise((resolve) => {
                gsap.to(`.${isRoom ? "room" : "chat"}__filePreview`, {
                    duration: .1,
                    display: "block",
                    top: "110%",
                    onComplete: () => { resolve(true); console.log(isFileOnPreview) }
                })
            })
        }
    }
    useEffect(() => {
        // open filePreviewAnimation
        if (isFileOnPreview) {
            gsap.to(`.${isRoom ? "room" : "chat"}__filePreview`, {
                ease: "power4.in",
                duration: 0.5,
                display: "block",
                top: 0,
            })
        }
    }, [isFileOnPreview, isRoom])
    return (
        <section className={`${isRoom ? "room" : "chat"}__filePreview ${isFileOnPreview && "show"}`} >
            <div className={`filePreview_wr`}>
                <div className="filePreviewHeader">
                    <IconButton onClick={closeFilePreview}>
                        <CloseRounded />
                    </IconButton>
                </div>
                <div className="filePreviewType">
                    {!isFileOnPreviewLoading ? <FilePreviewFileType
                        isFileSupported={isFileSupported}
                        isFileTooBig={isFileTooBig}
                        fileOnPreview={fileOnPreview} />
                        : <Loading size={50} type={'ThreeDots'} visible={fileOnPreview ? "Hide" : "Show"} color={"#00BFFF"} class={"filePreviewType__loading"} />}
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
                        <button onClick={sendFileOnPreview} type="submit">Send a message</button>
                    </form>
                    <IconButton onClick={sendFileOnPreview}>
                        <Send />
                    </IconButton>
                </div>
            </div>
        </section>
    )
}

export default React.memo(FilePreview)
