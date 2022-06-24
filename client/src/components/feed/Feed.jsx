import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../post/Post";
import Share from "../share/Share";
import { classNames } from "../../util/classNames";
import { getTimelinePosts } from "../../slices/post.js";
import { selectProfilePosts } from "../../slices/profile";
import { selectPosts } from "../../slices/post.js";
import emptyFeedIllustration from "../../images/undraw_no_data_re_kwbl.svg";
import "./feed.css";

const Feed = ({ profile, user }) => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const ProfilePosts = useSelector(selectProfilePosts);

  useEffect(() => {
    if (!profile) {
      dispatch(getTimelinePosts());
    }
  }, [dispatch, profile]);

  return (
    <div className={classNames(profile ? "feedProfile" : "feed")}>
      <div className="feedWrapper">
        {!profile ? <Share user={user} /> : null}
        {profile && ProfilePosts.length ? (
          ProfilePosts.map((p) => (
            <Post
              key={p._id}
              post={p}
              profilePage={profile}
              postId={p._id}
              postUserId={p?.user}
            />
          ))
        ) : !profile && posts.length ? (
          posts.map((p) => (
            <Post key={p._id} post={p} postId={p._id} postUserId={p.user._id} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32">
            <img
              src={emptyFeedIllustration}
              alt="empty feed"
              className="w-52 h-52"
            />
            {!profile ? (
              <p className="font-medium mt-6">
                Follow some friends or create a post.....
              </p>
            ) : (
              <p className="font-medium mt-6">Create posts...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
