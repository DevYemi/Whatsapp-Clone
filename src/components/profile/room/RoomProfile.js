import React, { useEffect, useState } from "react";
import { isConvoMutedOnDb } from "../../backend/get&SetDataToDb";
import { useStateValue } from "../../global-state-provider/StateProvider";
import RoomProfileMain from "./RoomProfileMain";
import RoomProfileSideBar from "./RoomProfileSideBar";




function RoomProfile(props) {
    const { setOpenModal, setModalType, setIsRoom, isConnectedDisplayed, isFirstRender, setImageFullScreen } = props;
    const [{ user, currentDisplayConvoInfo, currentDisplayedConvoMessages, isMuteNotifichecked }, disptach,] = useStateValue(); // keeps state for current logged in user
    const [imgMssgPreview, setImgMssgPreview] = useState([]); // keeps state for the 3 images that will be previewed on the chat profile
    const [imgMssgAll, setImgMssgAll] = useState([]); // keeps state of current displayed convo message that are of image type
    const [upSidebarType, setUpSidebarType] = useState("STARRED-MESSAGE");
    useEffect(() => {
        // on first render get all the messages of the current displayed convo and map out the img messages into state
        let imgMssgArrAll = [];
        let imgMssgArrPreview = [];
        if (currentDisplayedConvoMessages?.length > 0) {
            for (let i = 0; i < currentDisplayedConvoMessages.length; i++) { // get only the 3 images for the chat media preview
                const mssg = currentDisplayedConvoMessages[i];
                if (mssg?.fileType?.info?.type === "image") {
                    imgMssgArrPreview.unshift({ ...mssg.fileType, mssg: mssg.message })

                }
                if (imgMssgArrPreview.length === 3) i = currentDisplayedConvoMessages.length + 1
            }
            currentDisplayedConvoMessages.forEach(mssg => { // gets all the image messages
                if (mssg?.fileType?.info?.type === "image") {
                    imgMssgArrAll.push({ ...mssg.fileType, mssg: mssg.message })
                }
            })
            setImgMssgAll(imgMssgArrAll);
            setImgMssgPreview(imgMssgArrPreview);
        }
    }, [currentDisplayedConvoMessages])

    useEffect(() => {
        // checks if the current chat has been muted before
        if (user?.info?.uid && currentDisplayConvoInfo?.roomId) {
            isConvoMutedOnDb(user?.info?.uid, currentDisplayConvoInfo?.roomId, true, disptach);
        }
    }, [isMuteNotifichecked, disptach, user, currentDisplayConvoInfo]);
    return (
        <div className={`roomProfile__wr ${(isFirstRender || isConnectedDisplayed) && "hide"}`}>
            <RoomProfileMain
                setOpenModal={setOpenModal}
                setModalType={setModalType}
                setIsRoom={setIsRoom}
                setUpSidebarType={setUpSidebarType}
                imgMssgPreview={imgMssgPreview}
                setImageFullScreen={setImageFullScreen}
            />
            <RoomProfileSideBar
                imgMssgAll={imgMssgAll}
                upSidebarType={upSidebarType}
                setImageFullScreen={setImageFullScreen}
            />

        </div>
    );
}

export default React.memo(RoomProfile);

