import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import "../../styles/modal.css";
import { useStateValue } from "../global-state-provider/StateProvider";
import { useHistory } from "react-router-dom";
import { displayConvoForMobile, mobileDisplayConvoProfile } from '../utils/mobileScreenUtils'
import {
  addRoomToUserConvoInDb,
  blockChatOnDb,
  clearChatOnDb,
  deleteConvoOnDb,
  exitFromGroupOnDb,
  muteConvoOnDb,
  removeMemberFromRoomInDb,
  setMemberAdminStatusInDb,
  unBlockChatOnDb,
  unmuteConvoOnDb,
} from "../backend/get&SetDataToDb";
import { profile } from "../utils/profileUtils";
import { ArrowBackRounded, CheckRounded, CloseRounded, SearchOutlined } from "@material-ui/icons";
import ModalAddParticipant from "./ModalAddParticipant";
import { Avatar } from "@material-ui/core";
import Loading from "./Loading";
import { addParticipantAnimation, getChatThatAreNotMembers, handleRemoveParticipant, clickedRoomMember, add } from '../utils/displayModalUtils'

const useStylesTextField = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

function DisplayModal(props) {
  const {
    modalType,
    bgStyles,
    openModal,
    setOpenModal,
    isRoom,
    setModalInput,
    modalInput,
    setIsConnectedDisplayed,
    setModalType,
    setIsChatBeingCleared,
    setIsAddChatFromRoomProfile
  } = props;
  const [{
    user,
    currentLoggedInUserChats: currentUserChats,
    currentDisplayConvoInfo,
    isMuteNotifichecked,
    currentDisplayedRoomMembers: roomMembers,
    totalUserOnDb,
    selectedPreviewMember,
    userChats,
    isUserOnDarkMode,
    isCurrentConvoBlocked, }, dispatch] = useStateValue(); // React context API
  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: "5px",
      boxShadow: theme.shadows[5],
      backgroundImage: bgStyles?.url,
      maxWidth: "40%",
      minWidth: "300px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: bgStyles?.position,
      backgroundSize: bgStyles?.size,
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();
  const classesTextField = useStylesTextField();
  const [isBlockAndClearChecked, setIsBlockAndClearChecked] = useState(true); // keeps state if report chat block&clear check box is checked in BLOCK_CHAT modal
  const [isExitAndClearChecked, setIsExitAndClearChecked] = useState(true); // keeps state if report group exit&clear check box is checked in EXIT_GROUP modal
  const [selectedParticipant, setSelectedParticipant] = useState([]) // keeps state of the list of chats that has been checked in add participant modal
  const [successSP, setSuccessSP] = useState({ loading: false, success: false }) // keeps loading and success state when selectedParticipant is being added in db

  const urlHistory = useHistory();
  const handleClose = () => {
    setOpenModal(false);
  };

  if (modalType === "ADD_CHAT") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} addChatModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__addChat">
                <h3>Input the User Phone Number</h3>
                <PhoneInput
                  placeholder="Enter phone number"
                  international
                  countryCallingCodeEditable={false}
                  value={modalInput}
                  defaultCountry="NG"
                  error={
                    modalInput
                      ? isValidPhoneNumber(modalInput)
                        ? undefined
                        : "Invalid phone number"
                      : "Phone number required"
                  }
                  onChange={setModalInput}
                />
                <button
                  onClick={() => {
                    if (modalInput === "") return;
                    add.chat(setModalInput, modalInput, user, totalUserOnDb);
                    handleClose();
                  }}
                >
                  Add Contact
                </button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "ADD_ROOM") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} addChatModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__addRoom">
                <h3>Input A Name For The Room</h3>
                <form
                  className={classesTextField.root}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    value={modalInput}
                    id="outlined-room-input"
                    label="Room Name"
                    onChange={(e) => setModalInput(e.target.value)}
                    type="text"
                    variant="outlined"
                  />
                </form>
                <button
                  onClick={() => {
                    if (modalInput === "") return;
                    add.room(setModalInput, modalInput, user, totalUserOnDb);
                    handleClose();
                  }}
                >
                  Create Room
                </button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "MUTE__CONVO") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__muteConvo">
                <h3>
                  Mute{" "}
                  {currentDisplayConvoInfo?.name ||
                    currentDisplayConvoInfo?.roomName}{" "}
                  Messages
                </h3>
                <p className={isUserOnDarkMode && "dark-mode-color1"}>
                  {isMuteNotifichecked
                    ? `Unmute ${currentDisplayConvoInfo?.name ||
                    currentDisplayConvoInfo?.roomName
                    } so you can recieve thier message notification`
                    : `Are you sure you want to mute ${currentDisplayConvoInfo?.name ||
                    currentDisplayConvoInfo?.roomName
                    },
                        you will not be able to recieve message from the contact while
                        they are muted`}
                </p>
                <div>
                  <button onClick={handleClose}>Cancel</button>
                  <button
                    onClick={() => {
                      if (isMuteNotifichecked) {
                        unmuteConvoOnDb(
                          user?.info?.uid,
                          currentDisplayConvoInfo?.uid ||
                          currentDisplayConvoInfo?.roomId,
                          isRoom,
                          dispatch
                        );
                        setModalInput(false);
                        handleClose();
                      } else {
                        muteConvoOnDb(
                          user?.info?.uid,
                          currentDisplayConvoInfo?.uid ||
                          currentDisplayConvoInfo?.roomId,
                          isRoom,
                          dispatch
                        );
                        setModalInput(true);
                        handleClose();
                      }
                    }}
                  >
                    {isMuteNotifichecked
                      ? "UNMUTE NOTIFICATION"
                      : "MUTE NOTIFICATION"}
                  </button>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "NOT_ADMIN") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__notAdmin">
                <p>Only admin can edit this group info</p>
                <button onClick={handleClose}>OK</button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "EMPTY_GROUPNAME") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__emptyGroupName">
                <p>Group Subject can't be empty</p>
                <button onClick={handleClose}>OK</button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "BLOCK_CHAT") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__blockChat">
                <p className={isUserOnDarkMode && "dark-mode-color1"}>
                  {(isCurrentConvoBlocked && isCurrentConvoBlocked !== "")
                    ? `Unblock ${currentDisplayConvoInfo?.name} ?`
                    : `Block ${currentDisplayConvoInfo?.name} ? Blocked contact will not be able to call you or send you messages`}
                </p>
                <button
                  onClick={() => {
                    if (isCurrentConvoBlocked && isCurrentConvoBlocked !== "") {
                      // chat has already been blocked, unblock chat
                      unBlockChatOnDb(
                        user?.info?.uid,
                        currentDisplayConvoInfo?.uid
                      );
                      handleClose();
                    } else {
                      // block chat
                      blockChatOnDb(
                        user?.info?.uid,
                        currentDisplayConvoInfo?.uid
                      );
                      handleClose();
                    }
                  }}
                >
                  {isCurrentConvoBlocked && isCurrentConvoBlocked !== "" ? "UNBLOCK" : "BLOCK"}
                </button>
                <button onClick={handleClose}>CANCEL</button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "CLEAR__MESSAGES") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            {isRoom ?
              <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
                <div className="modal__clearMssgs">
                  <p className={isUserOnDarkMode && "dark-mode-color1"}>Sorry You Can't Clear Group chat Messages</p>
                  <button onClick={handleClose}>Close</button>
                </div>
              </div>
              :
              <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
                <div className="modal__clearMssgs">
                  <p className={isUserOnDarkMode && "dark-mode-color1"}>Clear this chat ?</p>
                  <button
                    onClick={() => {
                      clearChatOnDb(
                        user?.info?.uid,
                        currentDisplayConvoInfo?.uid,
                        setIsChatBeingCleared
                      );
                      setIsChatBeingCleared(true);
                      handleClose();
                    }}
                  >
                    CLEAR CHAT
                  </button>
                  <button onClick={handleClose}>CANCEL</button>
                </div>
              </div>
            }

          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "REPORT_CONTACT") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__reportContact">
                <p className={isUserOnDarkMode && "dark-mode-color1"}>Report Contact to whatsApp ?</p>
                <span className={isUserOnDarkMode && "dark-mode-color1"}>
                  Most recent messages from this contact will be forwarded to
                  WhatsApp
                </span>
                <div>
                  <Checkbox
                    checked={isBlockAndClearChecked}
                    style={{ color: "#009688" }}
                    onChange={() =>
                      setIsBlockAndClearChecked(!isBlockAndClearChecked)
                    }
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                  <p className={isUserOnDarkMode && "dark-mode-color1"}>Block Contact and clear Chat</p>
                </div>
                <button
                  onClick={() => {
                    if (isBlockAndClearChecked) {
                      blockChatOnDb(user?.info?.uid, currentDisplayConvoInfo?.uid);
                      clearChatOnDb(user?.info?.uid, currentDisplayConvoInfo?.uid);
                      handleClose();
                    } else {
                      handleClose();
                    }
                  }}
                >
                  REPORT
                </button>
                <button onClick={handleClose}>CANCEL</button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "DELETE_CHAT") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__deleteChat">
                <p className={isUserOnDarkMode && "dark-mode-color1"}>Delete this chat ?</p>
                <button
                  onClick={() => {
                    mobileDisplayConvoProfile("hide", false);
                    displayConvoForMobile("hide")
                    deleteConvoOnDb(
                      user?.info?.uid,
                      currentDisplayConvoInfo?.uid
                    );
                    setIsConnectedDisplayed(true);
                    profile.close(false)
                    urlHistory.push("/home");
                    handleClose();
                  }}
                >
                  DELETE CHAT
                </button>
                <button onClick={handleClose}>CANCEL</button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "EXIT_GROUP") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__exitGroup">
                <p className={isUserOnDarkMode && "dark-mode-color1"}>Exit Group ?</p>
                <button
                  onClick={() => {
                    mobileDisplayConvoProfile("hide", true);
                    displayConvoForMobile("hide")
                    exitFromGroupOnDb(user?.info?.uid, currentDisplayConvoInfo?.roomId);
                    setIsConnectedDisplayed(true);
                    profile.close(true)
                    urlHistory.push("/home");
                    handleClose();
                  }}
                >
                  Exit Group
                </button>
                <button onClick={handleClose}>CANCEL</button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "REPORT_GROUP") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} muteConvoModal`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className="modal__reportGroup">
                <p className={isUserOnDarkMode && "dark-mode-color1"}>Report this group to whatsApp ?</p>
                <span className={isUserOnDarkMode && "dark-mode-color1"}>
                  The last 5 messages in the group will br forwarded to Whatsapp
                </span>
                <span className={isUserOnDarkMode && "dark-mode-color1"}>
                  No one in this group will be notified
                </span>
                <div>
                  <Checkbox
                    checked={isExitAndClearChecked}
                    style={{ color: "#009688" }}
                    onChange={() =>
                      setIsExitAndClearChecked(!isExitAndClearChecked)
                    }
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                  <p className={isUserOnDarkMode && "dark-mode-color1"}>Exit group and clear Chat</p>
                </div>
                <button
                  onClick={() => {
                    if (isExitAndClearChecked) {
                      mobileDisplayConvoProfile("hide", true);
                      displayConvoForMobile("hide")
                      exitFromGroupOnDb(user?.info?.uid, currentDisplayConvoInfo?.roomId);
                      setIsConnectedDisplayed(true);
                      profile.close(true)
                      urlHistory.push("/home");
                      handleClose();
                    } else {
                      handleClose();
                    }
                  }}
                >
                  REPORT
                </button>
                <button onClick={handleClose}>CANCEL</button>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "ADD_PARTICIPANT") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal} addParticipant`}
          open={openModal}
          onClose={() => { handleClose(); setSelectedParticipant([]) }}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"} modal__addParticipant_wr`}>
              <div className="modal__addParticipant">
                <section className={`modal_addparticipant_header ${isUserOnDarkMode && "dark-mode2"} `}>
                  <CloseRounded onClick={() => { handleClose(); setSelectedParticipant([]) }} />
                  <p>Add Participant</p>
                </section>
                <section className={`modal_addparticipant_search ${isUserOnDarkMode && "dark-mode1"}`}>
                  <div className={`modal_addparticipant_searchContainer ${isUserOnDarkMode && "dark-mode2"}`}>
                    <div className='icons'>
                      <SearchOutlined className='search' />
                      <ArrowBackRounded className="back" />
                    </div>
                    <input
                      type="text"
                      onFocus={() => addParticipantAnimation.focus()}
                      onBlur={() => addParticipantAnimation.blur()}
                      placeholder="Search or start a new group" />
                  </div>
                </section>
                <section className={`modal_addparticipant_selectedWr ${isUserOnDarkMode && "dark-mode2"} `}>
                  <div className={`modal_addparticipant_selected`}>
                    {selectedParticipant.length > 0 &&
                      selectedParticipant.map(participant => (
                        <div key={participant?.info.uid}
                          className={`${isUserOnDarkMode && "dark-mode1"}`}>
                          <Avatar src={participant?.info.avi} />
                          <span>{participant?.info.name}</span>
                          <CloseRounded onClick={() => handleRemoveParticipant(participant?.info.uid, selectedParticipant, setSelectedParticipant)} />
                        </div>
                      ))

                    }
                  </div>
                </section>
                <section className={`modal_addparticipant_membersWr ${isUserOnDarkMode && "dark-mode2"}`}>
                  <div className="modal_addparticipant_members">
                    <h3>Contacts</h3>
                    {getChatThatAreNotMembers(currentUserChats, roomMembers).length > 0 ?
                      getChatThatAreNotMembers(currentUserChats, roomMembers).map(chat => (
                        <ModalAddParticipant
                          key={chat?.id}
                          chatId={chat?.id}
                          setSelectedParticipant={setSelectedParticipant}
                          selectedParticipant={selectedParticipant}
                        />
                      ))
                      :
                      (
                        <p>You currently dont have any active chats</p>
                      )

                    }
                  </div>
                </section>
                {selectedParticipant.length > 0 && <CheckRounded onClick={() => setModalType("A_P_CONFIRMATION")} />}
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "A_P_CONFIRMATION") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={openModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode1"}`}>
              <div className={`modal__aPConfirmation ${successSP?.loading && 'loading'}`}>
                {successSP.loading ?
                  <Loading
                    size={50}
                    type={'ThreeDots'}
                    color={"#00BFFF"}
                    class={"modal__aPConfirmation_loading"} />
                  : successSP?.success ?
                    <>
                      <p className={`${isUserOnDarkMode && "dark-mode-color1"}`}>
                        {`${selectedParticipant?.map(participant => participant?.info?.name).toString()} has been added to "${currentDisplayConvoInfo?.roomName}" Group Successfully`}
                      </p>
                      <button onClick={() => { handleClose(); setSelectedParticipant([]); setSuccessSP({ loading: false, success: false }) }}>Okay</button>
                    </>
                    : <>
                      <p className={`${isUserOnDarkMode && "dark-mode-color1"}`}>
                        {`Add ${selectedParticipant.map(participant => participant?.info.name).toString()} to "${currentDisplayConvoInfo.roomName}" Group`}
                      </p>
                      <button onClick={() => {
                        setSuccessSP({ ...successSP, loading: true })
                        addRoomToUserConvoInDb(currentDisplayConvoInfo?.roomId, selectedParticipant, false, setSuccessSP)
                      }}>
                        ADD PARTICIPANT
                      </button>
                      <button onClick={() => setModalType("ADD_PARTICIPANT")}>CANCEL</button>
                    </>
                }


              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "CLICKED_ROOM_MEMBER") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode2"} modal__clickedRoomMemberWr`}>
              <div className="modal__clickedRoomMember">
                <p
                  className={` ${isUserOnDarkMode && "dark-modeHover"}  ${isUserOnDarkMode && "dark-mode2"}`}
                >
                  {selectedPreviewMember?.data?.name}
                </p>
                <p
                  className={` ${isUserOnDarkMode && "dark-modeHover"}  ${isUserOnDarkMode && "dark-mode2"}`}
                  onClick={() => {
                    mobileDisplayConvoProfile("hide", true);
                    displayConvoForMobile("hide");
                    clickedRoomMember.startChat(user, userChats, selectedPreviewMember, handleClose, setIsAddChatFromRoomProfile);
                  }}>
                  Start Chat
                </p>
                {!selectedPreviewMember?.isAdmin && <p onClick={() => { setModalType("CONFIRM_MAKE_ADMIN") }}>Make Group Admin</p>}
                <p
                  className={` ${isUserOnDarkMode && "dark-modeHover"}  ${isUserOnDarkMode && "dark-mode2"}`}
                  onClick={() => { setModalType("REMOVE_FROM_GROUP") }}>
                  Remove From Group
                </p>
                <p
                  className={` ${isUserOnDarkMode && "dark-modeHover"}  ${isUserOnDarkMode && "dark-mode2"}`}
                  onClick={handleClose}>
                  Cancel</p>

              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "CONFIRM_MAKE_ADMIN") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode2"} modal__confirmMakeAdminWr`}>
              <div className="modal__confirmMakeAdmin">
                <p>{`Make ${selectedPreviewMember?.data?.name} an admin in "${currentDisplayConvoInfo?.roomName}" group`}</p>
                <div>
                  <button onClick={() => {
                    setMemberAdminStatusInDb(currentDisplayConvoInfo?.roomId, selectedPreviewMember?.id, true)
                    handleClose();
                  }}>
                    Make Group Admin
                  </button>
                  <button onClick={handleClose}>CANCEL</button>
                </div>


              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  } else if (modalType === "REMOVE_FROM_GROUP") {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={`${classes.modal}`}
          open={openModal}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openModal}>
            <div className={`${classes.paper} ${isUserOnDarkMode && "dark-mode2"} modal__removeFromGroupWr`}>
              <div className="modal__removeFromGroup">
                <p className={`${isUserOnDarkMode && "dark-mode-color1"}`}>
                  {`Remove ${selectedPreviewMember?.data?.name} from "${currentDisplayConvoInfo?.roomName}" group`}
                </p>
                <button onClick={() => {
                  removeMemberFromRoomInDb(currentDisplayConvoInfo?.roomId, selectedPreviewMember?.id)
                  handleClose();
                }}>
                  Remove
                </button>
                <button onClick={handleClose}>CANCEL</button>

              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
  else {
    return [];
  }
}

export default React.memo(DisplayModal);
