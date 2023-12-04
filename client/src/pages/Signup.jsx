import RegisterFrom from "../Components/RegisterForm";
import AuthWrapper from "../Components/AuthWrapper";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { resetUserData } from "../store/features/loginSlice";

const Signup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetUserData());
  }, []);

  return (
    <>
      <AuthWrapper
        jsxElement={<RegisterFrom />}
        endPoint={"/login"}
        showLogin={false}
      />
    </>
  );
};

export default Signup;
