import React from 'react'
import "../../../styles/userProfileMain.css";
import { CloseRounded, ArrowForwardIos, Block, ThumbDown, Delete } from "@material-ui/icons";
import { Avatar } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { profile } from "../../utils/profileUtils";
import { useStateValue } from '../../global-state-provider/StateProvider';
import { userprofileSidebar as animate } from "../../utils/userProfileUtils";
import { mobileDisplayConvoProfile } from '../../utils/mobileScreenUtils';
import { openImageFullScreen } from '../../utils/imageFullScreenUtils';



function UserProfileMain(props) {
    const { handleModalChange, imgMssgPreview, setUpSidebarType, setImageFullScreen } = props
    const [{ currentDisplayConvoInfo, isMuteNotifichecked, isCurrentConvoBlocked, isUserOnDarkMode }] = useStateValue(); // keeps state for current logged in user

    return (
        <div className="userProfile__container">
            <div className={`userProfile__header ${isUserOnDarkMode ? "dark-mode2" : ""}`}>
                <CloseRounded
                    className={`${isUserOnDarkMode ? "dark-mode-color3" : ""}`}
                    onClick={() => {
                        mobileDisplayConvoProfile("hide", false);
                        profile.close(false);
                    }} />
                <p>Contact Info</p>
            </div>
            <div className={`userProfile__body ${isUserOnDarkMode ? "dark-mode1" : ""}`}>
                <section className={`userProfileBody__sec1 ${isUserOnDarkMode ? "dark-mode1" : ""}`}>
                    <Avatar
                        onClick={() => openImageFullScreen(setImageFullScreen, currentDisplayConvoInfo?.avi, "Profile Picture")}
                        src={currentDisplayConvoInfo?.avi} />
                    <div>
                        <h3>{currentDisplayConvoInfo?.phoneNumber}</h3>
                        <p className={isUserOnDarkMode ? "dark-mode-color1" : ""}>~ {currentDisplayConvoInfo?.name}</p>
                    </div>
                </section>
                <section className={`userProfileBody__sec2 ${isUserOnDarkMode ? "dark-mode2" : ""}`}>
                    <div onClick={() => { animate.open(true); setUpSidebarType("MEDIA-DOCS"); }} className="userProfileBody__sec2Info">
                        <p>Media, Links and Docs</p>
                        <ArrowForwardIos
                            className={`${isUserOnDarkMode ? "dark-mode-color3" : ""}`}
                        />
                    </div>
                    {
                        imgMssgPreview.length > 0 ? <div className="media_grid_wr">
                            {imgMssgPreview.map((mssg, index) => (
                                <div
                                    onClick={() => openImageFullScreen(setImageFullScreen, mssg?.url, mssg?.mssg)}
                                    key={index}>
                                    <img src={mssg?.url} alt="media" />
                                </div>
                            ))}
                        </div>
                            :
                            <p className={isUserOnDarkMode ? "dark-mode-color1" : ""}>No Media, Links and Docs</p>
                    }
                    <div className="userProfileBody__sec2Doc"></div>
                </section>
                <section className={`userProfileBody__sec3 ${isUserOnDarkMode ? "dark-mode2" : ""}`}>
                    <div className="muteNotifi" onClick={() => handleModalChange("MUTE__CONVO", false)}>
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
                    <div className="starMessg" onClick={() => { animate.open(false); setUpSidebarType("STARRED-MESSAGE"); }}>
                        <p>Starred Messages</p>
                        <ArrowForwardIos className={`${isUserOnDarkMode ? "dark-mode-color3" : ""}`} />
                    </div>
                    <div className="disappearingMessg" onClick={() => { animate.open(false); setUpSidebarType("DISAPPEARING-MESSAGE"); }}>
                        <p>
                            <span>Disappearing Messages</span>
                            <span>Off</span>
                        </p>
                        <ArrowForwardIos className={`${isUserOnDarkMode ? "dark-mode-color3" : ""}`} />
                    </div>
                </section>
                <section className={`userProfileBody__sec4 ${isUserOnDarkMode ? "dark-mode2" : ""}`}>
                    <p>About and Phone Number</p>
                    <p>Hey there! i'm using whatsapp</p>
                    <p>{`~${currentDisplayConvoInfo?.phoneNumber}~`}</p>
                </section>
                <section
                    className={`
                    ${isUserOnDarkMode ? "dark-mode2" : ""}
                    userProfileBody__sec5 ${(isCurrentConvoBlocked && isCurrentConvoBlocked !== "") ? "blocked" : ""}`}
                    onClick={() => handleModalChange("BLOCK_CHAT", false)}
                >
                    <Block />
                    <p>{(isCurrentConvoBlocked && isCurrentConvoBlocked !== "") ? "UNBLOCK" : "BLOCK"}</p>
                </section>
                <section className={`userProfileBody__sec6 ${isUserOnDarkMode ? "dark-mode2" : ""}`} onClick={() => handleModalChange("REPORT_CONTACT", false)}>
                    <ThumbDown />
                    <p>Report Contact</p>
                </section>
                <section className={`userProfileBody__sec7 ${isUserOnDarkMode ? "dark-mode2" : ""}`} onClick={() => handleModalChange("DELETE_CHAT", false)}>
                    <Delete />
                    <p>Delete Chat</p>
                </section>
            </div>
        </div>
    )
}

export default UserProfileMain
