import { Navigate, useLocation } from "react-router-dom";
import CareForm from "./care-form";
import CareFormCombo from "./care-form-combo";
import SellForm from "./sell-form";
import { useSelector } from "react-redux";
function ConsignmentForm() {
  const location = useLocation();
  const { id, type } = location.state || {};
  console.log("ID:", id); // ID bạn đã truyền
  console.log("Type:", type); // Type bạn đã truyền
  const user = useSelector((state) => state.user);
  console.log(user);
  if (!user) {
    return <Navigate to="/login" replace />; // Chuyển hướng đến trang login
  }
  return type === "Cá thể" ? (
    <div>
      <CareForm />
    </div>
  ) : type === "Lô" ? (
    <div>
      <CareFormCombo /> 
    </div>
  ) : type === "Online" ? (
    <div>
      <SellForm />
    </div>
  ) : (
    <div>Không tìm thấy loại ký gửi phù hợp</div> // Trường hợp không khớp với bất kỳ điều kiện nào
  );
}

export default ConsignmentForm;
