import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import TextField from '@material-ui/core/TextField';
import '../styles/modal.css'

const useStylesTextField = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

function DisplayModal(props) {
    const { modalType, bgStyles, openModal, add, setOpenModal, setModalInput, modalInput } = props
    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            backgroundImage: bgStyles.url,
            backgroundRepeat: "no-repeat",
            backgroundPosition: bgStyles.position,
            backgroundSize: bgStyles.size,
            padding: theme.spacing(2, 4, 3),
        },
    }));
    const classes = useStyles();
    const classesTextField = useStylesTextField()
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
                                    error={modalInput ? (isValidPhoneNumber(modalInput) ? undefined : 'Invalid phone number') : 'Phone number required'}
                                    onChange={setModalInput} />
                                <button onClick={() => { add.chat(); handleClose() }}>Add Contact</button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        )
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
                                <form className={classesTextField.root} noValidate autoComplete="off">
                                    <TextField
                                        value={modalInput}
                                        id="outlined-room-input"
                                        label="Room Name"
                                        onChange={e => setModalInput(e.target.value)}
                                        type="text"
                                        variant="outlined"
                                    />
                                </form>
                                <button onClick={() => { add.room(); handleClose(add.room) }}>Create Room</button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        )
    }
}

export default React.memo(DisplayModal) 
