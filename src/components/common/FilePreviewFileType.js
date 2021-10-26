import { SentimentDissatisfiedRounded } from '@material-ui/icons'
import React from 'react'

function FilePreviewFileType({ fileOnPreview }) { // gets the type of file to be previewed e.g image, audio, video
    if (fileOnPreview?.info?.type === "image") {
        return (
            <div className="filePreviewImage">
                <div>
                    <img src={fileOnPreview?.url} alt="filePreview" />
                </div>
            </div>
        )
    }
    if (fileOnPreview?.info?.type === "audio") {
        return (
            <div className="filePreviewAudio">
                <div>
                    <audio controls src={fileOnPreview?.url} />
                </div>
            </div>
        )
    }
    if (fileOnPreview?.info?.type === "video") {
        return (
            <div className="filePreviewVideo">
                <div>
                    <video controls src={fileOnPreview?.url} />
                </div>
            </div>
        )
    } else {
        return (
            <div className="filePreviewNotSupported">
                <div>
                    <h3>The file type you selected is not supported <SentimentDissatisfiedRounded /></h3>
                </div>
            </div>
        )
    }

}

export default React.memo(FilePreviewFileType)  
