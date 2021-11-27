import { ArrowBack } from '@material-ui/icons'
import React from 'react'
import { roomProfileSidebar as animate } from '../../utils/roomProfileUtils'

function RpsbStarMessage() {
    return (
        <div className="RPSB_starMessage">
            <div className="RPSB_starMessage__header">
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Starred messages</p>
                </div>
            </div>
            <div className="RPSB_starMessage__body">
                <p>No starred message</p>
            </div>
        </div>
    )
}

export default RpsbStarMessage
