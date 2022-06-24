import React from "react";
import { NavLink } from "react-router-dom";
import { classNames } from "../../util/classNames";
import { ExitToApp } from "@material-ui/icons";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

export const UserMenu = ({ username, handleClickAway, handleLogout }) => {
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="flex flex-col absolute w-28 border border-gray-300 rounded-md bg-gray-100 left-[-60px] top-[35px] ">
        <NavLink
          to={{ pathname: `/profile/${username}` }}
          className={({ isActive }) =>
            classNames(
              isActive ? "bg-gray-300" : "",
              "block py-3 px-4 text-sm text-gray-700 rounded-t-md cursor-pointer hover:bg-gray-300"
            )
          }
        >
          <p>Profile</p>
        </NavLink>
        <hr />
        <p
          onClick={handleLogout}
          className="block py-3 px-4 text-sm text-gray-700 rounded-b-md cursor-pointer hover:bg-gray-300"
        >
          Logout <ExitToApp />
        </p>
      </div>
    </ClickAwayListener>
  );
};
