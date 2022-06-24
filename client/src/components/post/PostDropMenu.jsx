import { DeleteOutlined, FlagOutlined } from "@material-ui/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setAlert } from "../../slices/alert";
import { deletePost } from "../../slices/post";

export const PostDropMenu = ({ postUserId, currentUserId, postId }) => {
  const dispatch = useDispatch();
  const handleDeletePost = async () => {
    try {
      const resultAction = await dispatch(deletePost(postId));
      const response = unwrapResult(resultAction);
      dispatch(
        setAlert({
          message: response.msg,
          alertType: "success",
          duration: 3000,
          location: "",
        })
      );
    } catch (error) {
      setAlert({
        message: error.msg,
        alertType: "danger",
        duration: 3000,
        location: "",
      });
    }
  };
  return (
    <div className="absolute flex flex-col border border-gray-300 rounded-md bg-[#fffffc] right-2 min-w-max">
      {postUserId === currentUserId ? (
        <div
          onClick={handleDeletePost}
          className="flex justify-start items-center px-3 cursor-pointer"
        >
          <DeleteOutlined htmlColor="red" />
          <p className="text-sm text-gray-800">Delete post</p>
        </div>
      ) : (
        <div className="flex justify-start items-center px-3 cursor-pointer">
          <FlagOutlined htmlColor="red" />
          <p className="text-sm text-gray-800">Flag post</p>
        </div>
      )}
    </div>
  );
};
