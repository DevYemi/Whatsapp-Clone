import React from 'react'
import { userprofileSidebar as animate } from "../../utils/userProfileUtils";
import { ArrowBack } from '@material-ui/icons';
import { useStateValue } from '../../global-state-provider/StateProvider';
function UpsbStarMessage() {
    const [{ isUserOnDarkMode }] = useStateValue();
    return (
        <div className="UPSB_starMessage">
            <div className={`UPSB_starMessage__header ${isUserOnDarkMode && "dark-mode2"}`}>
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Starred messages</p>
                </div>
            </div>
            <div className={`UPSB_starMessage__body ${isUserOnDarkMode && "dark-mode1"}`}>
                <p>No starred message</p>
            </div>
        </div>
    )
}

export default UpsbStarMessage;
