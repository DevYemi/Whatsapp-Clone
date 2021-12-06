import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../../styles/sidebarConvo.css'
import { getAndComputeNumberOfNewMssgOnDb, getMessgFromDb, resetRecieverMssgReadOnDb, getUserInfoFromDb, getRoomInfoFromDb, getIsUserTypingFromDb } from '../backend/get&SetDataToDb';
import SidebarConvoLastMessage from './SidebarConvoLastMessage';
import { useStateValue } from '../global-state-provider/StateProvider';
import { useLocation } from "react-router-dom";
import { profile } from '../utils/profileUtils';
import { KeyboardArrowDownRounded } from '@material-ui/icons';


function SidebarConvo({ addNewConvo, convoId, isRoom, setIsConnectedDisplayed, setOpenModal, setModalType, setIsConvoSearchBarOpen }) {
    const [{ user, isMuteNotifichecked, currentDisplayConvoInfo, isUserOnDarkMode }] = useStateValue(); // keeps state for current logged in user
    const [convoDirectInfo, setConvoDirectInfo] = useState(); // keeps state of the info of user or room who is associated with the convo
    const [newMssgNum, setNewMssgNum] = useState(0); // keeps stste for the number of new messages
    const [lastMessage, setlastMessage] = useState(); // keeps state for the last message recived or sent
    const [isCurrentSidebar, setIsCurrentSidebar] = useState(false); // keeps state if a user is current on the displayed sidebar
    const [ischatUserTyping, setIschatUserTyping] = useState(false); // keeps state if convo user or users are typing a message
    const [roomMemberWhomTyping, setRoomMemberWhomTyping] = useState(null) // keeps state of the room member thats typing if sidebar convo is a room
    const urlLocation = useLocation();

    useEffect(() => { // Gets if convo user is typing a message
        let unsubIschatUserTypingDb;
        let unsubRoomMemberWhomTyping;
        if (convoId && isRoom) {
            unsubRoomMemberWhomTyping = getIsUserTypingFromDb(user?.info?.uid, convoId, isRoom, setRoomMemberWhomTyping);
        }
        else if (convoId && !isRoom) {
            unsubIschatUserTypingDb = getIsUserTypingFromDb(user?.info?.uid, convoId, isRoom, setIschatUserTyping);
        }
        return () => {
            unsubRoomMemberWhomTyping && unsubRoomMemberWhomTyping();
            unsubIschatUserTypingDb && unsubIschatUserTypingDb();
        }
    }, [user, convoId, isRoom,])

    useEffect(() => { // Get the info of the convo user
        let unsubGetUserInfoFromDb;
        let unsubGetRoomInfoFromDb;
        if (convoId) {
            if (isRoom) {
                unsubGetRoomInfoFromDb = getRoomInfoFromDb(convoId, setConvoDirectInfo, false)
            } else {
                unsubGetUserInfoFromDb = getUserInfoFromDb(convoId, setConvoDirectInfo, false)
            }
        }

        return () => { unsubGetUserInfoFromDb && unsubGetUserInfoFromDb(); unsubGetRoomInfoFromDb && unsubGetRoomInfoFromDb(); }
    }, [convoId, isRoom])
    useEffect(() => { // Gets the number of new messages from db
        let unsubGetAndComputeNumberOfNewMssgOnDb;
        let currentLocation = isRoom ? `/rooms/${convoId}` : `/chats/${convoId}`;
        if (currentLocation === urlLocation.pathname) {
            // if convo is alteady opened by user reset newMessages to 0 & reset newMessages on db
            setNewMssgNum(0);
            resetRecieverMssgReadOnDb(user?.info?.uid, convoId, true, isRoom);
        } else {
            // else get and commpute new messages
            if (convoId) {
                unsubGetAndComputeNumberOfNewMssgOnDb = getAndComputeNumberOfNewMssgOnDb(user?.info?.uid, isRoom, convoId, setNewMssgNum, urlLocation.pathname);
            }
        }
        return () => { if (unsubGetAndComputeNumberOfNewMssgOnDb) unsubGetAndComputeNumberOfNewMssgOnDb(); };
    }, [user?.info.uid, convoId, isRoom, urlLocation.pathname, lastMessage])
    useEffect(() => { // gets last sent message from db
        let unsubcribegetMessgFromDb;
        if (convoId) {
            unsubcribegetMessgFromDb = getMessgFromDb(user?.info.uid, convoId, isRoom, "desc", setlastMessage, true);
        }
        return () => { if (unsubcribegetMessgFromDb) unsubcribegetMessgFromDb(); }
    }, [convoId, user?.info.uid, isRoom])
    useEffect(() => { // checks if user is on the current side and set state to true or false
        let sidebarLocation = isRoom ? `/rooms/${convoId}` : `/chats/${convoId}`;
        if (sidebarLocation === urlLocation.pathname) {
            setIsCurrentSidebar(true);
        } else {
            setIsCurrentSidebar(false)
        }

    }, [convoId, isRoom, urlLocation]);
    return !addNewConvo ? (
        <Link to={isRoom ? `/rooms/${convoId}` : `/chats/${convoId}`}>
            <div onClick={() => {
                setNewMssgNum(0);
                profile.close(currentDisplayConvoInfo?.isRoom ? true : false);
                setIsConnectedDisplayed(false);
                setIsConvoSearchBarOpen(false);
            }}
                className={`sidebarConvoWr ${isCurrentSidebar && "current"} ${isUserOnDarkMode && "dark-modeHover"}`}>
                <div className={`
                sidebarConvo 
                ${isUserOnDarkMode && "dark-border1"} 
                ${isUserOnDarkMode && "dark-mode-color1"} 
                ${isCurrentSidebar && "current"}
                ${isUserOnDarkMode && "dark-modeHover"}`}>
                    <Avatar src={convoDirectInfo?.avi} />
                    <div className="sidebarConvo__info">
                        <h2>{isRoom ? convoDirectInfo?.roomName : convoDirectInfo?.name}</h2>
                        {roomMemberWhomTyping && isRoom ?
                            <div className="typing">{`${roomMemberWhomTyping.name} Typing...`}</div>
                            : ischatUserTyping && !isRoom ?
                                <div className="typing">Typing...</div>
                                : lastMessage ?
                                    <SidebarConvoLastMessage
                                        isRoom={isRoom}
                                        lastMessage={lastMessage} />
                                    : <div>{isRoom ? "Room" : "Chat"} is currently empty</div>}
                    </div>
                </div>
                <p className={newMssgNum > 0 && !isMuteNotifichecked && !isRoom ? "show" : ""}>{newMssgNum}</p>
                <p className={`roomRead ${newMssgNum > 0 && !isMuteNotifichecked && isRoom ? "show" : ""}`}>{""}</p>
                <KeyboardArrowDownRounded />
            </div>
        </Link>
    ) : (
        <div className={`sidebarConvo__add ${isUserOnDarkMode && "dark-mode2"}  `}>
            <p
                onClick={() => { setModalType("ADD_CHAT"); setOpenModal(true) }}
                className={`sidebarConvo__addChat ${isUserOnDarkMode && "dark-modeHover"}`}>
                Add New Chat
            </p>
            <p
                onClick={() => {
                    setModalType("ADD_ROOM");
                    setOpenModal(true)
                }}
                className={`sidebarConvo__addRoom ${isUserOnDarkMode && "dark-mode2"}  ${isUserOnDarkMode && "dark-modeHover"}`}
            >
                Create Room
            </p>
        </div>
    )
}


export default React.memo(SidebarConvo)

