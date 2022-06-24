import { unwrapResult } from "@reduxjs/toolkit";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, selectIsLoading } from "../../slices/auth";
import { setAlert } from "../../slices/alert";
import { classNames } from "../../util/classNames";
import "./login.css";
import { loadUser } from "../../slices/user";
import setAuthToken from "../../util/setAuthToken";
import { Spinner } from "../../components/spinLoader/SpinLoader";

export default function Login() {
  const dispatch = useDispatch();
  const loading = useSelector(selectIsLoading);
  const navigate = useNavigate();
  const email = useRef();
  const password = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();

    const data = JSON.stringify({
      email: email.current.value,
      password: password.current.value,
    });

    try {
      const resultAction = await dispatch(login(data));
      unwrapResult(resultAction);
      setAuthToken(localStorage.getItem("token"));
      dispatch(loadUser());
      navigate("/");
    } catch (error) {
      dispatch(
        setAlert({ message: error.msg, alertType: "danger", duration: 3000 })
      );
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Socio.Io</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Socio.Io.
          </span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleLogin} className="loginBox">
            <input
              ref={email}
              type="email"
              placeholder="Email"
              className="loginInput"
              autoComplete="true"
            />
            <input
              ref={password}
              type="password"
              placeholder="Password"
              className="loginInput"
              autoComplete="true"
            />
            <button
              type="submit"
              className="loginButton bg-blue-500 flex items-center justify-center"
            >
              {loading ? (
                <Spinner
                  width={"w-7"}
                  height={"h-7"}
                  fill={"fill-green-500"}
                  bg={"text-gray-300"}
                />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>

            <Link
              to="/signup"
              className={classNames("loginRegisterButton", "linkWrapper")}
            >
              Create a New Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
