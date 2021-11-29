import gsap from "gsap";

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
    let chatsClone = [...chats]
    members.forEach((mem, memIndex) => {
        chatsClone = chatsClone.filter(chat => chat.id !== mem.id)
    });
    return chatsClone
}