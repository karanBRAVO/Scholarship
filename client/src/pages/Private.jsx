import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const Private = () => {
  const loginStatus = useSelector((state) => state.login);

  return <>{loginStatus.token ? <Outlet /> : <Navigate to={"/login"} />}</>;
};

export default Private;
