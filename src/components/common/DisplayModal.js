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
import {
  blockChatOnDb,
  clearChatOnDb,
  deleteConvoOnDb,
  muteConvoOnDb,
  unBlockChatOnDb,
  unmuteConvoOnDb,
} from "../backend/get&SetDataToDb";
import { userProfile } from "../userprofile/UserProfile";

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
    add,
    setOpenModal,
    isRoom,
    setModalInput,
    modalInput,
    setIsConnectedDisplayed,
  } = props;
  const [
    {
      user,
      currentDisplayConvoInfo,
      isMuteNotifichecked,
      isCurrentConvoBlocked,
    },
    dispatch,
  ] = useStateValue(); // React context API
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
  const [isBlockAndClearChecked, setIsBlockAndClearChecked] = useState(true); // keeps state if report chat block&clear check box is checked
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
            <div className={classes.paper}>
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
                    add.chat();
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
            <div className={classes.paper}>
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
                    add.room();
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
            <div className={classes.paper}>
              <div className="modal__muteConvo">
                <h3>
                  Mute{" "}
                  {currentDisplayConvoInfo?.name ||
                    currentDisplayConvoInfo?.roomName}{" "}
                  Messages
                </h3>
                <p>
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
            <div className={classes.paper}>
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
            <div className={classes.paper}>
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
            <div className={classes.paper}>
              <div className="modal__blockChat">
                <p>
                  {(isCurrentConvoBlocked && isCurrentConvoBlocked !== "")
                    ? `Unblock ${currentDisplayConvoInfo?.name} ?`
                    : `Block ${currentDisplayConvoInfo?.name} ? Blocked contact will not be able to call you or send you messages`}
                </p>
                <button
                  onClick={() => {
                    console.log("running");
                    if (isCurrentConvoBlocked && isCurrentConvoBlocked !== "") {
                      // chat has already been blocked, unblock chat
                      console.log("unblocking");
                      unBlockChatOnDb(
                        user?.info?.uid,
                        currentDisplayConvoInfo?.uid
                      );
                      handleClose();
                    } else {
                      // block chat
                      console.log("blocking");
                      blockChatOnDb(
                        user?.info?.uid,
                        currentDisplayConvoInfo?.uid
                      );
                      handleClose();
                    }
                  }}
                >
                  {isCurrentConvoBlocked !== "" ? "UNBLOCK" : "BLOCK"}
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
            <div className={classes.paper}>
              <div className="modal__clearMssgs">
                <p>Clear this chat ?</p>
                <button
                  onClick={() => {
                    clearChatOnDb(
                      user?.info?.uid,
                      currentDisplayConvoInfo?.uid
                    );
                    handleClose();
                  }}
                >
                  CLEAR CHAT
                </button>
                <button onClick={handleClose}>CANCEL</button>
              </div>
            </div>
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
            <div className={classes.paper}>
              <div className="modal__reportContact">
                <p>Report Contact to whatsApp ?</p>
                <span>
                  Most recent messages from this contact will be forwarded to
                  WhatsApp
                </span>
                <div>
                  <Checkbox
                    checked={isBlockAndClearChecked}
                    style={{
                      color: "#009688",
                    }}
                    onChange={() =>
                      setIsBlockAndClearChecked(!isBlockAndClearChecked)
                    }
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                  <p>Block Contact and clear Chat</p>
                </div>
                <button
                  onClick={() => {
                    if (isBlockAndClearChecked) {
                      blockChatOnDb(
                        user?.info?.uid,
                        currentDisplayConvoInfo?.uid
                      );
                      clearChatOnDb(
                        user?.info?.uid,
                        currentDisplayConvoInfo?.uid
                      );
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
            <div className={classes.paper}>
              <div className="modal__deleteChat">
                <p>Delete this chat ?</p>
                <button
                  onClick={() => {
                    deleteConvoOnDb(
                      user?.info?.uid,
                      currentDisplayConvoInfo?.uid
                    );
                    setIsConnectedDisplayed(true);
                    userProfile.close(false)
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
  } else {
    return [];
  }
}

export default React.memo(DisplayModal);
