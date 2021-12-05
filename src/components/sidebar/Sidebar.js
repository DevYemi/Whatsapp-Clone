import React from "react";
import "../../styles/sidebar.css";
import SidebarMain from "./SidebarMain";
import SidebarProfile from "./SidebarProfile";

function Sidebar(props) {
  const {
    setIsFirstRender,
    isFirstRender,
    setIsConnectedDisplayed,
    setOpenModal,
    setModalType,
    setIsConvoSearchBarOpen,
    isThereInternetConnection,
    isConvoSearchBarOpen } = props

  return (
    <div className="sidebar">
      <SidebarMain
        setOpenModal={setOpenModal}
        setModalType={setModalType}
        setIsFirstRender={setIsFirstRender}
        isFirstRender={isFirstRender}
        setIsConnectedDisplayed={setIsConnectedDisplayed}
        isConvoSearchBarOpen={isConvoSearchBarOpen}
        setIsConvoSearchBarOpen={setIsConvoSearchBarOpen}
        isThereInternetConnection={isThereInternetConnection}
      />
      <SidebarProfile />
      <p className="sidebar_online">Online</p>
      <p className="sidebar_offline">Offline, connection lost</p>
    </div>
  )

}

export default React.memo(Sidebar);
