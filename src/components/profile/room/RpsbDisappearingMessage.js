import { ArrowBack } from '@material-ui/icons'
import React from 'react'
import { roomProfileSidebar as animate } from '../../utils/roomProfileUtils'

function RpsbDisappearingMessage() {
    return (
        <div className="RPSB_disappearingMessage">
            <div className="RPSB_disappearingMessage__header">
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Disappearing messages</p>
                </div>
            </div>
            <div className="RPSB_disappearingMessage__body">
                <p>Feature Not Supported</p>
            </div>
        </div>
    )
}

export default RpsbDisappearingMessage
