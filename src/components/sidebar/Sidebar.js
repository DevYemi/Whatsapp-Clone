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
      />
      <SidebarProfile />
    </div>
  )

}

export default React.memo(Sidebar);
