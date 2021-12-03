import React, { useEffect, useState } from 'react'
import '../../styles/chat.css'
import { useParams } from 'react-router-dom';
import { useStateValue } from '../global-state-provider/StateProvider';
import { getIsConvoBlockedOnDb, getIsUserOnlineOnDb, getIsUserTypingFromDb, getMessgFromDb, getUserInfoFromDb, getUserLastSeenTime, resetRecieverMssgReadOnDb, setNewMessageToDb, uploadFileToDb } from '../backend/get&SetDataToDb';
import FilePreview from '../common/FilePreview';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { displayConvoForMobile } from '../utils/mobileScreenUtils';

function Chat(props) {
    const {
        setOpenModal,
        setModalType,
        setIsRoom,
        setIsUserProfileRoom,
        isChatSearchBarOpen,
        setIsAddChatFromRoomProfile,
        isChatBeingCleared,
        setImageFullScreen,
        setIsChatSearchBarOpen } = props

    const [fileOnPreview, setFileOnPreview] = useState(null); //keeps state for the current file on preview
    const [chatFirstRender, setChatFirstRender] = useState(false); // keeps state if chat is rendering for the first time
    const [isChatUserTyping, setIsChatUserTyping] = useState(false); // keeps state if the chat user is currently typing a message
    const [isFileOnPreview, setIsFileOnPreview] = useState(false); // keeps state if there currently a file on preview
    const [isFileTooBig, setIsFileTooBig] = useState(false); // keeps state if file picked is more than 15mb
    const [isFileSupported, setIsFileSupported] = useState(true) // keeps state if file picked is supported
    const [isFileOnPreviewLoading, setIsFileOnPreviewLoading] = useState(false) // keeps state if file on preview data is loading
    const [{ user, currentDisplayConvoInfo }, dispatch] = useStateValue(); // new logged in user and the currentDisplayConvoInfo
    const [messages, setMessages] = useState([]); // keeps state for the messages in a chat
    const [input, setInput] = useState(""); // keeps state for the inputed message by user
    const [totalChatWordFound, setTotalChatWordFound] = useState(0); // keeps state of total word found when a user search on the header search bar
    const [foundWordIndex, setFoundWordIndex] = useState(0); // keeps state of the current found word index
    const [isChatUserOnline, setIsChatUserOnline] = useState(false) // keeps state if the chat user is online
    const [chatUserLastSeen, setChatUserLastSeen] = useState() // keeps state pf last time chat user was online
    const { chatId } = useParams(); // id for the current room the user is on
    const sendMessage = (e, eventType, file) => { // sends new message to db
        e && e.preventDefault();
        let fileInput = document.querySelector(`.chat__headerRight input`);
        fileInput.value = ""
        setInput("");
        setIsFileTooBig(false)
        setIsFileSupported(true)
        setIsFileOnPreview(false);
        setFileOnPreview(null);
        if (input === "" && eventType === "text") return // return if the user is sending an empty message
        if (isFileTooBig) return // return if file is too big
        if (!isFileSupported) return // return if file is not supported
        if (eventType === "file") { // handle as file messaage if message contains files e.g image, audio, video
            setNewMessageToDb(chatId, input, user, scrollChatBody, false, file);
        } else if (eventType === "text") { // handle as text if message if just a text
            setNewMessageToDb(chatId, input, user, scrollChatBody, false, { type: "text", exten: ".txt" });
        }

    }
    const scrollChatBody = { // Scroll chat body 
        toEnd: function (isNotSmooth) {
            if (isChatSearchBarOpen) return
            let chatBody = document.querySelector(".chat__body");
            chatBody.style.scrollBehavior = isNotSmooth ? "initial" : "smooth"
            chatBody?.scrollTo(0, chatBody.offsetHeight * 100000000000);
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
        let file = e.target.files[0];
        if (!file) return
        if (file.size > 15731592) return setIsFileTooBig(true) // check if file is greater than 15mb
        const getFileType = (file) => { // get file type
            let fileType = file.type
            let arr = fileType.split("/")
            return {
                type: arr[0],
                exten: arr[1]
            }
        }
        let fileInfo = getFileType(file);
        if (fileInfo.type === "image" || fileInfo.type === "audio" || fileInfo.type === "video") {
            setIsFileOnPreviewLoading(true)
            uploadFileToDb(file, fileInfo, setFileOnPreview, setIsFileOnPreviewLoading);
        } else {
            setIsFileOnPreviewLoading(false)
            setIsFileSupported(false);
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

    useEffect(() => { // makes sure the chat start at the bottom when it renders and reset setIsAddChatFromRoomProfile to false
        setChatFirstRender(true);
        setIsAddChatFromRoomProfile(false);
        return () => setChatFirstRender(false);

    }, [setIsAddChatFromRoomProfile]);
    useEffect(() => {
        // checks the status of the chat user if user is online & get user last seen
        let unsubGetIsUserOnlineOnDb;
        let unsubGetUserLastSeenTime;
        if (chatId) {
            unsubGetIsUserOnlineOnDb = getIsUserOnlineOnDb(chatId, setIsChatUserOnline)
            unsubGetUserLastSeenTime = getUserLastSeenTime(chatId, setChatUserLastSeen)
        }
        return () => {
            unsubGetUserLastSeenTime && unsubGetUserLastSeenTime();
            unsubGetIsUserOnlineOnDb && unsubGetIsUserOnlineOnDb();
        }
    }, [chatId]);
    useEffect(() => { // map chat messages to global state currentDisplyedConvoMessages

        if (messages.length > 0) {
            dispatch({
                type: "SET_CURRENTDISPLAYEDCONVOMESSAGES",
                currentDisplayedConvoMessages: messages,
            });
        } else {
            dispatch({
                type: "SET_CURRENTDISPLAYEDCONVOMESSAGES",
                currentDisplayedConvoMessages: [],
            });
        }
        return () => dispatch({ type: "SET_CURRENTDISPLAYEDCONVOMESSAGES", currentDisplayedConvoMessages: [] });
    }, [messages, dispatch])
    useEffect(() => { // reset the user read value to true once a chat is opened
        resetRecieverMssgReadOnDb(user?.info.uid, chatId, true, false);
    }, [chatId, user?.info.uid])

    useEffect(() => {
        // gets if the chat user is currently typing on the db
        let unsubGetIsUserTypingFromDb;
        if (chatId) {
            unsubGetIsUserTypingFromDb = getIsUserTypingFromDb(user?.info?.uid, chatId, false, setIsChatUserTyping)
        }
        return () => unsubGetIsUserTypingFromDb && unsubGetIsUserTypingFromDb()
    }, [chatId, user])

    useEffect(() => {
        // on first render display the chat convo if the user is on a smaller screen
        // this is because the user has clicked on the chat on the sidebar
        if (chatId) {
            displayConvoForMobile("show");
        }
    }, [chatId])

    useEffect(() => { // gets currentDisplayConvoInfo, isConvoBlockedOnDb  and chatMessages on first render
        let unsubcribeMessages;
        let unsubcribeIsConvoBlockedOnDb;
        let unsubcribeGetUserInfoFromDb;
        setIsUserProfileRoom(false);
        if (chatId) {
            unsubcribeGetUserInfoFromDb = getUserInfoFromDb(chatId, dispatch, true);
            unsubcribeMessages = getMessgFromDb(user?.info?.uid, chatId, false, "asc", setMessages, false);
            unsubcribeIsConvoBlockedOnDb = getIsConvoBlockedOnDb(user?.info.uid, chatId, dispatch);
        }
        return () => { unsubcribeMessages(); unsubcribeIsConvoBlockedOnDb(); unsubcribeGetUserInfoFromDb(); }
    }, [chatId, user?.info.uid, setIsUserProfileRoom, dispatch]);
    if (chatFirstRender) scrollChatBody.toEnd(true) // scroll chat body to bottom if chat is rendering for the first time
    return (
        <div className="chat convo">
            <ChatHeader
                chatId={chatId}
                currentDisplayConvoInfo={currentDisplayConvoInfo}
                setMessages={setMessages}
                setIsChatSearchBarOpen={setIsChatSearchBarOpen}
                uploadFile={uploadFile}
                setFoundWordIndex={setFoundWordIndex}
                setTotalChatWordFound={setTotalChatWordFound}
                setOpenModal={setOpenModal}
                setModalType={setModalType}
                setIsRoom={setIsRoom}
                isChatSearchBarOpen={isChatSearchBarOpen}
                isChatUserOnline={isChatUserOnline}
                chatUserLastSeen={chatUserLastSeen}
                isChatUserTyping={isChatUserTyping}
            />
            <ChatBody
                messages={messages}
                setImageFullScreen={setImageFullScreen}
                isChatBeingCleared={isChatBeingCleared}
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
                isRoom={false}
                isFileTooBig={isFileTooBig}
                setIsFileTooBig={setIsFileTooBig}
                isFileSupported={isFileSupported}
                setIsFileSupported={setIsFileSupported}
                isFileOnPreviewLoading={isFileOnPreviewLoading}
                setIsFileOnPreviewLoading={setIsFileOnPreviewLoading}
            />
        </div>
    )
}

export default React.memo(Chat)
