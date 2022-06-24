import React from "react";
import "./closeFriend.css";

const CloseFriend = ({ user }) => {
  return (
    <li className="leftbarFriend">
      <img
        className="leftbarFriendImg"
        src={`../../${user.profilePicture}`}
        alt=""
      />
      <span className="leftbarFriendName">{user.username}</span>
    </li>
  );
};

export default CloseFriend;
