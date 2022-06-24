import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { classNames } from "../../util/classNames";
import { register, selectIsLoading } from "../../slices/auth";
import { setAlert } from "../../slices/alert";
import { Spinner } from "../../components/spinLoader/SpinLoader";

import "./register.css";

export default function Register() {
  const username = useRef();
  const fullname = useRef();
  const email = useRef();
  const password = useRef();
  const passwordTwo = useRef();

  const loading = useSelector(selectIsLoading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.current.value !== passwordTwo.current.value) {
      dispatch(
        setAlert({
          message: "Passwords do not match",
          alertType: "danger",
          duration: 2000,
        })
      );
    } else {
      const data = JSON.stringify({
        email: email.current.value,
        username: username.current.value,
        password: password.current.value,
        fullname: fullname.current.value,
      });

      try {
        const resultAction = await dispatch(register(data));
        const response = unwrapResult(resultAction);

        dispatch(
          setAlert({
            message: response.msg,
            alertType: "success",
            duration: 3000,
          })
        );
        navigate("/signin");
      } catch (error) {
        // dispatch(
        //   setAlert({
        //     message: error.msg,
        //     alertType: "danger",
        //     duration: 3000,
        //   })
        // );
      }
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
          <form onSubmit={handleRegister} className="loginBox">
            <input
              placeholder="Name Surname"
              className="loginInput"
              ref={fullname}
              required
            />
            <input
              placeholder="Username"
              className="loginInput"
              ref={username}
              required
            />
            <input
              placeholder="Email"
              className="loginInput"
              ref={email}
              type="email"
            />
            <input
              type="password"
              placeholder="Password"
              className="loginInput"
              ref={password}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="loginInput"
              ref={passwordTwo}
              required
            />
            <button
              className="loginButton bg-blue-500 flex items-center justify-center"
              type="submit"
            >
              {loading ? (
                <Spinner
                  width={"w-7"}
                  height={"h-7"}
                  fill={"fill-green-500"}
                  bg={"text-gray-300"}
                />
              ) : (
                "Sign Up"
              )}
            </button>

            <Link
              to="/signin"
              className={classNames("loginRegisterButton", "linkWrapper")}
            >
              Log into Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
