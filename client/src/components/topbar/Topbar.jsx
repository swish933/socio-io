import { useState } from "react";
import { logout } from "../../slices/auth";
import { Search, Person, Chat, Notifications, Home } from "@material-ui/icons";
import avatar from "../../images/avatar.jpeg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { UserMenu } from "./UserMenu";
import "./topbar.css";

export default function Topbar({ user }) {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };
  const handleClickAway = () => {
    setOpenMenu(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="topbarContainer bg-green-500">
      <div className="topbarLeft">
        <Link to="/">
          <span className="logo">Socio.Io</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to="/">
            <div className="topbarIconItem">
              <Home />
            </div>
          </Link>
        </div>
        <div className="topbarImgContainer">
          <img
            src={user?.profilePicture?.secureUrl || avatar}
            alt=""
            className="topbarImg"
            onClick={handleMenuOpen}
          />

          {openMenu ? (
            <UserMenu
              username={user?.username}
              handleLogout={handleLogout}
              handleClickAway={handleClickAway}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
