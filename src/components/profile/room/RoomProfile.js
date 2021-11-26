import React, { useEffect, useState } from "react";
import {
    CloseRounded,
    ArrowForwardIos,
    ThumbDown,
    InfoOutlined,
    CreateRounded,
    InsertEmoticon,
    DoneRounded,
    CameraAltRounded,
    SearchOutlined,
    ExitToAppRounded,
} from "@material-ui/icons";
import "../../../styles/roomProfile.css";
import { Avatar } from "@material-ui/core";
import { useStateValue } from "../../global-state-provider/StateProvider";
import Checkbox from "@material-ui/core/Checkbox";
import {
    getGroupMemberFromDb,
    getIfCurrentUserIsGroupAdminFromDb,
    isConvoMutedOnDb,
    setNewAviForGroupOnDb,
    setNewGroupDescriptionOnDb,
    setNewGroupNameOnDb,
} from "../../backend/get&SetDataToDb";
// import UserProfileSideBar from "./UserProfileSideBar";
import Picker from "emoji-picker-react";
import { profile } from "../Profile";
function RoomProfile(props) {
    const { setOpenModal, setModalType, setIsRoom, isConnectedDisplayed, isFirstRender } = props;
    const [
        {
            user,
            currentDisplayConvoInfo,
            isMuteNotifichecked,
        },
        disptach,
    ] = useStateValue(); // keeps state for current logged in user
    const [upSidebarType, setUpSidebarType] = useState("STARRED-MESSAGE");
    const [isAdmin, setIsAdmin] = useState(true);
    const [isGroupNameOnEdit, setIsGroupNameOnEdit] = useState(false); // keeps state if a user is currently editing the group name
    const [newNameInput, setNewNameInput] = useState(""); // keeps state for the inputed message by user
    const [isGroupDescripOnEdit, setIsGroupDescripOnEdit] = useState(false); // keeps state if a user is currently editing the group description
    const [newDescripInput, setNewDescripInput] = useState(""); // keeps state for the inputed message by user
    const [whoseEmoji, setWhoseEmoji] = useState(); // keeps state if opened emoji div if for name input or description input
    const [groupMembers, setGroupMemebers] = useState(); // keeps state of all the memebers of a group
    const handleModalChange = (type, isRoom) => {
        setOpenModal(true);
        setModalType(type);
        setIsRoom(isRoom);
    };

    const editGroupInfo = {
        editName: function () {
            setIsGroupNameOnEdit(true);
        },
        onChange: function (input, type) {
            if (type === "NAME") {
                setNewNameInput(input);
            } else if (type === "DESCRIPTION") {
                setNewDescripInput(input);
            }
        },
        modify: function (key) {
            switch (key) {
                case "NAME":
                    if (newNameInput.length < 1) {
                        handleModalChange("EMPTY_GROUPNAME", true);
                    } else {
                        setNewGroupNameOnDb(currentDisplayConvoInfo?.roomId, newNameInput);
                        setIsGroupNameOnEdit(false);
                    }
                    break;
                case "DESCRIPTION":
                    if (newDescripInput.length < 1) {
                        setIsGroupDescripOnEdit(false);
                    } else {
                        setNewGroupDescriptionOnDb(
                            currentDisplayConvoInfo?.roomId,
                            newDescripInput
                        );
                        setIsGroupDescripOnEdit(false);
                    }
                    break;

                default:
                    break;
            }
        },
    };
    const onEmojiClick = (e, emojiObj) => {
        // gets the selected emoji from user
        if (whoseEmoji === "NAME") {
            editGroupInfo.onChange(newNameInput + emojiObj.emoji, "NAME");
        } else {
            editGroupInfo.onChange(newDescripInput + emojiObj.emoji, "DESCRIPTION");
        }
    };
    const showEmojis = (e, userTyping, location) => {
        // show emojis when a user clicks on emoji icon
        if (location === "rpb__editName__emoji") {
            setWhoseEmoji("NAME");
        } else {
            setWhoseEmoji("DESCRIPTION");
        }
        let emojis = document.querySelector(`.${location} > .emoji-picker-react`);
        if (userTyping) {
            emojis.style.display = "none";
        } else {
            let currentDisplayStatus = emojis.style.display;
            if (currentDisplayStatus === "none" || currentDisplayStatus === "") {
                emojis.style.display = "flex";
            } else {
                emojis.style.display = "none";
            }
        }
    };
    const handleAviFileChange = (e) => {
        // handles the uploading of the group new avi
        const selectedAvi = e.target.files[0];
        if (selectedAvi) {
            setNewAviForGroupOnDb(selectedAvi, currentDisplayConvoInfo?.roomId);
        }
    };
    useEffect(() => {
        // on every first render in a group chat always close the isGroupNameOnEdit & isGroupDescripOnEdit also set newDescriptionInput to the data on db
        setIsGroupNameOnEdit(false);
        setIsGroupDescripOnEdit(false);
        setNewDescripInput(currentDisplayConvoInfo?.description);
    }, [currentDisplayConvoInfo?.roomId, currentDisplayConvoInfo?.description]);
    useEffect(() => {
        // on every render get group memebers of group from db
        let unsubcribeGetGroupMemberFromDb;
        if (currentDisplayConvoInfo?.roomId) {
            unsubcribeGetGroupMemberFromDb = getGroupMemberFromDb(currentDisplayConvoInfo?.roomId, setGroupMemebers);
            return () => unsubcribeGetGroupMemberFromDb();
        }
    }, [currentDisplayConvoInfo?.roomId]);
    useEffect(() => {
        // on every first render check if the current logged in user is an admin of the current displayed group on db
        let unsubGetIfCurrentUserIsGroupAdminFromDb;
        if (user?.info?.uid && currentDisplayConvoInfo?.roomId) {
            unsubGetIfCurrentUserIsGroupAdminFromDb = getIfCurrentUserIsGroupAdminFromDb(user?.info?.uid, currentDisplayConvoInfo?.roomId, setIsAdmin);
        }
        return () => { if (unsubGetIfCurrentUserIsGroupAdminFromDb) unsubGetIfCurrentUserIsGroupAdminFromDb(); }
    }, [user?.info?.uid, currentDisplayConvoInfo?.roomId]);
    useEffect(() => {
        // checks if the group chat has been muted before
        if (user?.info?.uid && currentDisplayConvoInfo?.roomId) {
            isConvoMutedOnDb(user?.info?.uid, currentDisplayConvoInfo?.roomId, true, disptach);
        }
    }, [isMuteNotifichecked, disptach, user?.info?.uid, currentDisplayConvoInfo?.uid, currentDisplayConvoInfo?.roomId,]);

    return (
        <div className={`roomProfile__wr ${(isFirstRender || isConnectedDisplayed) && "hide"}`}>
            <div className="roomProfile__container">
                <div className="roomProfile__header">
                    <CloseRounded
                        onClick={() => {
                            profile.close(true);
                            setIsGroupNameOnEdit(false);
                            setIsGroupDescripOnEdit(false);
                        }}
                    />
                    <p>Contact Info</p>
                </div>
                <div className="roomProfile__body">
                    <section className="roomProfileBody__sec1">
                        <div className="roomProfileBody__sec1AviWr">
                            <Avatar src={currentDisplayConvoInfo?.avi} />
                            {isAdmin && (
                                <input type="file" onChange={(e) => handleAviFileChange(e)} />
                            )}
                            {isAdmin && (
                                <div className="rpb__sec1AviChnage">
                                    <CameraAltRounded />
                                    <p>Change Group Icon</p>
                                </div>
                            )}
                        </div>
                        <div className="roomProfileBody__sec1OuterDiv">
                            <div className="rpb__editName">
                                {isGroupNameOnEdit ? (
                                    <div>
                                        <input
                                            value={newNameInput}
                                            maxLength={"25"}
                                            onFocus={(e) =>
                                                showEmojis(e, true, "rpb__editName__emoji")
                                            }
                                            onChange={(e) =>
                                                editGroupInfo.onChange(e.target.value, "NAME")
                                            }
                                            type="text"
                                        />
                                        <div className="rpb__editNameIconWr">
                                            <p>{newNameInput.length}</p>
                                            <div className={`rpb__editName__emoji`}>
                                                <InsertEmoticon
                                                    onClick={(e) =>
                                                        showEmojis(e, false, "rpb__editName__emoji")
                                                    }
                                                />
                                                <Picker
                                                    className="hide"
                                                    onEmojiClick={onEmojiClick}
                                                />
                                            </div>
                                            <DoneRounded
                                                onClick={() => editGroupInfo.modify("NAME")}
                                                className="done"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p>{currentDisplayConvoInfo?.roomName}</p>
                                )}

                                <p>
                                    Created
                                    {new Date(
                                        currentDisplayConvoInfo?.timestamp?.toDate()
                                    ).toUTCString()}
                                </p>
                            </div>
                            {isAdmin ? (
                                <CreateRounded
                                    className={`${isGroupNameOnEdit && "hide"}`}
                                    onClick={() => {
                                        setIsGroupNameOnEdit(true);
                                        setNewNameInput(currentDisplayConvoInfo?.roomName);
                                    }}
                                />
                            ) : (
                                <InfoOutlined
                                    onClick={() => handleModalChange("NOT_ADMIN", true)}
                                />
                            )}
                        </div>
                    </section>
                    <section className="roomProfileBody__sec2">
                        <div className="roomProfileBody__sec2OuterDiv">
                            <div className="rpb__editDescrip">
                                <p>Description</p>
                                {isGroupDescripOnEdit ? (
                                    <div>
                                        <textarea
                                            value={newDescripInput}
                                            wrap="hard"
                                            onFocus={(e) =>
                                                showEmojis(e, true, "rpb__editDescrip__emoji")
                                            }
                                            onChange={(e) =>
                                                editGroupInfo.onChange(e.target.value, "DESCRIPTION")
                                            }
                                        />
                                        <div className="rpb__editDescripIconWr">
                                            <div className={`rpb__editDescrip__emoji`}>
                                                <InsertEmoticon
                                                    onClick={(e) =>
                                                        showEmojis(e, false, "rpb__editDescrip__emoji")
                                                    }
                                                />
                                                <Picker
                                                    className="hide"
                                                    onEmojiClick={onEmojiClick}
                                                />
                                            </div>
                                            <DoneRounded
                                                onClick={() => editGroupInfo.modify("DESCRIPTION")}
                                                className="done"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <span>
                                        {currentDisplayConvoInfo?.description === ""
                                            ? "Add group description"
                                            : currentDisplayConvoInfo?.description}
                                    </span>
                                )}
                            </div>
                            {isAdmin ? (
                                <CreateRounded
                                    className={`${isGroupDescripOnEdit && "hide"}`}
                                    onClick={() => {
                                        setIsGroupDescripOnEdit(true);
                                        setNewNameInput(currentDisplayConvoInfo?.roomName);
                                    }}
                                />
                            ) : (
                                <InfoOutlined
                                    onClick={() => handleModalChange("NOT_ADMIN", true)}
                                />
                            )}
                        </div>
                    </section>
                    <section className="roomProfileBody__sec3">
                        <div className="roomProfileBody__sec3Info">
                            <p>Media, Links and Docs</p>
                            <ArrowForwardIos />
                        </div>
                        <p>No Media, Links and Docs</p>
                        <div className="roomProfileBody__sec3Doc"></div>
                    </section>
                    <section className="roomProfileBody__sec4">
                        <div className="muteNotifi">
                            <p>Mute Notification</p>
                            <div>
                                <Checkbox
                                    checked={isMuteNotifichecked}
                                    style={{
                                        color: "green",
                                    }}
                                    onChange={() => handleModalChange("MUTE__CONVO", true)}
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
                    <section className="roomProfileBody__sec5">
                        <div className="rpb_sec5_div1">
                            <p>{`${groupMembers?.length} participant`}</p>
                            <SearchOutlined />
                        </div>
                        <div className="rpb_sec5_div2">
                            {groupMembers?.map((member, index) => (
                                <div key={index} className="rpb_sec5_div2_memberWr">
                                    <div>
                                        <Avatar src={member?.avi} />
                                        <p>{member?.data?.name}</p>
                                    </div>
                                    {isAdmin && <p>Group Admin</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="roomProfileBody__sec6">
                        <ExitToAppRounded />
                        <p>Exit Group</p>
                    </section>
                    <section className="roomProfileBody__sec7">
                        <ThumbDown />
                        <p>Report Group</p>
                    </section>
                </div>
            </div>
            {/* <UserProfileSideBar upSidebarType={upSidebarType} /> */}
        </div>
    );
}

export default React.memo(RoomProfile);
