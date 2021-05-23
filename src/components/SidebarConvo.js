import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import '../styles/sidebarConvo.css'
import DisplayModal from './DisplayModal';
import { getAndComputeNumberOfNewMssgOnDb, getMessgFromDb, getTotalUsersFromDb, createNewChatInDb, getUserInfoFromDb, createNewRoomInDb, getRoomMessgFromDb } from './get&SetDataToDb';
import SidebarConvoLastMessage from './SidebarConvoLastMessage';
import { useStateValue } from './StateProvider';
import {useLocation} from "react-router-dom";


function SidebarConvo({ addNewConvo, convoId, name, isRoom }) {
    const [{ user }] = useStateValue(); // keeps state for current logged in user
    const [userInfoDb, setUserInfoDb] = useState(); //keeps state of the user info from db
    const [openModal, setOpenModal] = useState(false); // keeps state if modal is opened or not
    const [modalInput, setModalInput] = useState() // keeps state of user input in the modal
    const [newMssgNum, setNewMssgNum] = useState(0); // keeps stste for the number of new messages
    const [totalUserOnDb, setTotalUserOnDb] = useState() // keeps state for the total user on the db
    const [lastMessage, setlastMessage] = useState(); // keeps state for the last message recived or sent
    const [modalType, setModalType] = useState("ADD_CHAT") //keeps state for the type of modal to be displayed
    const urlLocation = useLocation();
    const addChatBg = {url:"url(/img/chat-bg.svg)", position:"right bottom", size:"contain"} // addchat modal bg-image styles
    const addRoomBg = {url:"url(/img/room-bg.svg)",position:"right bottom", size: "97px"} // addroom modal bg-image styles
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
                        res = {status: false}
                    }

                }
            }
            return res;
        }

    }
    useEffect(() => { //Gets total users from db and get logged in user info from db
        getTotalUsersFromDb(setTotalUserOnDb)
        if (convoId) {
            getUserInfoFromDb(convoId, setUserInfoDb)
        }
    }, [convoId])
    useEffect(() => { // Gets the number of new messages from db 
        if (convoId) {
            getAndComputeNumberOfNewMssgOnDb(user?.info.uid,isRoom, convoId, setNewMssgNum,urlLocation.pathname)
        }
    }, [user?.info.uid, convoId,isRoom,urlLocation])
    useEffect(() => { // gets last sent message from db
        if (convoId) {
                getMessgFromDb(user?.info.uid, convoId,isRoom, "desc", setlastMessage, true);

        }
    }, [convoId, user?.info.uid, isRoom])
    return !addNewConvo ? (
        <Link to={isRoom ? `/rooms/${convoId}` : `/chats/${convoId}`}>
            <div onClick={() => { setNewMssgNum(0); displayConvoForMobile("show") }} className="sidebarConvoWr">
                <div className="sidebarConvo">
                    <Avatar src={userInfoDb?.avi} />
                    <div className="sidebarConvo__info">
                        <h2>{name}</h2>
                        {lastMessage ? <SidebarConvoLastMessage lastMessage={lastMessage} /> : "Chat is currently empty"}
                    </div>
                </div>
                <p className={newMssgNum > 0 ? "show" : ""}>{newMssgNum}</p>
            </div>
        </Link>
    ) : (
            <div className="sidebarConvo__add">
                <p onClick={() => {setModalType("ADD_CHAT"); setOpenModal(true)}} className="sidebarConvo__addChat">Add New Chat</p>
                <p onClick={() => {setModalType("ADD_ROOM"); setOpenModal(true)}} className="sidebarConvo__addRoom">Create Room</p>
                <DisplayModal
                    modalType={modalType}
                    openModal={openModal}
                    bgStyles={modalType==="ADD_CHAT"?addChatBg : addRoomBg}
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
    console.log("drawing div out")
    var currentScreenSize = window.innerWidth
    let convoDiv = document.querySelector(".convo");
    console.log(convoDiv)
    if (currentScreenSize > 767) return
    if (!convoDiv) return
    if (event === "show") {
        convoDiv.classList.add("show")
    } else {
        convoDiv.classList.remove("show")
    }
}
