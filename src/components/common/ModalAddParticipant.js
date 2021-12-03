import { Avatar, Checkbox } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { getUserInfoFromDb } from '../backend/get&SetDataToDb';
import { useStateValue } from '../global-state-provider/StateProvider';

function ModalAddParticipant({ chatId, setSelectedParticipant, selectedParticipant }) {
    const [isChecked, setIsChecked] = useState(false); // keeps state if user has been checked
    const [chatDirectInfo, setChatDirectInfo] = useState(); // keeps state of the user which of whom the chat is on
    const [{ isUserOnDarkMode }] = useStateValue();
    const handleOnChange = () => {
        if (isChecked) {
            // REMOVE CHAT FROM SELECTED PARTICIPANT IF CHAT IS CHECKED
            let newSelected = selectedParticipant.filter(chat => chatId !== chat.info.uid);
            setSelectedParticipant(newSelected);
            setIsChecked(!isChecked);
        } else {
            //ADD CHAT TO SELECTED PARTICIPANT IF CHAT ISN'T CHECKED
            setSelectedParticipant([...selectedParticipant, { info: chatDirectInfo }]);
            setIsChecked(!isChecked);
        }
    }
    useEffect(() => {
        // Gets the Info of the user of whom the chat is on
        let unsubGetUserInfoFromDb;
        if (chatId) {
            unsubGetUserInfoFromDb = getUserInfoFromDb(chatId, setChatDirectInfo, false)
        }
        return () => unsubGetUserInfoFromDb()
    }, [chatId])
    useEffect(() => {
        // On every first render check if user has been checked
        let selected = selectedParticipant.filter(chat => chat.info.uid === chatId);
        if (selected.length > 0) {
            setIsChecked(true)
        } else {
            setIsChecked(false)
        }
    }, [selectedParticipant, chatId])
    return (
        <div className={`member  ${isUserOnDarkMode && "dark-mode2"}  ${isUserOnDarkMode && "dark-modeHover"} `}
            onClick={handleOnChange} >
            <Checkbox
                checked={isChecked}
                style={{ color: "#009688" }}
                onChange={handleOnChange}
                inputProps={{ "aria-label": "primary checkbox" }}
            />
            <Avatar src={chatDirectInfo?.avi} />
            <div className="memberInfo">
                <p className="memberName">{chatDirectInfo?.name}</p>
                <p className="memberAbout">{chatDirectInfo?.about}</p>
            </div>
        </div>
    )
}

export default ModalAddParticipant
