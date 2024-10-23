import { Navigate, useLocation } from "react-router-dom";
import CareForm from "./care-form";
import CareFormCombo from "./care-form-combo";
import SellForm from "./sell-form";
import { useSelector } from "react-redux";
import SellOffline from "./sell-offlline-form";
function ConsignmentForm() {
  const location = useLocation();
  const { carePackage ,id, type } = location.state || {};
  console.log("ID:", id);
  console.log("Type:", type);
  console.log("carePackage",carePackage)

  const user = useSelector((state) => state.user);
  console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return type === "Cá thể" ? (
    <div>
      <CareForm carePackage = {carePackage} />
    </div>
  ) : type === "Lô" ? (
    <div>
      <CareFormCombo carePackage = {carePackage} />
    </div>
  ) : type === "Online" ? (
    <div>
      <SellForm id = {id} />
    </div>
  ) : type == "Offline" ? (
    <div>
      <SellOffline id = {id} />
    </div>
  ) : (
    <div>Không tìm thấy loại ký gửi phù hợp</div>
  );
}

export default ConsignmentForm;
