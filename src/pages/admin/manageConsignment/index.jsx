import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import ChangeStatusConsignment from "../../../components/changeStatusConsignment";
import ConsignmentTable from "./Consignment-table";
ManageConsignment.propTypes = {};

const koiConsignmentData = [
  {
    koiConsignmentID: "KC002",
    breed: "Sanke",
    age: 2,
    size: "Lớn",
    sex: "Cái",
    healthStatus: "Khỏe mạnh",
    accountID: "AC124",
    personalityTrait: "Năng động",
    origin: "Việt Nam",
    description: "Một con cá Koi Sanke lớn với hoa văn đẹp.",
    image: "https://example.com/images/koi2.jpg",
    certificate: "Đã chứng nhận thuần chủng",
    carePackageID: "CP002",
    type: "trực tuyến",
    desiredPrice: "2,000,000 VND",
    status: "Chờ xác nhận", // Trạng thái
  },
  {
    koiConsignmentID: "KC003",
    breed: "Showa",
    age: 4,
    size: "Nhỏ",
    sex: "Đực",
    healthStatus: "Bị bệnh",
    accountID: "AC125",
    personalityTrait: "Hung dữ",
    origin: "Thái Lan",
    description: "Một con cá Koi Showa nhỏ với hoa văn đen và đỏ đậm.",
    image: "https://example.com/images/koi3.jpg",
    certificate: "Chưa chứng nhận",
    carePackageID: "CP003",
    type: "chăm sóc",
    desiredPrice: "1,200,000 VND",
    status: "Chờ xác nhận", // Trạng thái
  },
];
const columns = [
  "Mã ký gửi",
  "Giống",
  "Độ lớn",
  "Giới tính",
  "Tình trạng sức khỏe cá",
  "Đơn ký gửi loại",
  "Trạng thái đơn ký gửi",
  "Thao tác",
];

function ManageConsignment() {
  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <ConsignmentTable
          columns={columns}
          consignmentData={koiConsignmentData}
          renderAction={ChangeStatusConsignment}
        />
      </div>
    </div>
  );
}

export default ManageConsignment;
