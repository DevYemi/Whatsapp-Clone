import gsap from "gsap";
import { createNewChatInDb, createNewRoomInDb } from "../backend/get&SetDataToDb";

export const addParticipantAnimation = {
    // ADD PARTICIPANT INPUT ICON ANIMATION
    focus: function () {
        let tl = gsap.timeline({ defaults: { duration: .2, ease: 'power2' } });
        tl.to('.modal_addparticipant_searchContainer > .icons > .search ', { rotation: 100, display: 'none' })
            .to('.modal_addparticipant_searchContainer > .icons > .back ', { rotation: 0, display: 'inline-block' })
    },
    blur: function () {
        let tl = gsap.timeline({ defaults: { duration: .2, ease: 'power2' } });
        tl.to('.modal_addparticipant_searchContainer > .icons > .back ', { rotation: -100, display: 'none' })
            .to('.modal_addparticipant_searchContainer > .icons > .search ', { rotation: 0, display: 'inline-block' })
    }

}

export const handleRemoveParticipant = (chatId, selectedParticipant, setSelectedParticipant) => {
    // removes a specific chat from the list of selected participant
    let newSelected = selectedParticipant.filter(chat => chatId !== chat.info.uid);
    setSelectedParticipant(newSelected);
}

export const getChatThatAreNotMembers = (chats, members) => {
    if (Array.isArray(chats)) {
        var chatsClone = [...chats]
        members.forEach((mem, memIndex) => {
            chatsClone = chatsClone.filter(chat => chat.id !== mem.id)
        });
    }
    return chatsClone || []
}

export const add = { // create new chat,room and a send to db
    chat: function (setModalInput, modalInput, user, totalUserOnDb) {// add new chat
        setModalInput("")
        let res = add.isNumberRegistered(modalInput, totalUserOnDb);
        if (res.status) {
            createNewChatInDb(user, res.chatUser)
        } else {
            alert("Sorry User Is Not Registered On Our Database")
        }
    },
    room: function (setModalInput, modalInput, user) { // create a new room
        setModalInput("")
        if (modalInput !== "") {
            createNewRoomInDb(user, modalInput)
        }
    },
    isNumberRegistered: function (number, totalUserOnDb) {
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

export function isLoggedInUserAdmin(user, roomMembers) {
    // checks and return value if logged user is an admin of a group
    const member = roomMembers.filter(mem => mem.id === user?.info?.uid)

    return member[0]?.isAdmin
}

export const clickedRoomMember = {
    startChat: function (user, userChats, clickedMember, handleClose, setIsAddChatFromRoomProfile) {
        const openChat = () => {
            setIsAddChatFromRoomProfile(true);
            handleClose();
        }
        let chat = userChats.filter(chat => chat.id === clickedMember.id)
        console.log(chat)
        if (chat.length > 0) {
            handleClose();
            setIsAddChatFromRoomProfile(true);
        } else {
            createNewChatInDb(user, clickedMember, openChat)
        }
    },
    makeAdmin: function () {

    }
}