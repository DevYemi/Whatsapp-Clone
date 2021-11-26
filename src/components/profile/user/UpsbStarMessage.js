import React from 'react'
import { userprofileSidebar as animate } from "../../utils/userProfileUtils";
import { ArrowBack } from '@material-ui/icons';
function UpsbStarMessage() {
    return (
        <div className="UPSB_starMessage">
            <div className="UPSB_starMessage__header">
                <div onClick={animate.close}>
                    <ArrowBack />
                    <p>Starred messages</p>
                </div>
            </div>
            <div className="UPSB_starMessage__body">
                <p>No starred message</p>
            </div>
        </div>
    )
}

export default UpsbStarMessage;
