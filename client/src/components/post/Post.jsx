import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { formatDistance, parseISO } from "date-fns";
import { selectProfileUser } from "../../slices/profile";
import { selectCurrentUser } from "../../slices/user";
import { selectDeletePostsLoading, likePost } from "../../slices/post";
import { setAlert } from "../../slices/alert";
import { imageFormat } from "../../util/mediaFormat";
import { PostDropMenu } from "../post/PostDropMenu";
import { Spinner } from "../spinLoader/SpinLoader";
import { MoreVert, FavoriteBorder, Favorite } from "@material-ui/icons";
import avatar from "../../images/avatar.jpeg";
import "./post.css";

const Post = ({ post, profilePage, postId, postUserId }) => {
  const [likes, setLikes] = useState(0);
  const [postMenu, setPostMenu] = useState(false);
  const profile = useSelector(selectProfileUser);
  const user = useSelector(selectCurrentUser);
  const isDeleting = useSelector(selectDeletePostsLoading);
  const [isLiked, setIsLiked] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setLikes(post?.likes?.length);
    setIsLiked(post?.likes.some((item) => item.user === user?._id));
  }, [post, user]);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    try {
      const resultAction = await dispatch(likePost(postId));
      unwrapResult(resultAction);
    } catch (error) {
      dispatch(
        setAlert({
          message: "Post was not liked!",
          alertType: "danger",
          duration: 3000,
          location: "",
        })
      );
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          {profilePage ? (
            <div className="postTopLeft">
              <img
                className="postProfileImg"
                src={profile?.profilePicture?.secureUrl || avatar}
                alt=""
              />
              <span className="postUsername">{profile?.username}</span>
              <span className="postDate">
                {formatDistance(parseISO(post?.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ) : (
            <Link
              to={{
                pathname: `/profile/${post?.user?.username}`,
              }}
            >
              <div className="postTopLeft">
                <img
                  className="postProfileImg"
                  src={post.user?.profilePicture?.secureUrl || avatar}
                  alt=""
                />
                <span className="postUsername">{post.user?.username}</span>
                <span className="postDate">
                  {formatDistance(parseISO(post?.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>
          )}

          <div
            className="postTopRight relative cursor-pointer"
            onClick={() => {
              setPostMenu(!postMenu);
            }}
          >
            {!isDeleting ? <MoreVert /> : <Spinner />}
            {postMenu ? (
              <PostDropMenu
                postUserId={postUserId}
                currentUserId={user?._id}
                postId={postId}
              />
            ) : null}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.description}</span>
          {imageFormat(post?.media[0]?.secureUrl) ? (
            <img className="postMedia" src={post?.media[0]?.secureUrl} alt="" />
          ) : (
            <video
              className="postMedia max-w-full h-auto"
              muted
              controls
              preload="metadata"
            >
              <source src={post?.media[0]?.secureUrl} />
            </video>
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <div
              className="cursor-pointer hover:bg-red-200 p-1 border-0 rounded-full"
              onClick={handleLike}
            >
              {isLiked ? <Favorite htmlColor="red" /> : <FavoriteBorder />}
            </div>
            <span className="postLikeCounter ml-1 font-semibold">
              {likes} {likes === 1 ? "like" : "likes"}
            </span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">
              {post?.comment?.length} comments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
