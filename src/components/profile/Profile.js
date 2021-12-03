import React from 'react'
import RoomProfile from './room/RoomProfile';
import UserProfile from './user/UserProfile';


function Profile(props) {
    const {
        setOpenModal,
        setModalType,
        setIsRoom,
        isRoom,
        isConnectedDisplayed,
        isFirstRender,
        setImageFullScreen } = props;

    if (isRoom) {
        return <RoomProfile
            setOpenModal={setOpenModal}
            setModalType={setModalType}
            setIsRoom={setIsRoom}
            isFirstRender={isFirstRender}
            isConnectedDisplayed={isConnectedDisplayed}
            setImageFullScreen={setImageFullScreen}
        />
    } else {
        return <UserProfile
            setOpenModal={setOpenModal}
            setModalType={setModalType}
            setIsRoom={setIsRoom}
            isFirstRender={isFirstRender}
            isConnectedDisplayed={isConnectedDisplayed}
            setImageFullScreen={setImageFullScreen}
        />
    }

}

export default React.memo(Profile);

