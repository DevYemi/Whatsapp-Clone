import gsap from "gsap"
import { createNewChatInDb, createNewRoomInDb } from "../backend/get&SetDataToDb"

export const sidebarProfile = { // handles the smooth animation of displaying and hiding the sidebar div
    show: function () {
        const tl = gsap.timeline({ defaults: { duration: .3, ease: "power2" } })
        tl.to('.sidebarProfile', { right: 0 })
            .to('.sidebarProfile__avatar .MuiAvatar-root', { width: '200px', height: '200px', opacity: 1 }, '-=0.1')
            .to(['.sidebarProfile__sec2_wr', '.sidebarProfile__sec3_wr', '.sidebarProfile__sec4_wr'], { duration: .5, opacity: 1, bottom: 0 })
    },
    hide: function () {
        const tl = gsap.timeline({ defaults: { duration: .2, ease: "power2" } })
        tl.to('.sidebarProfile', { right: '100%' })
            .to('.sidebarProfile__avatar .MuiAvatar-root', { width: '50px', height: '50px' })
            .to(['.sidebarProfile__sec2_wr', '.sidebarProfile__sec3_wr', '.sidebarProfile__sec4_wr'], { opacity: 0, bottom: '15px' })
    }
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