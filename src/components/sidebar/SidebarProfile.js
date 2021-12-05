import React, { useEffect, useState } from 'react'
import '../../styles/sidebarProfile.css'
import { ArrowBack, CameraAltRounded, CreateRounded, DoneRounded, InsertEmoticon } from '@material-ui/icons';
import { Avatar } from '@material-ui/core';
import Picker from "emoji-picker-react";
import { sidebarProfile } from '../utils/sidebarUtils';
import { useStateValue } from '../global-state-provider/StateProvider';
import { getUserInfoFromDb, setNewLoggedInUserAboutOnDb, setNewLoggedInUserAviOnDb, setNewLoggedInUserNameOnDb } from '../backend/get&SetDataToDb';
import Loading from '../common/Loading';

function SidebarProfile() {
    const [userInfo, setUserInfo] = useState(); // keeps state of logged in user info from db
    const [isNameOnEdit, setIsNameOnEdit] = useState(false); // keeps state if profile name is currently being edited
    const [isAboutOnEdit, setIsAboutOnEdit] = useState(false); // keeps state if profile about is currently being edited
    const [newNameInput, setNewNameInput] = useState(userInfo?.name || ''); // keeps state of the newly inputed name
    const [newAboutInput, setNewAboutInput] = useState('') // keeps state of the newly inputed about
    const [whoseEmoji, setWhoseEmoji] = useState(); // keeps state if opened emoji div if for name input or About input
    const [loadingChangeAvi, setLoadingChangeAvi] = useState(false) // keeps state if new avi data is being sent to db
    const [{ user, isUserOnDarkMode }] = useStateValue() // keeps state for current logged in user
    const handleAviFileChange = (e) => {
        // handles the uploading of the group new avi
        const selectedAvi = e.target.files[0];
        if (selectedAvi.type.split("/")[0] !== "image") return
        if (selectedAvi) {
            setLoadingChangeAvi(true);
            setNewLoggedInUserAviOnDb(user.info.uid, selectedAvi, setLoadingChangeAvi);
        }
    };
    const showEmojis = (e, userTyping, location) => {
        // show emojis when a user clicks on emoji icon
        if (location === "sp__editName__emoji") {
            setWhoseEmoji("NAME");
        } else {
            setWhoseEmoji("ABOUT");
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
    const onEmojiClick = (e, emojiObj) => {
        // gets the selected emoji from user
        if (whoseEmoji === "NAME") {
            editProfileInfo.onChange(newNameInput + emojiObj.emoji, "NAME");
        } else {
            editProfileInfo.onChange(newAboutInput + emojiObj.emoji, "ABOUT");
        }
    };
    const editProfileInfo = {
        editName: function () {
            setIsNameOnEdit(true);
        },
        onChange: function (input, type) {
            if (type === "NAME") {
                setNewNameInput(input);
            } else if (type === "ABOUT") {
                setNewAboutInput(input);
            }
        },
        modify: function (key) {
            switch (key) {
                case "NAME":
                    if (newNameInput.length < 1) {
                        setNewNameInput(userInfo.name);
                        setIsNameOnEdit(false);
                    } else {
                        setNewLoggedInUserNameOnDb(user.info.uid, newNameInput);
                        setIsNameOnEdit(false);
                    }
                    break;
                case "ABOUT":
                    if (newAboutInput.length < 1) {
                        setIsAboutOnEdit(false);
                    } else {
                        setNewLoggedInUserAboutOnDb(user.info.uid, newAboutInput)
                        setIsAboutOnEdit(false);
                    }
                    break;

                default:
                    break;
            }
        },
    };

    useEffect(() => {
        let unsubGetUserInfoFromDb;
        if (user?.info?.uid) {
            unsubGetUserInfoFromDb = getUserInfoFromDb(user?.info?.uid, setUserInfo, false)
        }
        return () => unsubGetUserInfoFromDb()
    }, [user])
    return (
        <div className={`sidebarProfile ${isUserOnDarkMode && "dark-mode1"}`}>
            <div className={`sidebarProfile__header ${isUserOnDarkMode && "dark-mode2"}`}>
                <div>
                    <ArrowBack onClick={() => {
                        sidebarProfile.hide();
                        setIsNameOnEdit();
                        setIsAboutOnEdit();
                    }} />
                    <p>Profile</p>
                </div>
            </div>
            <div className={`sidebarProfile__body ${isUserOnDarkMode && "dark-mode1"}`}>
                <section className="sidebarProfile__avatar">
                    <Avatar src={userInfo?.avi} />
                    <input type="file" onChange={(e) => handleAviFileChange(e)} />
                    <div className="sidebarProfile__avatar_change">
                        <CameraAltRounded />
                        <p>Change Profile Picture</p>
                    </div>
                    {loadingChangeAvi &&
                        <Loading
                            size={150}
                            type={'Rings'}
                            visible={loadingChangeAvi ? "Show" : "Hide"}
                            color={"#00BFA5"}
                            classname={"sidebarProfileAvatar__loading"}
                        />
                    }
                </section>
                <section className={`sidebarProfile__sec2_wr ${isUserOnDarkMode && "dark-mode2"}`}>
                    <p>Your Name</p>
                    <div className="sidebarProfile__sec2">
                        <div className="sidebarProfile__editName">
                            {isNameOnEdit ? (
                                <div>
                                    <input
                                        value={newNameInput}
                                        maxLength={"24"}
                                        onFocus={(e) =>
                                            showEmojis(e, true, "sp__editName__emoji")
                                        }
                                        onChange={(e) =>
                                            editProfileInfo.onChange(e.target.value, "NAME")
                                        }
                                        type="text"
                                    />
                                    <div className="sidebarProfile__editNameIconWr">
                                        <p>{24 - newNameInput?.length}</p>
                                        <div className={`sp__editName__emoji`}>
                                            <InsertEmoticon
                                                onClick={(e) =>
                                                    showEmojis(e, false, "sp__editName__emoji")
                                                }
                                            />
                                            <Picker
                                                className="hide"
                                                onEmojiClick={onEmojiClick}
                                            />
                                        </div>
                                        <DoneRounded
                                            onClick={() => editProfileInfo.modify("NAME")}
                                            className="done"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p>{userInfo?.name}</p>
                            )}

                        </div>
                        <CreateRounded
                            className={`${isNameOnEdit && "hide"}`}
                            onClick={() => {
                                setIsNameOnEdit(true);
                                setNewNameInput(userInfo?.name);
                            }}
                        />

                    </div>
                </section>
                <section className="sidebarProfile__sec3_wr">
                    <p>
                        This is not your username or pin. This name will be visible to your WhatsApp contacts.
                    </p>
                </section>

                <section className={`sidebarProfile__sec4_wr ${isUserOnDarkMode && "dark-mode2"}`}>
                    <p>About</p>
                    <div className="sidebarProfile__sec4">
                        <div className="sidebarProfile__editAbout">
                            {isAboutOnEdit ? (
                                <div>
                                    <textarea
                                        value={newAboutInput}
                                        wrap="hard"
                                        maxLength="140"
                                        onFocus={(e) =>
                                            showEmojis(e, true, "sp__editAbout__emoji")
                                        }
                                        onChange={(e) =>
                                            editProfileInfo.onChange(e.target.value, "ABOUT")
                                        }
                                    />

                                    <div className="sidebarProfile__editAboutIconWr">
                                        <p>{140 - newAboutInput?.length}</p>
                                        <div className={`sp__editAbout__emoji`}>
                                            <InsertEmoticon
                                                onClick={(e) =>
                                                    showEmojis(e, false, "sp__editAbout__emoji")
                                                }
                                            />
                                            <Picker
                                                className="hide"
                                                onEmojiClick={onEmojiClick}
                                            />
                                        </div>
                                        <DoneRounded
                                            onClick={() => editProfileInfo.modify("ABOUT")}
                                            className="done"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span>{userInfo?.about}</span>
                            )}

                        </div>
                        <CreateRounded
                            className={`${isAboutOnEdit && "hide"}`}
                            onClick={() => {
                                setIsAboutOnEdit(true);
                                setNewAboutInput(userInfo?.about);
                            }}
                        />

                    </div>
                </section>

            </div>
        </div>
    )
}

export default SidebarProfile
