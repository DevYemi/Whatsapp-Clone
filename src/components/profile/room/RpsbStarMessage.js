import { ArrowBack } from '@material-ui/icons'
import React from 'react'
import { useStateValue } from '../../global-state-provider/StateProvider';
import { roomProfileSidebar as animate } from '../../utils/roomProfileUtils'

function RpsbStarMessage() {
    const [{ isUserOnDarkMode }] = useStateValue();
    return (
        <div className="RPSB_starMessage">
            <div className={`RPSB_starMessage__header ${isUserOnDarkMode && "dark-mode2"}`}>
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Starred messages</p>
                </div>
            </div>
            <div className={`RPSB_starMessage__body ${isUserOnDarkMode && "dark-mode1"}`}>
                <p>No starred message</p>
            </div>
        </div>
    )
}

export default RpsbStarMessage
