import React, { useEffect, useState } from "react";
import "../../styles/sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import { DonutLarge, Chat, MoreVert, SearchOutlined } from "@material-ui/icons";
import { useStateValue } from "../global-state-provider/StateProvider";
import {
  getChatsFromDb,
  getRoomsFromDb,
  getUserInfoFromDb,
} from "../backend/get&SetDataToDb";
import Loading from "../common/Loading";
import SidebarConvo from "./SidebarConvo";
import { useHistory } from "react-router-dom";

function Sidebar(props) {
  const { setIsFirstRender, isFirstRender, setIsConnectedDisplayed } = props
  const [rooms, setRooms] = useState(null); // keep state for all the rooms received from db
  const [chats, setChats] = useState(null); // keep state for all ther chat received from db
  const [convos, setConvos] = useState([]); // keeps state for the combination of chat and rooms
  const [{ user, }] = useStateValue(); // keeps state for current logged in user
  const [userInfoDb, setUserInfoDb] = useState(); //keeps state of the user info from db
  const urlHistory = useHistory();
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
    const unsubcribeUserInfoDb = getUserInfoFromDb(
      user?.info.uid,
      setUserInfoDb,
      false
    );
    const unsubcribeChats = getChatsFromDb(user?.info.uid, setChats); // gets all chats from db on first render
    return () => {
      unsubcribeRooms();
      unsubcribeChats();
      unsubcribeUserInfoDb();
    };
  }, [user?.info.uid]);
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
  return (
    <div className="sidebar">
      <section className="sidebar__header">
        <div className="sidebar__headerLeft">
          <Avatar src={userInfoDb?.avi} />
          <p>{userInfoDb?.phoneNumber}</p>
        </div>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </section>
      <section className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input type="text" placeholder="Search or start a new group" />
        </div>
      </section>
      <section className="sidebar__convos">
        <SidebarConvo addNewConvo />
        {convos.length > 0 ? (
          convos.map((convo) => (
            <SidebarConvo
              key={convo.id}
              convoId={convo.id}
              name={convo.data.name}
              isRoom={convo.data.isRoom}
              setIsConnectedDisplayed={setIsConnectedDisplayed}
            />
          ))
        ) : (
          <Loading
            size={40}
            visible={convos.length > 0 ? "Hide" : "Show"}
            color={"#00BFFF"}
            classname={"sidebar__loading"}
          />
        )}
      </section>
    </div>
  );
}

export default React.memo(Sidebar);
