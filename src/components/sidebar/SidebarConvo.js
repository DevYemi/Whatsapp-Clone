import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../../styles/sidebarConvo.css'
import DisplayModal from '../common/DisplayModal';
import { getAndComputeNumberOfNewMssgOnDb, getMessgFromDb, getTotalUsersFromDb, createNewChatInDb, createNewRoomInDb, resetRecieverMssgReadOnDb, getUserInfoFromDb, getRoomInfoFromDb } from '../backend/get&SetDataToDb';
import SidebarConvoLastMessage from './SidebarConvoLastMessage';
import { useStateValue } from '../global-state-provider/StateProvider';
import { useLocation } from "react-router-dom";
import { profile } from '../profile/Profile';
import { KeyboardArrowDownRounded } from '@material-ui/icons';


function SidebarConvo({ addNewConvo, convoId, isRoom, setIsConnectedDisplayed }) {
    const [{ user, isMuteNotifichecked, currentDisplayConvoInfo }] = useStateValue(); // keeps state for current logged in user
    const [convoDirectInfo, setConvoDirectInfo] = useState(); // keeps state of the info of user or room who is associated with the convo
    const [openModal, setOpenModal] = useState(false); // keeps state if modal is opened or not
    const [modalInput, setModalInput] = useState("") // keeps state of user input in the modal
    const [newMssgNum, setNewMssgNum] = useState(0); // keeps stste for the number of new messages
    const [totalUserOnDb, setTotalUserOnDb] = useState() // keeps state for the total user on the db
    const [lastMessage, setlastMessage] = useState(); // keeps state for the last message recived or sent
    const [modalType, setModalType] = useState("ADD_CHAT") //keeps state for the type of modal to be displayed
    const [isCurrentSidebar, setIsCurrentSidebar] = useState(false); // keeps state if a user is current on the displayed sidebar
    const urlLocation = useLocation();
    const addChatBg = { url: "url(/img/chat-bg.svg)", position: "right bottom", size: "contain" } // addchat modal bg-image styles
    const addRoomBg = { url: "url(/img/room-bg.svg)", position: "right bottom", size: "97px" } // addroom modal bg-image styles
    const add = { // create new chat,room and a send to db
        chat: function () {// add new chat
            setModalInput("")
            let res = add.isNumberRegistered(modalInput);
            if (res.status) {
                createNewChatInDb(user, res.chatUser)
            } else {
                alert("Sorry User Is Not Registered On Our Database")
            }
        },
        room: function () { // create a new room
            setModalInput("")
            if (modalInput !== "") {
                createNewRoomInDb(user, modalInput)
            }
        },
        isNumberRegistered: function (number) {
            let res = { status: false }
            if (totalUserOnDb.length > 0) {
                for (let i = 0; i < totalUserOnDb.length; i++) {
                    const user = totalUserOnDb[i];
                    if (user.phoneNumber === number) {
                        res = { status: true, chatUser: user };
                        i = totalUserOnDb.length + 1
                    } else {
                        res = { status: false }
                    }

                }
            }
            return res;
        }

    }
    useEffect(() => { //Gets total users from db 
        getTotalUsersFromDb(setTotalUserOnDb)
    }, [convoId]);
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
        // console.log(`Getting numbers for: ${isRoom ? `/rooms/${convoId}` : `/chats/${convoId}`}`)
        if (currentLocation === urlLocation.pathname) {
            setNewMssgNum(0);
            resetRecieverMssgReadOnDb(user?.info?.uid, convoId, true, isRoom);
        } else {
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
                displayConvoForMobile("show");
                profile.close(currentDisplayConvoInfo?.isRoom ? true : false);
                setIsConnectedDisplayed(false);
            }}
                className={`sidebarConvoWr ${isCurrentSidebar ? "current" : ""}`}>
                <div className="sidebarConvo">
                    <Avatar src={convoDirectInfo?.avi} />
                    <div className="sidebarConvo__info">
                        <h2>{isRoom ? convoDirectInfo?.roomName : convoDirectInfo?.name}</h2>
                        {lastMessage ? <SidebarConvoLastMessage lastMessage={lastMessage} /> : <p>Chat is currently empty</p>}
                    </div>
                </div>
                <p className={newMssgNum > 0 && !isMuteNotifichecked ? "show" : ""}>{newMssgNum}</p>
                <KeyboardArrowDownRounded />
            </div>
        </Link>
    ) : (
        <div className="sidebarConvo__add">
            <p onClick={() => { setModalType("ADD_CHAT"); setOpenModal(true) }} className="sidebarConvo__addChat">Add New Chat</p>
            <p onClick={() => { setModalType("ADD_ROOM"); setOpenModal(true) }} className="sidebarConvo__addRoom">Create Room</p>
            <DisplayModal
                modalType={modalType}
                openModal={openModal}
                bgStyles={modalType === "ADD_CHAT" ? addChatBg : addRoomBg}
                add={add}
                modalInput={modalInput}
                setModalInput={setModalInput}
                setOpenModal={setOpenModal}
            />
        </div>
    )
}


export default React.memo(SidebarConvo)
export const displayConvoForMobile = (event) => { // displays chat message on a mobile screen when the user clicks on the sideBarConvo component 
    var currentScreenSize = window.innerWidth
    let convoDiv = document.querySelector(".convo");
    if (currentScreenSize > 767) return
    if (!convoDiv) return
    if (event === "show") {
        convoDiv.classList.add("show")
    } else {
        convoDiv.classList.remove("show")
    }
}
