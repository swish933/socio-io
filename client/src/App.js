import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Alerts } from "./components/alert/Alert";
import { NotFound } from "./components/notFound/NotFound";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { PrivateRoute } from "./components/PrivateRoute";
import setAuthToken from "./util/setAuthToken";
import { useDispatch } from "react-redux";
import { loadUser } from "./slices/user";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      <Alerts />
      <Routes>
        <Route path="/" element={<PrivateRoute component={Home} />} />
        <Route
          path="/profile/:username"
          element={<PrivateRoute component={Profile} />}
        />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
