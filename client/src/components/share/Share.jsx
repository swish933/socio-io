import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  CancelOutlined,
} from "@material-ui/icons";
import avatar from "../../images/avatar.jpeg";
import { Spinner } from "../spinLoader/SpinLoader";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, selectPostLoading } from "../../slices/post";
import { setAlert } from "../../slices/alert";
import { unwrapResult } from "@reduxjs/toolkit";
import { classNames } from "../../util/classNames";
import "./share.css";

const Share = ({ user }) => {
  const description = useRef(null);
  const media = useRef(null);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const uploading = useSelector(selectPostLoading);

  const sendPost = async (data) => {
    try {
      const resultAction = await dispatch(createPost(data));
      const response = unwrapResult(resultAction);
      setFile(null);
      media.current.value = null;
      description.current.value = "";

      dispatch(
        setAlert({
          message: response.msg,
          alertType: "success",
          duration: 3000,
          location: "",
        })
      );
    } catch (error) {
      dispatch(
        setAlert({
          message: error.msg,
          alertType: "danger",
          duration: 3000,
          location: "",
        })
      );
    }
  };

  const shareHandler = async (e) => {
    e.preventDefault();
    let data = {
      text: description.current.value.trim(),
      media: [],
    };

    //convert file to dataURL & sendPost
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (e) {
        data.media.push(reader.result);
        data = JSON.stringify(data, ["text", "media"]);
        sendPost(data);
      };
    } else {
      //sendPost without media array

      delete data.media;
      sendPost(JSON.stringify(data));
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={user?.profilePicture?.secureUrl || avatar}
            alt="profile"
          />
          <input
            placeholder={`What's in your mind ${user?.fullname.split(" ")[0]}?`}
            className="shareInput"
            ref={description}
          />
        </div>
        <hr className="shareHr" />
        {file ? (
          <div className="pr-5 pb-3 pl-5 relative">
            {uploading ? (
              <div className="flex items-center justify-center mb-2">
                <Spinner
                  bg={"text-gray-200"}
                  fill={"fill-green-500"}
                  width={"w-7"}
                  height={"h-7"}
                />
              </div>
            ) : null}
            {file.type.startsWith("image/") ? (
              <img
                className={classNames(
                  uploading ? "blur" : "",
                  "w-full object-cover"
                )}
                src={URL.createObjectURL(file) || null}
                alt="post"
              />
            ) : (
              <video
                width="500"
                className="max-w-full h-auto"
                muted
                autoPlay
                loop
              >
                <source
                  src={URL.createObjectURL(file) || null}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            )}

            {!uploading ? (
              <CancelOutlined
                htmlColor="red"
                className="absolute top-2 right-7 cursor-pointer opacity-80"
                onClick={() => {
                  setFile(null);
                  media.current.value = null;
                }}
              />
            ) : null}
          </div>
        ) : null}
        <form className="shareBottom" onSubmit={shareHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption p-2 hover:bg-gray-200">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                className="hidden"
                type="file"
                id="file"
                accept="image/*, video/*"
                ref={media}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <input
            value="Share"
            className="shareButton bg-green-500"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default Share;
