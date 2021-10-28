import React from 'react'
import RoomProfile from './room/RoomProfile';
import UserProfile from './user/UserProfile';
import gsap from "gsap/gsap-core";


function Profile(props) {
    const { setOpenModal, setModalType, setIsRoom, isRoom, isConnectedDisplayed, isFirstRender } = props;

    if (isRoom) {
        return <RoomProfile
            setOpenModal={setOpenModal}
            setModalType={setModalType}
            setIsRoom={setIsRoom}
            isFirstRender={isFirstRender}
            isConnectedDisplayed={isConnectedDisplayed}

        />
    } else {
        return <UserProfile
            setOpenModal={setOpenModal}
            setModalType={setModalType}
            setIsRoom={setIsRoom}
            isFirstRender={isFirstRender}
            isConnectedDisplayed={isConnectedDisplayed}
        />
    }

}

export default React.memo(Profile);
export const profile = {
    // Code for the smoothin animation of the user profile sidebar
    open: function (isRoom) {
        let userProfile = gsap.timeline({
            defaults: { duration: 1, ease: "power4" },
        });
        userProfile
            .to(isRoom ? ".roomProfile__wr" : ".userProfile__wr", {
                width: "35%",
            })
            .to(
                isRoom ? ".roomProfile__body" : ".userProfile__body",
                { duration: 0.5, stagger: 1, opacity: 1, marginTop: 0 },
                ">-0.7"
            );
    },
    close: function (isRoom) {
        gsap.to(isRoom ? ".roomProfile__wr" : ".userProfile__wr", {
            duration: 0.6,
            width: "0%",
        });
        gsap.to(isRoom ? ".roomProfile__body" : ".userProfile__body", {
            opacity: 0,
            marginTop: "-30px",
        });
    },
};
