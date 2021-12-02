import { SentimentDissatisfiedRounded } from '@material-ui/icons'
import React from 'react'

function FilePreviewFileType({ fileOnPreview, isFileSupported, isFileTooBig }) { // gets the type of file to be previewed e.g image, audio, video
    if (isFileTooBig) {
        return (
            <div className="filePreviewIsTooBig">
                <div>
                    <h3>File is Too Big, "File bigger than 15mb isn't supported" <SentimentDissatisfiedRounded /></h3>
                </div>
            </div>
        )
    }
    else if (!isFileSupported) {
        return (
            <div className="filePreviewNotSupported">
                <div>
                    <h3>The file type you selected is not supported <SentimentDissatisfiedRounded /></h3>
                </div>
            </div>
        )
    }
    else if (fileOnPreview?.info?.type === "image") {
        return (
            <div className="filePreviewImage">
                <div>
                    <img src={fileOnPreview?.url} alt="filePreview" />
                </div>
            </div>
        )
    }
    else if (fileOnPreview?.info?.type === "audio") {
        return (
            <div className="filePreviewAudio">
                <div>
                    <audio controls src={fileOnPreview?.url} />
                </div>
            </div>
        )
    }
    else if (fileOnPreview?.info?.type === "video") {
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
