import React from 'react'
import {ArrowBack} from '@material-ui/icons';
import "./../styles/userProfileSideBar.css"

function UserProfileSideBar(props) {
    const {upSidebarType}= props
    if (upSidebarType === "STARRED-MESSAGE") {
        return (
            <div className="userProfileSidebar__wr">
                <div className="UPSB_starMessage">
                    <div className="UPSB_starMessage__header">
                        <div>
                        <ArrowBack />
                        <p>Starred messages</p>
                        </div>
                    </div>
                    <div className="UPSB_starMessage__body">
                        <p>No starred message</p>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default UserProfileSideBar
