import { useEffect, useState } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
const getCurrentUser = () => {
  let [authLoading, setAuthLoading] = useState(true);
  let dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(serverUrl + "/api/user/currentuser", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        if (error.response?.status !== 401) {
          // console.log(error)
        }
        dispatch(setUserData(null));
      } finally {
        setAuthLoading(false);
      }
    };
    fetchUser();
  }, []);

  return authLoading;
};

export default getCurrentUser;
