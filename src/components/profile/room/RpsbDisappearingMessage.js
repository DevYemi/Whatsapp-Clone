import { ArrowBack } from '@material-ui/icons'
import React from 'react'
import { useStateValue } from '../../global-state-provider/StateProvider';
import { roomProfileSidebar as animate } from '../../utils/roomProfileUtils'

function RpsbDisappearingMessage() {
    const [{ isUserOnDarkMode }] = useStateValue();

    return (
        <div className="RPSB_disappearingMessage">
            <div className={`RPSB_disappearingMessage__header ${isUserOnDarkMode && "dark-mode2"}`}>
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Disappearing messages</p>
                </div>
            </div>
            <div className={`RPSB_disappearingMessage__body ${isUserOnDarkMode && "dark-mode1"}`}>
                <p>Feature Not Supported</p>
            </div>
        </div>
    )
}

export default RpsbDisappearingMessage
