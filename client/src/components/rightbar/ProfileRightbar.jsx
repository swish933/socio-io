import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUserLoading } from "../../slices/profile";
import { follow, unfollow } from "../../slices/user";
import { FollowButton, UnfollowButton } from "./buttons/Buttons";
import "./rightbar.css";

export const ProfileRightbar = ({ profileUser, loggedInUser }) => {
  const loadingUser = useSelector(selectUserLoading);
  const dispatch = useDispatch();
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    setFollowing(loggedInUser?.followings?.includes(profileUser?._id));
  }, [loggedInUser, profileUser]);

  const handleFollow = () => {
    setFollowing(!following);
    dispatch(follow(profileUser._id));
  };

  const handleUnfollow = () => {
    setFollowing(!following);
    dispatch(unfollow(profileUser._id));
  };

  return (
    <>
      <h4 className="rightbarTitle">User information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">City:</span>
          <span className="rightbarInfoValue">New York</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">From:</span>
          <span className="rightbarInfoValue">Madrid</span>
        </div>
        <div className="rightbarInfoItem">
          <span className="rightbarInfoKey">Relationship:</span>
          <span className="rightbarInfoValue">Single</span>
        </div>

        {profileUser?._id !== loggedInUser?._id && !loadingUser ? (
          following ? (
            <UnfollowButton unfollow={handleUnfollow} />
          ) : (
            <FollowButton follow={handleFollow} />
          )
        ) : null}
      </div>

      <h4 className="rightbarTitle">User friends</h4>
      <div className="rightbarFollowings">
        <div className="rightbarFollowing">
          <img
            src="../../assets/person/1.jpeg"
            alt=""
            className="rightbarFollowingImg"
          />
          <span className="rightbarFollowingName">John Carter</span>
        </div>
        <div className="rightbarFollowing">
          <img
            src="../../assets/person/2.jpeg"
            alt=""
            className="rightbarFollowingImg"
          />
          <span className="rightbarFollowingName">John Carter</span>
        </div>
        <div className="rightbarFollowing">
          <img
            src="../../assets/person/3.jpeg"
            alt=""
            className="rightbarFollowingImg"
          />
          <span className="rightbarFollowingName">John Carter</span>
        </div>
        <div className="rightbarFollowing">
          <img
            src="../../assets/person/4.jpeg"
            alt=""
            className="rightbarFollowingImg"
          />
          <span className="rightbarFollowingName">John Carter</span>
        </div>
        <div className="rightbarFollowing">
          <img
            src="../../assets/person/5.jpeg"
            alt=""
            className="rightbarFollowingImg"
          />
          <span className="rightbarFollowingName">John Carter</span>
        </div>
        <div className="rightbarFollowing">
          <img
            src="../../assets/person/6.jpeg"
            alt=""
            className="rightbarFollowingImg"
          />
          <span className="rightbarFollowingName">John Carter</span>
        </div>
      </div>
    </>
  );
};
