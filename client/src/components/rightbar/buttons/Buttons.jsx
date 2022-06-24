import { Add, Remove } from "@material-ui/icons";

export const FollowButton = ({ follow }) => {
  return (
    <button
      onClick={follow}
      className="bg-green-600 px-3 py-1.5 rounded-md text-white hover:bg-green-500 flex items-center justify-around"
    >
      <span>Follow</span> <Add fontSize="small" />
    </button>
  );
};

export const UnfollowButton = ({ unfollow }) => {
  return (
    <button
      onClick={unfollow}
      className="bg-green-600 px-3 py-1.5 rounded-md text-white hover:bg-green-500 flex items-center justify-around"
    >
      Unfollow <Remove fontSize="small" />
    </button>
  );
};
