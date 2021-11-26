import React from "react";
import "../../styles/sidebar.css";
import SidebarMain from "./SidebarMain";
import SidebarProfile from "./SidebarProfile";

function Sidebar(props) {
  const { setIsFirstRender, isFirstRender, setIsConnectedDisplayed } = props

  return (
    <div className="sidebar">
      <SidebarMain
        setIsFirstRender={setIsFirstRender}
        isFirstRender={isFirstRender}
        setIsConnectedDisplayed={setIsConnectedDisplayed}
      />
      <SidebarProfile />
    </div>
  )

}

export default React.memo(Sidebar);
