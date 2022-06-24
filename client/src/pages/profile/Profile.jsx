import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteCoverPicture,
  deleteProfilePicture,
  selectCurrentUser,
  uploadCoverPicture,
  uploadProfilePicture,
} from "../../slices/user";
import { getUser, getUserPosts, selectProfileUser } from "../../slices/profile";
import avatar from "../../images/avatar.jpeg";
import { Add } from "@material-ui/icons";
import { UploadMenu } from "./UploadMenu";
import { unwrapResult } from "@reduxjs/toolkit";
import { setAlert } from "../../slices/alert";
import "./profile.css";

export default function Profile() {
  const user = useSelector(selectCurrentUser);
  const profileUser = useSelector(selectProfileUser);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const dispatch = useDispatch();

  const username = useParams().username;

  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };

  const handleClickAway = () => {
    setOpenMenu(false);
  };

  const uploadPic = async (data, cb) => {
    try {
      const resultAction = await dispatch(cb(data));
      unwrapResult(resultAction);

      setProfilePicture(null);
      setCoverPicture(null);

      dispatch(
        setAlert({
          message: "Picture uploaded!",
          alertType: "success",
          duration: 3000,
          location: "profilePage",
        })
      );
    } catch (error) {
      dispatch(
        setAlert({
          message: error.msg,
          alertType: "danger",
          duration: 3000,
          location: "profilePage",
        })
      );
    }
  };

  const handleProfilePicChange = (e) => {
    setProfilePicture(e.target.files[0]);

    let data = {
      profilePicture: null,
    };

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (e) => {
      data.profilePicture = reader.result;
      data.userName = username;
      uploadPic(data, uploadProfilePicture);
    };
  };

  const handleCoverPicChange = (e) => {
    setCoverPicture(e.target.files[0]);

    let data = {
      coverPicture: null,
    };

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
      data.coverPicture = reader.result;
      data.userName = username;
      uploadPic(data, uploadCoverPicture);
    };
  };

  const handleDeleteProfilePicture = async () => {
    const publicId = user.profilePicture.publicId.split("/")[2];

    try {
      const resultAction = await dispatch(
        deleteProfilePicture({
          photoId: publicId,
          userName: username,
        })
      );
      unwrapResult(resultAction);
    } catch (error) {
      dispatch(
        setAlert({
          message: error.msg,
          alertType: "danger",
          duration: 3000,
          location: "profile",
        })
      );
    }
  };

  const handleDeleteCoverPicture = async () => {
    const publicId = user.coverPicture.publicId.split("/")[2];

    try {
      const resultAction = await dispatch(
        deleteCoverPicture({
          photoId: publicId,
          userName: username,
        })
      );
      unwrapResult(resultAction);
    } catch (error) {
      dispatch(
        setAlert({
          message: error.msg,
          alertType: "danger",
          duration: 3000,
          location: "profile",
        })
      );
    }
  };

  useEffect(() => {
    dispatch(getUser(username));
    dispatch(getUserPosts(username));
  }, [dispatch, username]);

  return (
    <>
      <Topbar user={user} />
      <div className="profile">
        <Leftbar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {coverPicture ? (
                <img
                  className="profileCoverImg"
                  alt="cover"
                  src={URL.createObjectURL(coverPicture)}
                />
              ) : profileUser?.coverPicture?.secureUrl ? (
                <img
                  className="profileCoverImg"
                  src={profileUser?.coverPicture?.secureUrl}
                  alt="cover"
                />
              ) : (
                <div className="profileCoverImg bg-green-700 w-full"></div>
              )}
              <div className=" w-[150px] h-[150px] absolute left-0 right-0 top-[150px] m-auto z-20">
                {profilePicture ? (
                  <img
                    className="w-full object-cover profileUserImg"
                    src={URL.createObjectURL(profilePicture) || null}
                    alt="profile"
                  />
                ) : (
                  <img
                    className="profileUserImg"
                    src={profileUser?.profilePicture?.secureUrl || avatar}
                    alt="profile"
                  />
                )}
              </div>
              {profileUser?._id === user?._id ? (
                <div
                  className="absolute w-7 h-7 border border-white rounded-full bg-gray-200  top-[275px] left-0 -right-20 m-auto cursor-pointer hover:bg-gray-400 hover:border-green-300 z-20"
                  onClick={handleMenuOpen}
                >
                  <Add size="small" htmlColor="gray" />
                </div>
              ) : null}

              {openMenu ? (
                <UploadMenu
                  handleClickAway={handleClickAway}
                  handleDeleteProfilePicture={handleDeleteProfilePicture}
                  handleProfilePicChange={handleProfilePicChange}
                  handleDeleteCoverPicture={handleDeleteCoverPicture}
                  handleCoverPicChange={handleCoverPicChange}
                />
              ) : null}
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{profileUser?.fullname}</h4>
              <span className="profileInfoDesc">Hello my friends!</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed profile user={user} />
            <Rightbar profile profileUser={profileUser} user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
