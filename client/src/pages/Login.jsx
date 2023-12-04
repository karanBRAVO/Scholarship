import LoginForm from "../Components/LoginForm";
import AuthWrapper from "../Components/AuthWrapper";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { resetUserData } from "../store/features/loginSlice";

const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetUserData());
  }, []);

  return (
    <>
      <AuthWrapper
        jsxElement={<LoginForm />}
        endPoint={"/signup"}
        showLogin={true}
      />
    </>
  );
};

export default Login;
