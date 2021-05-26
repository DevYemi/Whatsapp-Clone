import React, { useEffect, useState } from "react";
import {
  CloseRounded,
  ArrowForwardIos,
  Block,
  ThumbDown,
  Delete,
} from "@material-ui/icons";
import "./../styles/userProfile.css";
import { Avatar } from "@material-ui/core";
import { useStateValue } from "./StateProvider";
import Checkbox from "@material-ui/core/Checkbox";
import gsap from "gsap/gsap-core";
import { isConvoMutedOnDb } from "./get&SetDataToDb";
function UserProfile(props) {
  const {setOpenModal, setModalType, setIsRoom} = props
  const [{ user, currentDisplayConvoInfo, isMuteNotifichecked }, disptach] = useStateValue(); // keeps state for current logged in user

  const handleChange = (type) => {
    setOpenModal(true);
    setModalType(type);
    setIsRoom(false);

  };
  useEffect(() => {
    // checks if the current chat has been muted before
    if (user?.info?.uid && currentDisplayConvoInfo?.uid) {
      isConvoMutedOnDb(
        user?.info?.uid,
        currentDisplayConvoInfo?.uid,
        false,
        disptach
      );
    }
  }, [
    isMuteNotifichecked,
    disptach,
    user?.info?.uid,
    currentDisplayConvoInfo?.uid,
  ]);
  return (
    <div className="userProfile__wr">
      <div className="userProfile__header">
        <CloseRounded onClick={userProfile.close} />
        <p>Contact Info</p>
      </div>
      <div className="userProfile__body">
        <section className="userProfileBody__sec1">
          <Avatar src={currentDisplayConvoInfo?.avi} />
          <div>
            <p>{currentDisplayConvoInfo?.phoneNumber}</p>
            <p>~ {currentDisplayConvoInfo?.name}</p>
          </div>
        </section>
        <section className="userProfileBody__sec2">
          <div className="userProfileBody__sec2Info">
            <p>Media, Links and Docs</p>
            <ArrowForwardIos />
          </div>
          <p>No Media, Links and Docs</p>
          <div className="userProfileBody__sec2Doc"></div>
        </section>
        <section className="userProfileBody__sec3">
          <div className="muteNotifi">
            <p>Mute Notification</p>
            <div>
              <Checkbox
                checked={isMuteNotifichecked}
                style={{
                  color: "green",
                }}
                onChange={()=> handleChange("MUTE__CONVO")}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            </div>
          </div>
          <div className="starMessg">
            <p>Starred Messages</p>
            <ArrowForwardIos />
          </div>
          <div className="disappearingMessg">
            <p>
              <span>Disappearing Messages</span>
              <span>Off</span>
            </p>
            <ArrowForwardIos />
          </div>
        </section>
        <section className="userProfileBody__sec4">
          <p>About and Phone Number</p>
          <p>Hey there! i'm using whatsapp</p>
          <p>+234 **** *****</p>
        </section>
        <section className="userProfileBody__sec5">
          <Block />
          <p>Block</p>
        </section>
        <section className="userProfileBody__sec6">
          <ThumbDown />
          <p>Report Contact</p>
        </section>
        <section className="userProfileBody__sec7">
          <Delete />
          <p>Delete Chat</p>
        </section>
      </div>
    </div>
  );
}

export default UserProfile;
export const userProfile = {
  open: function () {
    let userProfile = gsap.timeline({
      defaults: { duration: 1, ease: "power4" },
    });
    userProfile
      .to(".userProfile__wr", { flex: 0.35 })
      .to(
        ".userProfile__body",
        { duration: 0.5, stagger: 1, opacity: 1, marginTop: 0 },
        ">-0.7"
      );
  },
  close: function () {
    gsap.to(".userProfile__wr", { duration: 0.5, flex: 0 });
    gsap.to(".userProfile__body", { opacity: 0, marginTop: "-30px" });
  },
};
