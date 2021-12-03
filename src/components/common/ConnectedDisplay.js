import React from 'react'
import "../../styles/connectedDisplay.css"
import { LaptopMacRounded } from '@material-ui/icons';
import { useStateValue } from '../global-state-provider/StateProvider';

function ConnectedDisplay() {
    const [{ isUserOnDarkMode }] = useStateValue()
    return (
        <div className={`connectedDisplay ${isUserOnDarkMode ? "dark" : "light"}`}>
            <div className="connectedDisplay_wr">
                <img className={`${isUserOnDarkMode ? "dark" : "light"}`} src="/img/whatapp-intro.jpg" alt="phone-connected" />
                <h1 className={`${isUserOnDarkMode && "dark-mode-color1"}`}>
                    Keep your phone connected
                </h1>
                <p className={`${isUserOnDarkMode && "dark-mode-color1"}`}>
                    WhatsApp connects to your phone to sync messages. To reduce data usage, connect your phone to a Wi-Fi
                </p>
                <div>
                    <LaptopMacRounded />
                    <p className={`${isUserOnDarkMode && "dark-mode-color1"}`}>
                        WhatsApp is available for windows. <a href="https://www.whatsapp.com/download">Get it here</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConnectedDisplay
