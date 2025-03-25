import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/auth/me`,
          { withCredentials: true }
        );

        dispatch(setUserData(res.data)); // ✅ correct

      } catch (error) {
        dispatch(setUserData(null));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return loading;
};

export default useGetCurrentUser;