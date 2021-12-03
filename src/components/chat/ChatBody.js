
import React, { useEffect, useState } from 'react'
import Loading from '../common/Loading';
import Message from '../common/Message';
import { useStateValue } from '../global-state-provider/StateProvider';

function ChatBody(props) {
    const { messages, setImageFullScreen, isChatBeingCleared } = props
    const [messagesClone, setMessagesClone] = useState([]);
    const [{ totalUserOnDb, isUserOnDarkMode }] = useStateValue();

    useEffect(() => {
        // gets all messages and updates with the latest users infos
        if (messages.length > 0) {
            let updatedMessage = messages.map((mssg, mssgIndex) => {
                let match = totalUserOnDb.filter(user => user.uid === mssg.senderId)[0]
                mssg.name = match?.name
                if (mssg?.fileType?.info?.avi) mssg.fileType.info.avi = match?.avi
                return mssg
            });
            setMessagesClone(updatedMessage)
        }
    }, [messages, totalUserOnDb])
    return (
        <section className={`chat__body ${isUserOnDarkMode && "dark-mode-bgImg"}`}>
            {messagesClone.length > 0 &&
                messagesClone.map((message, index) => (
                    <Message key={index}
                        convo={message}
                        setImageFullScreen={setImageFullScreen} />
                ))
            }
            {isChatBeingCleared &&
                <Loading
                    size={45}
                    type={"Oval"}
                    visible={isChatBeingCleared ? "Hide" : "Show"}
                    color={"#00BFA5"}
                    classname={"chatBody__loading"}
                />

            }
        </section>
    )
}

export default React.memo(ChatBody)
