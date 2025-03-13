import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";

const AuthLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(setUser({ user: JSON.parse(user), token }));
    }
  }, [dispatch]);

  return null;
};

export default AuthLoader;
