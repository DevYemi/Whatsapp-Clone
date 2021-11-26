import React from 'react'
import { userprofileSidebar as animate } from "../../utils/userProfileUtils";
import { ArrowBack } from '@material-ui/icons';

function UpsbDisappearingMessage() {
    return (
        <div className="UPSB_disappearingMessage">
            <div className="UPSB_disappearingMessage__header">
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Disappearing messages</p>
                </div>
            </div>
            <div className="UPSB_disappearingMessage__body">
                <p>Feature Not Supported</p>
            </div>
        </div>
    )
}

export default UpsbDisappearingMessage
