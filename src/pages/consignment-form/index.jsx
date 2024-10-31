import { Navigate, useLocation } from "react-router-dom";
import CareForm from "./care-form";
import CareFormCombo from "./care-form-combo";
import SellForm from "./sell-form";

function ConsignmentForm() {
  const location = useLocation();
  const { carePackage, type } = location.state || {};

  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const isOnline = type === "Online" ? true : type === "Offline" ? false : null;

  return type === "Cá thể" ? (
    <div>
      <CareForm carePackage={carePackage} />
    </div>
  ) : type === "Lô" ? (
    <div>
      <CareFormCombo carePackage={carePackage} />
    </div>
  ) : type === "Online" || type === "Offline" ? (
    <div>
      <SellForm isOnline={isOnline} />
    </div>
  ) : (
    <div>Không tìm thấy loại ký gửi phù hợp</div>
  );
}

export default ConsignmentForm;
