import React, { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearAlert, selectAlert } from "../../slices/alert";
import { classNames } from "../../util/classNames";
import { CheckCircleOutlined, HighlightOff } from "@material-ui/icons";

const AlertComponent = ({ message, duration, alertType, id, location }) => {
  const dispatch = useDispatch();

  // useCallback is just so this can be a useEffect dependency and won't get recreated
  const remove = useCallback(() => {
    dispatch(clearAlert(id));
  }, [dispatch, id]);

  // automatically expire after the duration, or if this component unmounts
  useEffect(() => {
    setTimeout(remove, duration);
    return remove;
  }, [remove, duration]);

  return (
    <div
      className={classNames(
        location === "profilePage" && alertType === "success"
          ? "fixed bottom-0 z-40 w-full alert-success p-4"
          : location === "profilePage" && alertType === "danger"
          ? "fixed bottom-0 z-40 w-full alert-danger p-4"
          : alertType === "success"
          ? "top-20 alert-success p-4 w-80 -ml-40 fixed left-1/2 rounded-md"
          : "top-10 alert-danger p-4 w-80 border -ml-40 fixed left-1/2 rounded-md"
      )}
    >
      <div className="flex justify-center items-center">
        <div className="flex-shrink-0">
          {alertType === "success" ? (
            <CheckCircleOutlined className="h-5 w-5 text-green-400" />
          ) : (
            <HighlightOff className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="ml-3">
          <p
            className={classNames(
              alertType === "success" ? "text-green-800" : "text-red-800",
              "text-sm font-medium "
            )}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Alerts = () => {
  const alerts = useSelector(selectAlert);

  return (
    <>
      {alerts.map((props) => (
        <AlertComponent {...props} key={props.id} />
      ))}
    </>
  );
};
