// DISPLAYS THE PROFILE OF BOTH CHAT CONVO AND GROUP CONVO
import React, { useEffect, useState } from "react";
import {
  CloseRounded,
  ArrowForwardIos,
  Block,
  ThumbDown,
  Delete,
  InfoOutlined,
  CreateRounded,
  InsertEmoticon,
  DoneRounded,
  CameraAltRounded,
  SearchOutlined,
  ExitToAppRounded,
} from "@material-ui/icons";
import "../../styles/userProfile.css";
import { Avatar } from "@material-ui/core";
import { useStateValue } from "../global-state-provider/StateProvider";
import Checkbox from "@material-ui/core/Checkbox";
import gsap from "gsap/gsap-core";
import {
  getGroupMemberFromDb,
  getIfCurrentUserIsGroupAdminFromDb,
  isConvoMutedOnDb,
  setNewAviForGroupOnDb,
  setNewGroupDescriptionOnDb,
  setNewGroupNameOnDb,
} from "../backend/get&SetDataToDb";
// import UserProfileSideBar from "./UserProfileSideBar";
import Picker from "emoji-picker-react";
function UserProfile(props) {
  const { setOpenModal, setModalType, setIsRoom, isUserProfileRoom, isConnectedDisplayed, isFirstRender } = props;
  const [
    {
      user,
      currentDisplayConvoInfo,
      isMuteNotifichecked,
      isCurrentConvoBlocked,
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
    if (location === "upbr__editName__emoji") {
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
    if (currentDisplayConvoInfo?.roomId) {
      getGroupMemberFromDb(currentDisplayConvoInfo?.roomId, setGroupMemebers);
    }
  }, [currentDisplayConvoInfo?.roomId]);
  useEffect(() => {
    // on every first render check if the current logged in user is an admin of the current displayed group on db
    if (user?.info?.uid && currentDisplayConvoInfo?.roomId) {
      getIfCurrentUserIsGroupAdminFromDb(
        user?.info?.uid,
        currentDisplayConvoInfo?.roomId,
        setIsAdmin
      );
    }
  }, [user?.info?.uid, currentDisplayConvoInfo?.roomId]);
  useEffect(() => {
    // checks if the current chat has been muted before
    if (user?.info?.uid && currentDisplayConvoInfo?.uid) {
      //check if its a chat
      isConvoMutedOnDb(
        user?.info?.uid,
        currentDisplayConvoInfo?.uid,
        false,
        disptach
      );
    } else if (user?.info?.uid && currentDisplayConvoInfo?.roomId) {
      // else treat convo as a group
      isConvoMutedOnDb(
        user?.info?.uid,
        currentDisplayConvoInfo?.roomId,
        true,
        disptach
      );
    }
  }, [
    isMuteNotifichecked,
    disptach,
    user?.info?.uid,
    currentDisplayConvoInfo?.uid,
    currentDisplayConvoInfo?.roomId,
  ]);
  if (isUserProfileRoom) {
    // if the displayed convo is a group display appropriatly
    return (
      <div className={`userProfileRoom__wr ${(isFirstRender || isConnectedDisplayed) && "hide"}`}>
        <div className="userProfileRoom__container">
          <div className="userProfileRoom__header">
            <CloseRounded
              onClick={() => {
                userProfile.close(true);
                setIsGroupNameOnEdit(false);
                setIsGroupDescripOnEdit(false);
              }}
            />
            <p>Contact Info</p>
          </div>
          <div className="userProfileRoom__body">
            <section className="userProfileBodyRoom__sec1">
              <div className="userProfileBodyRoom__sec1AviWr">
                <Avatar src={currentDisplayConvoInfo?.avi} />
                {isAdmin && (
                  <input type="file" onChange={(e) => handleAviFileChange(e)} />
                )}
                {isAdmin && (
                  <div className="upbr__sec1AviChnage">
                    <CameraAltRounded />
                    <p>Change Group Icon</p>
                  </div>
                )}
              </div>
              <div className="userProfileBodyRoom__sec1OuterDiv">
                <div className="upbr__editName">
                  {isGroupNameOnEdit ? (
                    <div>
                      <input
                        value={newNameInput}
                        maxLength={"25"}
                        onFocus={(e) =>
                          showEmojis(e, true, "upbr__editName__emoji")
                        }
                        onChange={(e) =>
                          editGroupInfo.onChange(e.target.value, "NAME")
                        }
                        type="text"
                      />
                      <div className="upbr__editNameIconWr">
                        <p>{newNameInput.length}</p>
                        <div className={`upbr__editName__emoji`}>
                          <InsertEmoticon
                            onClick={(e) =>
                              showEmojis(e, false, "upbr__editName__emoji")
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
            <section className="userProfileBodyRoom__sec2">
              <div className="userProfileBodyRoom__sec2OuterDiv">
                <div className="upbr__editDescrip">
                  <p>Description</p>
                  {isGroupDescripOnEdit ? (
                    <div>
                      <textarea
                        value={newDescripInput}
                        wrap="hard"
                        onFocus={(e) =>
                          showEmojis(e, true, "upbr__editDescrip__emoji")
                        }
                        onChange={(e) =>
                          editGroupInfo.onChange(e.target.value, "DESCRIPTION")
                        }
                      />
                      <div className="upbr__editDescripIconWr">
                        <div className={`upbr__editDescrip__emoji`}>
                          <InsertEmoticon
                            onClick={(e) =>
                              showEmojis(e, false, "upbr__editDescrip__emoji")
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
            <section className="userProfileBodyRoom__sec3">
              <div className="userProfileBodyRoom__sec3Info">
                <p>Media, Links and Docs</p>
                <ArrowForwardIos />
              </div>
              <p>No Media, Links and Docs</p>
              <div className="userProfileBodyRoom__sec3Doc"></div>
            </section>
            <section className="userProfileBodyRoom__sec4">
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
            <section className="userProfileBodyRoom__sec5">
              <div className="upbr_sec5_div1">
                <p>{`${groupMembers?.length} participant`}</p>
                <SearchOutlined />
              </div>
              <div className="upbr_sec5_div2">
                {groupMembers?.map((member, index) => (
                  <div key={index} className="upbr_sec5_div2_memberWr">
                    <div>
                      <Avatar src={member?.avi} />
                      <p>{member?.data?.name}</p>
                    </div>
                    {isAdmin && <p>Group Admin</p>}
                  </div>
                ))}
              </div>
            </section>
            <section className="userProfileBodyRoom__sec6">
              <ExitToAppRounded />
              <p>Exit Group</p>
            </section>
            <section className="userProfileBodyRoom__sec7">
              <ThumbDown />
              <p>Report Group</p>
            </section>
          </div>
        </div>
        {/* <UserProfileSideBar upSidebarType={upSidebarType} /> */}
      </div>
    );
  } else {
    return (
      <div className={`userProfile__wr ${(isFirstRender || isConnectedDisplayed) && "hide"}`}>
        <div className="userProfile__container">
          <div className="userProfile__header">
            <CloseRounded onClick={() => userProfile.close(false)} />
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
}

export default UserProfile;
export const userProfile = {
  // Code for the smoothin animation of the user profile sidebar
  open: function (isRoom) {
    let userProfile = gsap.timeline({
      defaults: { duration: 1, ease: "power4" },
    });
    userProfile
      .to(isRoom ? ".userProfileRoom__wr" : ".userProfile__wr", {
        width: "35%",
      })
      .to(
        isRoom ? ".userProfileRoom__body" : ".userProfile__body",
        { duration: 0.5, stagger: 1, opacity: 1, marginTop: 0 },
        ">-0.7"
      );
  },
  close: function (isRoom) {
    gsap.to(isRoom ? ".userProfileRoom__wr" : ".userProfile__wr", {
      duration: 0.6,
      width: "0%",
    });
    gsap.to(isRoom ? ".userProfileRoom__body" : ".userProfile__body", {
      opacity: 0,
      marginTop: "-30px",
    });
  },
};
