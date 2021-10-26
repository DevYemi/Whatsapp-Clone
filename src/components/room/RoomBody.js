import React from 'react'
import Message from '../common/Message';

function RoomBody(props) {
    const { messages, setImageFullScreen } = props
    return (
        <section className="room__body">
            {messages.map((message, index) => (
                <Message key={index}
                    convo={message}
                    setImageFullScreen={setImageFullScreen} />
            ))}
        </section>
    )
}

export default React.memo(RoomBody)
