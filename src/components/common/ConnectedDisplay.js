import React from 'react'
import "../../styles/connectedDisplay.css"
import { LaptopMacRounded } from '@material-ui/icons';

function ConnectedDisplay() {
    return (
        <div className="connectedDisplay">
            <div className="connectedDisplay_wr">
                <img src="/img/whatapp-intro.jpg" alt="phone-connected" />
                <h1>Keep your phone connected</h1>
                <p>WhatsApp connects to your phone to sync messages. To reduce data usage, connect your phone to a Wi-Fi</p>
                <div>
                    <LaptopMacRounded />
                    <p>
                        WhatsApp is available for windows. <a href="https://www.whatsapp.com/download">Get it here</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConnectedDisplay
