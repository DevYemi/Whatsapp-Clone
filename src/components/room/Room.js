import { CloseRounded } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import '../../styles/room.css'
import { useParams } from 'react-router-dom';
import { useStateValue } from '../global-state-provider/StateProvider';
import { getRoomInfoFromDb, getMessgFromDb, setNewMessageToDb, uploadFileToDb, resetRecieverMssgReadOnDb, getGroupMemberFromDb, resetUserRoomOnScreenInDb } from '../backend/get&SetDataToDb';
import FilePreview from '../common/FilePreview';
import RoomHeader from './RoomHeader';
import RoomBody from './RoomBody';
import RoomFooter from './RoomFooter';
import { IconButton } from '@material-ui/core';

function Room(props) {
    const {
        setOpenModal,
        setModalType,
        setIsRoom,
        isRoomSearchBarOpen,
        setIsRoomSearchBarOpen,
        setIsUserProfileRoom } = props
    const [seed, setSeed] = useState(""); // keeps state get new id for every new group
    const [roomFirstRender, setRoomFirstRender] = useState(false); // keeps state if room is rendering for the first time
    const [fileOnPreview, setFileOnPreview] = useState(null); //keeps state for the current file on preview
    const [isFileOnPreview, setIsFileOnPreview] = useState(false); // keeps state if there currently a file on preview
    const [isFileTooBig, setIsFileTooBig] = useState(false); // keeps state if file picked is more than 15mb
    const [isFileSupported, setIsFileSupported] = useState(true) // keeps state if file picked is supported
    const [isFileOnPreviewLoading, setIsFileOnPreviewLoading] = useState(false) // keeps state if file on preview data is loading
    const [imageFullScreen, setImageFullScreen] = useState({ isFullScreen: false }); // keeps state if there currently an image on fullScreen and also keeps details of the image if it is
    const [{ user }, dispatch] = useStateValue(); // new logged in user
    const [messages, setMessages] = useState([]); // keeps state for the messages in a room
    const [input, setInput] = useState(""); // keeps state for the inputed message by user
    const [totalRoomWordFound, setTotalRoomWordFound] = useState(0); // keeps state of total word found when a user search on the header search bar
    const [foundWordIndex, setFoundWordIndex] = useState(0); // keeps state of the current found word index
    const [roomMembers, setRoomMembers] = useState([])
    const { roomId } = useParams(); // id for the current room the user is on

    const sendMessage = (e, eventType, file) => { // sends new message to db
        e && e.preventDefault();
        if (input === "" && eventType === "text") return // return if the user is sending an empty message
        if (eventType === "file") { // handle as file messaage if message contains files e.g image, audio, video
            setNewMessageToDb(roomId, input, user, scrollRoomBody, true, file);
        } else if (eventType === "text") { // handle as text if message if just a text
            setNewMessageToDb(roomId, input, user, scrollRoomBody, true, { type: "text", exten: ".txt" });
        }
        setInput("");
        setIsFileOnPreview(false);
        setFileOnPreview(null);

    }
    const scrollRoomBody = { // Scroll room body 
        toEnd: function (isNotSmooth) {
            if (isRoomSearchBarOpen) return
            let roomBody = document.querySelector(".room__body");
            roomBody.style.scrollBehavior = isNotSmooth ? "initial" : "smooth"
            roomBody?.scrollTo(0, roomBody.offsetHeight * 10000);
        },
        toSearchedMssg: function (index, limit) {
            if (index > limit) return
            let roomBody = document.querySelector(".room__body");
            roomBody.style.scrollBehavior = "smooth"
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

    const closeImageOnFullScreen = () => { // close image on full when a user clicks the cancel icon
        setImageFullScreen({ isFullScreen: false });
    }
    useEffect(() => {
        // if user is on room screen reset on db
        resetUserRoomOnScreenInDb(user?.info.uid, roomId, true)
        return () => resetUserRoomOnScreenInDb(user?.info.uid, roomId, false)
    }, [user, roomId])
    useEffect(() => { // makes sure the room start at the bottom when it renders
        setRoomFirstRender(true);
        return () => setRoomFirstRender(false)
    }, [messages]);
    useEffect(() => { // map Room messages to global state currentDisplyedConvoMessages

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
    }, [messages, dispatch])
    useEffect(() => { // reset the user read value to true once a room is opened
        resetRecieverMssgReadOnDb(user?.info.uid, roomId, true, true)
    }, [roomId, user?.info.uid])

    useEffect(() => { // gets currentDisplayConvoInfo, roomMessages, roomMembers on first render
        let unsubcribeRoomInfo;
        let unsubcribeMessages;
        let unsubcribeRoomMembers;
        setSeed(Math.floor(Math.random() * 5000));
        setIsUserProfileRoom(true);
        if (roomId) {
            unsubcribeRoomInfo = getRoomInfoFromDb(roomId, dispatch, true);
            unsubcribeMessages = getMessgFromDb(null, roomId, true, "asc", setMessages, false);
            unsubcribeRoomMembers = getGroupMemberFromDb(roomId, setRoomMembers)
        }
        return () => { unsubcribeRoomInfo(); unsubcribeMessages(); unsubcribeRoomMembers(); }
    }, [roomId, setIsUserProfileRoom, dispatch]);
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [])
    if (roomFirstRender) scrollRoomBody.toEnd(true) // scroll room body to bottom if room is rendering for the first time
    return (
        <div className="room convo">
            <RoomHeader
                seed={seed}
                roomId={roomId}
                roomMembers={roomMembers}
                setMessages={setMessages}
                setIsRoomSearchBarOpen={setIsRoomSearchBarOpen}
                uploadFile={uploadFile}
                setFoundWordIndex={setFoundWordIndex}
                setTotalRoomWordFound={setTotalRoomWordFound}
                setOpenModal={setOpenModal}
                setModalType={setModalType}
                setIsRoom={setIsRoom}
                isRoomSearchBarOpen={isRoomSearchBarOpen}
            />
            <RoomBody
                messages={messages}
                setImageFullScreen={setImageFullScreen}
            />
            <RoomFooter
                showEmojis={showEmojis}
                totalRoomWordFound={totalRoomWordFound}
                onEmojiClick={onEmojiClick}
                input={input}
                foundWordIndex={foundWordIndex}
                isRoomSearchBarOpen={isRoomSearchBarOpen}
                setInput={setInput}
                sendMessage={sendMessage}
                setFoundWordIndex={setFoundWordIndex}
                roomId={roomId}
                scrollRoomBody={scrollRoomBody}
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
                isRoom={true}
                isFileTooBig={isFileTooBig}
                setIsFileTooBig={setIsFileTooBig}
                isFileSupported={isFileSupported}
                setIsFileSupported={setIsFileSupported}
                isFileOnPreviewLoading={isFileOnPreviewLoading}
                setIsFileOnPreviewLoading={setIsFileOnPreviewLoading}
            />
            <section className={`room__imageFullScreen ${imageFullScreen.isFullScreen && "show"}`}>
                <div className={`room__imageFullScreen_wr`}>
                    <IconButton onClick={closeImageOnFullScreen}>
                        <CloseRounded />
                    </IconButton>
                    <div className="room__imageFullScreenDivWrap">
                        <img src={imageFullScreen.url} alt="" />
                        <span className="room__imageFullScreenCaption">{imageFullScreen.caption}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default React.memo(Room)
