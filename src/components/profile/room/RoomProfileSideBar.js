import React from 'react'
import RpsbDisappearingMessage from './RpsbDisappearingMessage'
import RpsbMediaDocs from './RpsbMediaDocs'
import RpsbStarMessage from './RpsbStarMessage'
import '../../../styles/roomProfileSideBar.css'

function RoomProfileSideBar(props) {
    const { upSidebarType, imgMssgAll } = props
    return (
        <div className="roomProfileSidebar__wr">
            {upSidebarType === "STARRED-MESSAGE" ?
                <RpsbStarMessage />
                : upSidebarType === 'DISAPPEARING-MESSAGE' ?
                    <RpsbDisappearingMessage />
                    : <RpsbMediaDocs imgMssgAll={imgMssgAll} />
            }

        </div>
    )
}

export default RoomProfileSideBar
