import { Navigate, useLocation } from "react-router-dom";
import CareForm from "./care-form";
import CareFormCombo from "./care-form-combo";
import SellForm from "./sell-form";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function ConsignmentForm() {
  const location = useLocation();
  const { carePackage, type } = location.state || {};
  console.log("Type:", type);
  console.log("carePackage", carePackage);

  const [isOnline, setIsOnline] = useState(null);

  // Use useEffect to avoid direct state updates inside the render
  useEffect(() => {
    if (type === "Online") {
      setIsOnline(true);
    } else if (type === "Offline") {
      setIsOnline(false);
    }
  }, [type]);

  const user = useSelector((state) => state.user);
  console.log(user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return type === "Cá thể" ? (
    <div>
      <CareForm carePackage={carePackage} />
    </div>
  ) : type === "Lô" ? (
    <div>
      <CareFormCombo carePackage={carePackage} />
    </div>
  ) : type === "Online" ? (
    <div>
      <SellForm isOnline={isOnline} />
    </div>
  ) : type === "Offline" ? (
    <div>
      <SellForm isOnline={isOnline} />
    </div>
  ) : (
    <div>Không tìm thấy loại ký gửi phù hợp</div>
  );
}

export default ConsignmentForm;
