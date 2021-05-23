import { AudiotrackRounded, ImageRounded, MicRounded, VideocamRounded } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'

function SidebarChatLastMessage({ lastMessage }) {
    const [audioFileDuration, setAudioFileDuration] = useState(null)
    const { message, fileType, } = lastMessage;
    useEffect(() => { // sets the duration of the file if its audio, voice-note or video
        const getSec = (d) => {
            let sec = Math.floor(d % 3600 % 60)
            if (sec > 9) {
                return sec
            } else {
                return `0${sec}`
            }

        }
        const getMin = (d) => {
            let min = Math.floor(d % 3600 / 60)
            if (min > 9) {
                return min
            } else {
                return `0${min}`
            }
        }
        if (fileType?.info?.type === "audio") {
            let newAudio = new Audio(fileType?.url)
            newAudio.setAttribute("preload", "metadata");
            newAudio.onloadedmetadata = function () {
                let min = getMin(newAudio.duration);
                let sec = getSec(newAudio.duration);
                setAudioFileDuration({ min, sec })
            };
        } else if (fileType?.info?.type === "voice-note") {
            let min = fileType.info.min
            let sec = fileType.info.sec
            setAudioFileDuration({ min, sec });
        }
        else if (fileType?.info?.type === "video") {
            var v = document.createElement("video");
            v.setAttribute("src", fileType?.url);
            v.setAttribute("preload", "metadata");
            v.onloadedmetadata = function () {
                let min = getMin(v.duration);
                let sec = getSec(v.duration);
                setAudioFileDuration({ min, sec });
            }
        }
    }, [lastMessage, fileType?.info?.type, fileType?.url, fileType?.info?.min, fileType?.info?.sec])

    if (fileType?.type === "text") {
        return (
            <p>{message}</p>
        )
    } else if (fileType?.info?.type === "image") {
        return (
            <p><ImageRounded className="img" /></p>
        )
    } else if (fileType?.info?.type === "audio") {
        return (
            <p><AudiotrackRounded className="audio" /> {audioFileDuration ? `${audioFileDuration.min}:${audioFileDuration.sec}` : "00:00"}</p>
        )
    } else if (fileType?.info?.type === "video") {
        return (
            <p><VideocamRounded className="video" />{audioFileDuration ? `${audioFileDuration.min}:${audioFileDuration.sec}`: "00:00"}</p>
        )
    } else if (fileType?.info?.type === "voice-note") {
        return (
            <p><MicRounded className="mic" /> {audioFileDuration ? `${audioFileDuration.min}:${audioFileDuration.sec}` : "00:00"}</p>
        )
    } else {
        return (
            <p> chat is currently empty</p>
        )
    }
}

export default React.memo(SidebarChatLastMessage)  
