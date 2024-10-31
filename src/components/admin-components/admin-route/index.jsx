import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Spin } from "antd";

const AdminRoute = ({ element }) => {
  const user = useSelector((state) => state.user);

  if (!user) {
    return (
      <div>
        <Spin size="large" />
      </div>
    );
  }

  console.log("User role:", user.roleName);

  if (user.roleName !== "Admin" && user.roleName !== "Staff") {
    toast.error("Bạn không có quyền truy cập vào trang này.");
    return <Navigate to="/" replace />;
  }

  return element;
};

AdminRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default AdminRoute;
