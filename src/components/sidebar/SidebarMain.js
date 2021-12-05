import React, { useEffect, useState } from 'react'
import '../../styles/sidebarMain.css'
import { Avatar, IconButton } from "@material-ui/core";
import { DonutLarge, Chat, MoreVert, SearchOutlined } from "@material-ui/icons";
import { useStateValue } from "../global-state-provider/StateProvider";
import { getChatsFromDb, getRoomsFromDb, getUserInfoFromDb } from "../backend/get&SetDataToDb";
import Loading from "../common/Loading";
import SidebarConvo from "./SidebarConvo";
import { useHistory } from "react-router-dom";
import { sidebarProfile, sidebarMainHeaderHelp, handleLogOut, handleDarkMode, GreenSwitch } from '../utils/sidebarUtils';

function SidebarMain(props) {
    const {
        setIsFirstRender,
        isFirstRender,
        setIsConnectedDisplayed,
        setOpenModal,
        setModalType,
        isThereInternetConnection,
        setIsConvoSearchBarOpen,
        isConvoSearchBarOpen } = props
    const [rooms, setRooms] = useState(null); // keep state for all the rooms received from db
    const [chats, setChats] = useState(null); // keep state for all ther chat received from db
    const [convos, setConvos] = useState([]); // keeps state for the combination of chat and rooms
    const [isSidebarHeaderHelpOpened, setIsSidebarHeaderHelpOpened] = useState(false); // keeps state if the sidebar help div is opened or not

    const [{ user, isUserOnDarkMode }, dispatch] = useStateValue(); // keeps state for current logged in user
    const [userInfoDb, setUserInfoDb] = useState(); //keeps state of the user info from db
    const urlHistory = useHistory();

    useEffect(() => {
        // adds and remove an eventlistener that closes and open the sidebarMain__headerHelp Div
        const handleListener = (e) => {
            sidebarMainHeaderHelp.handle(e, isConvoSearchBarOpen, isSidebarHeaderHelpOpened, setIsSidebarHeaderHelpOpened)
        }
        document.addEventListener("click", handleListener);
        return () => {
            document.removeEventListener("click", handleListener);
        };
    });

    useEffect(() => {
        // on first render display connectedDisplay component on convo side
        if (isFirstRender) {
            let location = "/home"
            setIsFirstRender(false);
            setIsConnectedDisplayed(true)
            urlHistory.push(location);
        }
    }, [urlHistory, isFirstRender, setIsFirstRender, setIsConnectedDisplayed]);
    useEffect(() => {
        // gets the chat and the room convo
        const unsubcribeRooms = getRoomsFromDb(user?.info.uid, setRooms); // gets all rooms from db on first render
        const unsubcribeUserInfoDb = getUserInfoFromDb(user?.info.uid, setUserInfoDb, false);
        const unsubcribeChats = getChatsFromDb(user?.info.uid, setChats); // gets all chats from db on first render
        return () => {
            unsubcribeRooms();
            unsubcribeChats();
            unsubcribeUserInfoDb();
        };
    }, [user?.info.uid]);
    useEffect(() => {
        // maps current logged in user chat to global state
        dispatch({
            type: "SET_CURRENTLOGGEDINUSERCHATS",
            currentLoggedInUserChats: chats
        })
    }, [chats, dispatch])
    useEffect(() => {
        // makes sure the latest convo show at the up
        if (chats && rooms) {
            let mutedConvos = [...chats, ...rooms].filter((convo) => {
                // filter out convos that has been muted by user
                return convo.data.muted === true;
            });
            let unmutedConvos = [...chats, ...rooms].filter((convo) => {
                // filter out convos that hasnt been muted by user
                return convo.data.muted !== true;
            });
            unmutedConvos.sort(function (x, y) {
                let chat1 = new Date(x?.data?.timestamp?.seconds);
                let chat2 = new Date(y?.data?.timestamp?.seconds);
                return chat2 - chat1;
            });
            setConvos([...unmutedConvos, ...mutedConvos]);
        }
    }, [chats, rooms]);
    useEffect(() => {
        //Map chats to global state
        if (chats) {
            dispatch({
                type: "SET_USERCHATS",
                userChats: chats
            })
        }
    }, [chats, dispatch]);
    return (
        <div className={`sidebarMain ${isUserOnDarkMode && "dark-mode2"}`}>
            <section className={`sidebarMain__header ${isUserOnDarkMode && "dark-mode2"}`}>
                <div onClick={sidebarProfile.show} className="sidebarMain__headerLeft">
                    <Avatar src={userInfoDb?.avi} />
                    <p>{userInfoDb?.phoneNumber}</p>
                </div>
                <div className="sidebarMain__headerRight">
                    <IconButton>
                        <DonutLarge
                            className={`${isUserOnDarkMode && "dark-mode-color3"}`}
                        />
                    </IconButton>
                    <IconButton>
                        <Chat
                            className={`${isUserOnDarkMode && "dark-mode-color3"}`}
                        />
                    </IconButton>
                    <div className="sidebarMain__headerHelpWr">
                        <IconButton onClick={() => sidebarMainHeaderHelp.open(setIsSidebarHeaderHelpOpened)}>
                            <MoreVert
                                className={`${isUserOnDarkMode && "dark-mode-color3"}`}
                            />
                        </IconButton>
                        <div className="sidebarMain__headerHelp" id="sidebarMain__headerHelp">
                            <ul className={`${isUserOnDarkMode && "dark-mode1"}`}>
                                <li>New Group</li>
                                <li>Archived</li>
                                <li> Starred Messages</li>
                                <li>Settings</li>
                                <li onClick={() => handleLogOut(user, dispatch)}>Log out</li>
                                <li onClick={() => handleDarkMode(user, !isUserOnDarkMode)}>
                                    <span>Dark Mode</span>
                                    <GreenSwitch
                                        checked={isUserOnDarkMode}
                                        onChange={() => handleDarkMode(user, !isUserOnDarkMode)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    /></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className={`sidebarMain__search ${isUserOnDarkMode && "dark-mode1"}`}>
                <div className={`sidebarMain__searchContainer ${isUserOnDarkMode && "dark-mode2"}`}>
                    <SearchOutlined />
                    <input type="text" placeholder="Search or start a new group" />
                </div>
            </section>
            <section className={`sidebarMain__convos  ${isUserOnDarkMode && "dark-mode2"}`}>
                <SidebarConvo
                    addNewConvo
                    setOpenModal={setOpenModal}
                    setModalType={setModalType} />
                {!isThereInternetConnection ?
                    <h4>
                        Connection can't be established, please check you internet connection
                    </h4>
                    : convos.length > 0 ? (
                        convos.map((convo) => (
                            <SidebarConvo
                                key={convo.id}
                                convoId={convo.id}
                                isRoom={convo.data.isRoom}
                                setIsConnectedDisplayed={setIsConnectedDisplayed}
                                setOpenModal={setOpenModal}
                                setModalType={setModalType}
                                setIsConvoSearchBarOpen={setIsConvoSearchBarOpen}
                            />
                        ))
                    ) : (
                        <Loading
                            size={40}
                            type={"ThreeDots"}
                            visible={convos.length > 0 ? "Hide" : "Show"}
                            color={"#00BFA5"}
                            classname={"sidebarMain__loading"}
                        />
                    )}
            </section>
        </div>
    );
}

export default SidebarMain
