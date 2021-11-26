import React from 'react'
import "../../../styles/userProfileSideBar.css"
import UpsbDisappearingMessage from './UpsbDisappearingMessage'
import UpsbMediaDocs from './UpsbMediaDocs'
import UpsbStarMessage from './UpsbStarMessage'


function UserProfileSideBar(props) {
    const { upSidebarType, imgMssgAll } = props
    return (
        <div className="userProfileSidebar__wr">
            {upSidebarType === "STARRED-MESSAGE" ?
                <UpsbStarMessage />
                : upSidebarType === 'DISAPPEARING-MESSAGE' ?
                    <UpsbDisappearingMessage />
                    : <UpsbMediaDocs imgMssgAll={imgMssgAll} />
            }

        </div>
    )
}

export default UserProfileSideBar
