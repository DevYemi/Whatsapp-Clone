import React from 'react'
import { userprofileSidebar as animate } from "../../utils/userProfileUtils";
import { ArrowBack } from '@material-ui/icons';
import { useStateValue } from '../../global-state-provider/StateProvider';

function UpsbDisappearingMessage() {
    const [{ isUserOnDarkMode }] = useStateValue();
    return (
        <div className="UPSB_disappearingMessage">
            <div className={`UPSB_disappearingMessage__header ${isUserOnDarkMode && "dark-mode2"}`}>
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Disappearing messages</p>
                </div>
            </div>
            <div className={`UPSB_disappearingMessage__body ${isUserOnDarkMode && "dark-mode1"}`}>
                <p>Feature Not Supported</p>
            </div>
        </div>
    )
}

export default UpsbDisappearingMessage
