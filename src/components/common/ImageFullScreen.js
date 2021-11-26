import React from 'react'
import { IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons'
import '../../styles/imageFullScreen.css'

function ImageFullScreen({ imageFullScreen, setImageFullScreen }) {
    const closeImageOnFullScreen = () => { // close image on full when a user clicks the cancel icon
        setImageFullScreen({ isFullScreen: false });
    }
    return (
        <div className={`imageFullScreen ${imageFullScreen.isFullScreen && "show"}`}>
            <div className={`imageFullScreen_wr`}>
                <IconButton onClick={closeImageOnFullScreen}>
                    <CloseRounded />
                </IconButton>
                <div className="imageFullScreenDivWrap">
                    <img src={imageFullScreen.url} alt="" />
                    <span className="imageFullScreenCaption">{imageFullScreen.caption}</span>
                </div>
            </div>
        </div>
    )
}

export default ImageFullScreen
