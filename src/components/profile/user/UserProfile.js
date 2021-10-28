// DISPLAYS THE PROFILE OF BOTH CHAT CONVO AND GROUP CONVO
import React, { useEffect, useState } from "react";
import {
    CloseRounded,
    ArrowForwardIos,
    Block,
    ThumbDown,
    Delete,
} from "@material-ui/icons";
import "../../../styles/userProfile.css";
import { Avatar } from "@material-ui/core";
import { useStateValue } from "../../global-state-provider/StateProvider";
import Checkbox from "@material-ui/core/Checkbox";
import { isConvoMutedOnDb } from "../../backend/get&SetDataToDb";
import { profile } from "../Profile";
// import UserProfileSideBar from "./UserProfileSideBar";
function UserProfile(props) {
    const { setOpenModal, setModalType, setIsRoom, isConnectedDisplayed, isFirstRender } = props;
    const [{ user, currentDisplayConvoInfo, currentDisplayedConvoMessages, isMuteNotifichecked, isCurrentConvoBlocked, }, disptach,] = useStateValue(); // keeps state for current logged in user
    const [upSidebarType, setUpSidebarType] = useState("STARRED-MESSAGE");
    const [imgMssg, setImgMssg] = useState([]); // keeps state of current displayed convo message that are of image type
    const handleModalChange = (type, isRoom) => {
        setOpenModal(true);
        setModalType(type);
        setIsRoom(isRoom);
    };


    useEffect(() => {
        // on first render get all the messages of the current displayed convo and map out the img messages into state
        let imgMssgArr = []
        if (currentDisplayedConvoMessages) {
            currentDisplayedConvoMessages.forEach(mssg => {
                if (mssg.fileType.type === "image") {
                    imgMssgArr.push(mssg)
                }
            })
            setImgMssg(imgMssgArr);
        }
    }, [currentDisplayedConvoMessages])

    useEffect(() => {
        // checks if the current chat has been muted before
        if (user?.info?.uid && currentDisplayConvoInfo?.uid) {
            isConvoMutedOnDb(user?.info?.uid, currentDisplayConvoInfo?.uid, false, disptach);
        }
    }, [isMuteNotifichecked, disptach, user?.info?.uid, currentDisplayConvoInfo?.uid, currentDisplayConvoInfo?.roomId,]);

    return (
        <div className={`userProfile__wr ${(isFirstRender || isConnectedDisplayed) && "hide"}`}>
            <div className="userProfile__container">
                <div className="userProfile__header">
                    <CloseRounded onClick={() => profile.close(false)} />
                    <p>Contact Info</p>
                </div>
                <div className="userProfile__body">
                    <section className="userProfileBody__sec1">
                        <Avatar src={currentDisplayConvoInfo?.avi} />
                        <div>
                            <p>{currentDisplayConvoInfo?.phoneNumber}</p>
                            <p>~ {currentDisplayConvoInfo?.name}</p>
                        </div>
                    </section>
                    <section className="userProfileBody__sec2">
                        <div className="userProfileBody__sec2Info">
                            <p>Media, Links and Docs</p>
                            <ArrowForwardIos />
                        </div>
                        <p>No Media, Links and Docs</p>
                        <div className="userProfileBody__sec2Doc"></div>
                    </section>
                    <section className="userProfileBody__sec3">
                        <div className="muteNotifi">
                            <p>Mute Notification</p>
                            <div>
                                <Checkbox
                                    checked={isMuteNotifichecked}
                                    style={{
                                        color: "green",
                                    }}
                                    onChange={() => handleModalChange("MUTE__CONVO", false)}
                                    inputProps={{ "aria-label": "primary checkbox" }}
                                />
                            </div>
                        </div>
                        <div
                            className="starMessg"
                            onClick={() => {
                                setUpSidebarType("STARRED-MESSAGE");
                            }}
                        >
                            <p>Starred Messages</p>
                            <ArrowForwardIos />
                        </div>
                        <div className="disappearingMessg">
                            <p>
                                <span>Disappearing Messages</span>
                                <span>Off</span>
                            </p>
                            <ArrowForwardIos />
                        </div>
                    </section>
                    <section className="userProfileBody__sec4">
                        <p>About and Phone Number</p>
                        <p>Hey there! i'm using whatsapp</p>
                        <p>{`~${currentDisplayConvoInfo?.phoneNumber}~`}</p>
                    </section>
                    <section
                        className={`userProfileBody__sec5 ${(isCurrentConvoBlocked && isCurrentConvoBlocked !== "") && "blocked"
                            }`}
                        onClick={() => handleModalChange("BLOCK_CHAT", false)}
                    >
                        <Block />
                        <p>{(isCurrentConvoBlocked && isCurrentConvoBlocked !== "") ? "UNBLOCK" : "BLOCK"}</p>
                    </section>
                    <section className="userProfileBody__sec6" onClick={() => handleModalChange("REPORT_CONTACT", false)}>
                        <ThumbDown />
                        <p>Report Contact</p>
                    </section>
                    <section className="userProfileBody__sec7" onClick={() => handleModalChange("DELETE_CHAT", false)}>
                        <Delete />
                        <p>Delete Chat</p>
                    </section>
                </div>
            </div>
            {/* <UserProfileSideBar upSidebarType={upSidebarType} /> */}
        </div>
    );
}

export default React.memo(UserProfile);

