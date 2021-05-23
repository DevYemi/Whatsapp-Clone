import React, { useEffect, useState } from "react";
import { CloseRounded,ArrowForwardIos } from "@material-ui/icons";
import "./../styles/userProfile.css";
import { Avatar } from "@material-ui/core";
import { useStateValue } from "./StateProvider";
import { getUserInfoFromDb } from "./get&SetDataToDb";
function UserProfile() {
  const [{ user }] = useStateValue(); // keeps state for current logged in user
  const [userInfoDb, setUserInfoDb] = useState(); //keeps state of the user info from db
  useEffect(() => {
    // gets the chat and the room convo
    const unsubcribeUserInfoDb = getUserInfoFromDb(
      user?.info.uid,
      setUserInfoDb
    );
    return () => {
      unsubcribeUserInfoDb();
    };
  }, [user?.info.uid]);
  return (
    <div className="userProfile__wr">
      <div className="userProfile__header">
        <CloseRounded />
        <p>Contact Info</p>
      </div>
      <div className="userProfile__body">
        <section className="userProfileBody__sec1">
          <Avatar src={userInfoDb?.avi} />
          <div>
              <p>+2348141996643</p>
              <p>~ Black Ye Mi</p>
          </div>
        </section>
        <section className="userProfileBody__sec2">
        <div className="userProfileBody__sec2Info">
            <p>Media, Links and Docs</p>
            <ArrowForwardIos />
        </div>
        <p>
            No Media, Links and Docs
        </p>
        <div className="userProfileBody__sec2Doc">

        </div>

        </section>
        <section className="userProfileBody__sec3"></section>
      </div>
    </div>
  );
}

export default UserProfile;
