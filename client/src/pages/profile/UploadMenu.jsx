import React from "react";
import { DeleteRounded, PublishRounded } from "@material-ui/icons";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

export const UploadMenu = ({
  handleClickAway,
  handleDeleteProfilePicture,
  handleDeleteCoverPicture,
  handleProfilePicChange,
  handleCoverPicChange,
}) => {
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="absolute w-36 border border-gray-300 rounded-md bg-gray-100 top-[275px] left-0 -right-20 m-auto text-sm z-20">
        <label htmlFor="profilePicFile">
          <p className="px-2 py-2 cursor-pointer  hover:bg-gray-300 rounded-t-md">
            Upload photo <PublishRounded fontSize="medium" />
          </p>
          <input
            className="hidden"
            type="file"
            id="profilePicFile"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </label>
        <hr />
        <p
          className="px-2 py-2.5 cursor-pointer hover:bg-gray-300"
          onClick={handleDeleteProfilePicture}
        >
          Delete photo <DeleteRounded fontSize="small" />
        </p>

        <div className="border border-gray-500 "></div>

        <label htmlFor="coverPictureFile">
          <p className="px-2 py-2 cursor-pointer  hover:bg-gray-300 rounded-t-md">
            Upload cover <PublishRounded fontSize="medium" />
          </p>
          <input
            className="hidden"
            type="file"
            id="coverPictureFile"
            accept="image/*"
            onChange={handleCoverPicChange}
          />
        </label>
        <hr />
        <p
          className="px-2 py-2.5 cursor-pointer hover:bg-gray-300"
          onClick={handleDeleteCoverPicture}
        >
          Delete cover <DeleteRounded fontSize="small" />
        </p>
      </div>
    </ClickAwayListener>
  );
};
