import React from 'react'
import "../../../styles/userProfileMain.css";
import { CloseRounded, ArrowForwardIos, Block, ThumbDown, Delete } from "@material-ui/icons";
import { Avatar } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { profile } from "../../utils/profileUtils";
import { useStateValue } from '../../global-state-provider/StateProvider';
import { userprofileSidebar as animate } from "../../utils/userProfileUtils";
import { mobileDisplayConvoProfile } from '../../utils/mobileScreenUtils';



function UserProfileMain(props) {
    const { handleModalChange, imgMssgPreview, setUpSidebarType } = props
    const [{ currentDisplayConvoInfo, isMuteNotifichecked, isCurrentConvoBlocked, }] = useStateValue(); // keeps state for current logged in user

    return (
        <div className="userProfile__container">
            <div className="userProfile__header">
                <CloseRounded onClick={() => {
                    mobileDisplayConvoProfile("hide", false);
                    profile.close(false);
                }} />
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
                    <div onClick={() => { animate.open(true); setUpSidebarType("MEDIA-DOCS"); }} className="userProfileBody__sec2Info">
                        <p>Media, Links and Docs</p>
                        <ArrowForwardIos />
                    </div>
                    {
                        imgMssgPreview.length > 0 ? <div className="media_grid_wr">
                            {imgMssgPreview.map((mssg, index) => (
                                <div key={index}>
                                    <img src={mssg?.url} alt="media" />
                                </div>
                            ))}
                        </div>
                            :
                            <p>No Media, Links and Docs</p>
                    }
                    <div className="userProfileBody__sec2Doc"></div>
                </section>
                <section className="userProfileBody__sec3">
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
                        <ArrowForwardIos />
                    </div>
                    <div className="disappearingMessg" onClick={() => { animate.open(false); setUpSidebarType("DISAPPEARING-MESSAGE"); }}>
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
    )
}

export default UserProfileMain
