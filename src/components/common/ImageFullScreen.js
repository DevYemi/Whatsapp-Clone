import React from 'react'
import { IconButton } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons'
import '../../styles/imageFullScreen.css'
import { closeImageOnFullScreen } from '../utils/imageFullScreenUtils';

function ImageFullScreen({ imageFullScreen, setImageFullScreen }) {

    return (
        <div className={`imageFullScreen ${imageFullScreen.isFullScreen && "show"}`}>
            <div className={`imageFullScreen_wr`}>
                <IconButton onClick={() => closeImageOnFullScreen(setImageFullScreen)}>
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
