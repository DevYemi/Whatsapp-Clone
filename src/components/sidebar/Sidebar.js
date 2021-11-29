import React from "react";
import "../../styles/sidebar.css";
import SidebarMain from "./SidebarMain";
import SidebarProfile from "./SidebarProfile";

function Sidebar(props) {
  const { setIsFirstRender, isFirstRender, setIsConnectedDisplayed, setOpenModal, setModalType } = props
  console.log("sidebar");

  return (
    <div className="sidebar">
      <SidebarMain
        setOpenModal={setOpenModal}
        setModalType={setModalType}
        setIsFirstRender={setIsFirstRender}
        isFirstRender={isFirstRender}
        setIsConnectedDisplayed={setIsConnectedDisplayed}
      />
      <SidebarProfile />
    </div>
  )

}

export default React.memo(Sidebar);
