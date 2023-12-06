import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminPrivate = () => {
  const adminStatus = useSelector((state) => state.admin);

  return (
    <>{adminStatus.token ? <Outlet /> : <Navigate to={"/admin-login"} />}</>
  );
};

export default AdminPrivate;
