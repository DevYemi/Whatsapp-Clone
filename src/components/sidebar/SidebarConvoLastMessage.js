import { AudiotrackRounded, Check, ImageRounded, MicRounded, VideocamRounded } from '@material-ui/icons';
import React, { useEffect, useState } from 'react'
import { getIfMessageHasBeenReadFromDb } from '../backend/get&SetDataToDb';
import { useStateValue } from '../global-state-provider/StateProvider';

function SidebarChatLastMessage({ lastMessage, isRoom }) {
    const [{ totalUserOnDb }] = useStateValue()
    const [audioFileDuration, setAudioFileDuration] = useState(null)
    const { message, fileType, senderId, receiverId, id } = lastMessage;
    const [lastMessagesUpdated, setIsLastMessagesUpdated] = useState({ ...lastMessage }) // keeps state of last message that has been updated with user current details
    const [isRead, setIsRead] = useState(false); // keeps state if this message has been read

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

    useEffect(() => { // checks if receiver has seen or read this message
        let unsubGetIfMessageHasBeenReadFromDb;
        if (senderId && receiverId && id) {
            unsubGetIfMessageHasBeenReadFromDb = getIfMessageHasBeenReadFromDb(receiverId, senderId, id, setIsRead)
        }
        return () => unsubGetIfMessageHasBeenReadFromDb && unsubGetIfMessageHasBeenReadFromDb();
    }, [senderId, receiverId, id])
    useEffect(() => {
        // get message and updates with the latest users infos
        let lastMessageClone = { ...lastMessage }
        if (lastMessage) {
            let match = totalUserOnDb?.filter(user => user.uid === lastMessage.senderId)[0]
            lastMessageClone.name = match?.name
        }
        setIsLastMessagesUpdated(lastMessageClone);

    }, [totalUserOnDb, lastMessage])

    if (fileType?.type === "text") {
        return (
            <div>
                {isRoom ?
                    <p>{lastMessagesUpdated.name}:</p>
                    : <div className={`check ${isRead && "read"}`}>
                        <Check className="checkIcon" />
                        <Check className="checkIcon" />
                    </div>

                }
                {" "}
                <span>{message}</span>
            </div>
        )
    } else if (fileType?.info?.type === "image") {
        return (
            <div>
                {isRoom ?
                    <p>{lastMessagesUpdated.name}:</p>
                    : <div className={`check ${isRead && "read"}`}>
                        <Check className="checkIcon" />
                        <Check className="checkIcon" />
                    </div>

                }
                <ImageRounded className="img" /> Image
            </div>
        )
    } else if (fileType?.info?.type === "audio") {
        return (
            <div>
                {isRoom ?
                    <p>{lastMessagesUpdated.name}:</p>
                    : <div className={`check ${isRead && "read"}`}>
                        <Check className="checkIcon" />
                        <Check className="checkIcon" />
                    </div>

                }
                <AudiotrackRounded className="audio" /> {audioFileDuration ? `${audioFileDuration.min}:${audioFileDuration.sec}` : "00:00"} Audio
            </div>
        )
    } else if (fileType?.info?.type === "video") {
        return (
            <div>
                {isRoom ?
                    <p>{lastMessagesUpdated.name}:</p>
                    : <div className={`check ${isRead && "read"}`}>
                        <Check className="checkIcon" />
                        <Check className="checkIcon" />
                    </div>

                }
                <VideocamRounded className="video" />{audioFileDuration ? `${audioFileDuration.min}:${audioFileDuration.sec}` : "00:00"} Video
            </div>
        )
    } else if (fileType?.info?.type === "voice-note") {
        return (
            <div>
                {isRoom ?
                    <p>{lastMessagesUpdated.name}:</p>
                    : <div className={`check ${isRead && "read"}`}>
                        <Check className="checkIcon" />
                        <Check className="checkIcon" />
                    </div>

                }
                <MicRounded className="mic" /> {audioFileDuration ? `${audioFileDuration.min}:${audioFileDuration.sec}` : "00:00"} Voice-Note
            </div>
        )
    } else {
        return (
            <></>
        )
    }
}

export default React.memo(SidebarChatLastMessage)
