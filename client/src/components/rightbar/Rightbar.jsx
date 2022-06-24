import "./rightbar.css";
import { classNames } from "../../util/classNames";
import { ProfileRightbar } from "./ProfileRightbar";
import { HomeRightbar } from "./HomeRightbar";

const Rightbar = ({ profile, profileUser, user: loggedInUser }) => {
  return (
    <div className={classNames(profile ? "rightbarProfile" : "rightbar")}>
      <div className="rightbarWrapper">
        {profile ? (
          <ProfileRightbar
            profileUser={profileUser}
            loggedInUser={loggedInUser}
          />
        ) : (
          <HomeRightbar />
        )}
      </div>
    </div>
  );
};

export default Rightbar;
