import { Avatar, Checkbox } from '@material-ui/core'
import React, { useState } from 'react'

function ModalAddParticipant() {
    const [isChecked, setIsChecked] = useState(false);
    return (
        <div className="member">
            <Checkbox
                checked={isChecked}
                style={{ color: "#009688" }}
                onChange={() => setIsChecked(!isChecked)}
                inputProps={{ "aria-label": "primary checkbox" }}
            />
            <Avatar />
            <div className="memberInfo">
                <p className="memberName">Adeyanju Adeyemi</p>
                <p className="memberAbout">Hey there i'm using whatapp</p>
            </div>
        </div>
    )
}

export default ModalAddParticipant
