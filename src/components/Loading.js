import Loader from 'react-loader-spinner'
import React from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

function Loading(props) {
    const { size, color, classname, visible} = props
    return (
        <Loader
            visible={visible}
            type="ThreeDots"
            color={color}
            height={size}
            width={size}
            className={classname}
        />
    )
}

export default React.memo(Loading)  
