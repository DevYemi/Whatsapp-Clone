import { CloseRounded } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import '../styles/chat.css'
import { useParams } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { getMessgFromDb, getUserInfoFromDb, resetRecieverMssgReadOnDb, setNewMessageToDb, uploadFileToDb } from './get&SetDataToDb';
import FilePreview from './FilePreview';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { IconButton } from '@material-ui/core';

function Chat(props) {
    const {setOpenModal, setModalType, setIsRoom,setIsUserProfileRoom} = props
    const [fileOnPreview, setFileOnPreview] = useState(null); //keeps state for the current file on preview
    const [isFileOnPreview, setIsFileOnPreview] = useState(false); // keeps state if there currently a file on preview
    const [imageFullScreen, setImageFullScreen] = useState({ isFullScreen: false }); // keeps state if there currently an image on fullScreen and also keeps details of the image if it is
    const [{ user,currentDisplayConvoInfo }, dispatch] = useStateValue(); // new logged in user and the currentDisplayConvoInfo
    const [messages, setMessages] = useState([]); // keeps state for the messages in a chat
    const [isChatSearchBarOpen, setIsChatSearchBarOpen] = useState(false) // keeps state if the chatheader search bar is open
    const [input, setInput] = useState(""); // keeps state for the inputed message by user
    const [totalChatWordFound, setTotalChatWordFound] = useState(0); // keeps state of total word found when a user search on the header search bar
    const [foundWordIndex, setFoundWordIndex] = useState(0); // keeps state of the current found word index
    const { chatId } = useParams(); // id for the current room the user is on
    console.log("chat rendring")
    const sendMessage = (e, eventType, file) => { // sends new message to db
        e && e.preventDefault();
        if (input === "" && eventType === "text") return // return if the user is sending an empty message
        if (eventType === "file") { // handle as file messaage if message contains files e.g image, audio, video
            setNewMessageToDb(chatId, input, user, scrollChatBody,false, file);
        } else if (eventType === "text") { // handle as text if message if just a text
            setNewMessageToDb(chatId, input, user, scrollChatBody,false, { type: "text", exten: ".txt" });
        }
        setInput("");
        setIsFileOnPreview(false);
        setFileOnPreview(null);

    }
    const scrollChatBody = { // Scroll chat body 
        toEnd: function () {
            let chatBody = document.querySelector(".chat__body");
            chatBody.style.scrollBehavior = "smooth"
            chatBody?.scrollTo(0, chatBody.offsetHeight * 10000);
        },
        toSearchedMssg: function (index, limit) {
            if (index > limit) return
            let chatBody = document.querySelector(".chat__body");
            chatBody.style.scrollBehavior = "smooth"
            let foundWord = document.querySelector(`#mssg${index}`);
            foundWord && foundWord.scrollIntoView();
        }
    }
    const uploadFile = (e) => { // send selected file storage
        setIsFileOnPreview(true);
        const getFileType = (file) => {
            let fileType = file.type
            let arr = fileType.split("/")
            return {
                type: arr[0],
                exten: arr[1]
            }
        }
        if (e.target.files[0]) {
            let file = e.target.files[0]
            let fileInfo = getFileType(file);
            uploadFileToDb(file, fileInfo, setFileOnPreview);
        }

    }
    const onEmojiClick = (e, emojiObj) => { // gets the selected emoji from user
        setInput(input + emojiObj.emoji);
    }
    const showEmojis = (e, userTyping, location) => { // show emojis when a user clicks on emoji icon

        let emojis = document.querySelector(`.${location} > .emoji-picker-react`);
        if (userTyping) {
            emojis.style.display = "none"
        } else {
            let currentDisplayStatus = emojis.style.display
            if (currentDisplayStatus === "none" || currentDisplayStatus === "") {
                emojis.style.display = "flex"
            } else {
                emojis.style.display = "none"
            }
        }
    }

    const closeImageOnFullScreen = () => { // close image on full when a user clicks the cancel icon
        setImageFullScreen({ isFullScreen: false });
    }
    useEffect(() => { // makes sure the chat start at the bottom when it renders
        if (messages) {
            let chatBody = document.querySelector(".chat__body");
            chatBody.style.scrollBehavior = "initial"
            chatBody?.scrollTo(0, chatBody.offsetHeight * 500000);
        }
    }, [messages])
    useEffect(()=>{ // reset the user read value to true once a chat is opened
        resetRecieverMssgReadOnDb(chatId,user?.info.uid, true)
    },[chatId,user?.info.uid])

    useEffect(() => { // gets currentDisplayConvoInfo and chatMessages on first render
        let unsubcribeMessages;
        setIsUserProfileRoom(false);
        if (chatId) {
            getUserInfoFromDb(chatId, dispatch, true);
            unsubcribeMessages = getMessgFromDb(user?.info.uid,chatId,false, "asc", setMessages, false);
        }
        return () => {unsubcribeMessages(); }
    }, [chatId,user?.info.uid,setIsUserProfileRoom, dispatch]);

    return (
        <div className="chat convo">
            <ChatHeader
                chatId={chatId}
                currentDisplayConvoInfo={currentDisplayConvoInfo}
                messages={messages}
                setMessages={setMessages}
                setIsChatSearchBarOpen={setIsChatSearchBarOpen}
                uploadFile={uploadFile}
                setFoundWordIndex={setFoundWordIndex}
                setTotalChatWordFound={setTotalChatWordFound}
                setOpenModal={setOpenModal}
                setModalType={setModalType} 
                setIsRoom={setIsRoom}
            />
            <ChatBody
                messages={messages}
                setImageFullScreen={setImageFullScreen}
            />
            <ChatFooter
                showEmojis={showEmojis}
                currentDisplayConvoInfo={currentDisplayConvoInfo}
                totalChatWordFound={totalChatWordFound}
                onEmojiClick={onEmojiClick}
                input={input}
                foundWordIndex={foundWordIndex}
                isChatSearchBarOpen={isChatSearchBarOpen}
                setInput={setInput}
                sendMessage={sendMessage}
                setFoundWordIndex={setFoundWordIndex}
                chatId={chatId}
                scrollChatBody={scrollChatBody}
            />

            <FilePreview
                isFileOnPreview={isFileOnPreview}
                setFileOnPreview={setFileOnPreview}
                setIsFileOnPreview={setIsFileOnPreview}
                fileOnPreview={fileOnPreview}
                showEmojis={showEmojis}
                input={input}
                onEmojiClick={onEmojiClick}
                sendMessage={sendMessage}
                setInput={setInput}
            />
            <section className={`chat__imageFullScreen ${imageFullScreen.isFullScreen && "show"}`}>
                <div className={`chat__imageFullScreen_wr`}>
                    <IconButton onClick={closeImageOnFullScreen}>
                        <CloseRounded />
                    </IconButton>
                    <div className="chat__imageFullScreenDivWrap">
                        <img src={imageFullScreen.url} alt="" />
                        <span className="chat__imageFullScreenCaption">{imageFullScreen.caption}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default React.memo(Chat)
