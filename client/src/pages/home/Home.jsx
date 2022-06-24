import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import Feed from "../../components/feed/Feed";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../slices/user";
import "./home.css";

const Home = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <>
      <Topbar user={user} />
      <div className="homeContainer">
        <Leftbar />
        <Feed user={user} />
        <Rightbar />
      </div>
    </>
  );
};

export default Home;
