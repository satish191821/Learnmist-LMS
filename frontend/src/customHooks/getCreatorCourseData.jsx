import { useEffect } from "react";
import { serverUrl } from "../App";
import axios from "axios";
import { setCreatorCourseData } from "../redux/courseSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const getCreatorCourseData = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  return useEffect(() => {
    const getCreatorData = async () => {
      if (userData?.role !== "educator") {
        dispatch(setCreatorCourseData([]));
        return;
      }

      try {
        const result = await axios.get(
          serverUrl + "/api/course/getcreatorcourses",
          { withCredentials: true },
        );

        await dispatch(setCreatorCourseData(result.data));
        // console.log(result.data)
      } catch (error) {
        if (error.response?.status !== 401) {
          // console.log(error)
          toast.error(
            error.response?.data?.message || "Failed to load creator courses",
          );
        }
      }
    };
    getCreatorData();
  }, [userData?.role, dispatch]);
};

export default getCreatorCourseData;
