import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "/src/components/admin-components/admin-sidebar";
import ProductComboTable from "../../../components/admin-components/productCombo-table";
import { useEffect, useState } from "react";
import { fetchAllProductCombo } from "../../../service/userService";
import AddFishComboModal from "./AddFishComboModal";

ManageProductCombo.propTypes = {};
function ManageProductCombo() {
  //Hàm xử lý search
  const handleSearch = (value) => {
    console.log(value);
  };
  const [data, setData] = useState([]);
  // Gọi hàm để lấy giá trị từ api
  useEffect(() => {
    getProductCombo();
  }, []);
  const getProductCombo = async () => {
    try {
      let res = await fetchAllProductCombo();
      console.log("API Response:", res);
      if (res) {
        setData(res);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    "Mã lô cá",
    "Các giống cá",
    "Kích thước trung bình",
    "Tình trạng sức khỏe",
    "Số lượng",
    "Trạng thái",
    "Thao tác",
  ];
  const handleOnChange = () => {
    getProductCombo();
  };
  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Trang quản lý</h1>
        <AdminFilter
          onSearch={handleSearch}
          ModalComponent={AddFishComboModal}
          onChange={handleOnChange}
        />
        <ProductComboTable data={data} columns={columns} onChange={handleOnChange}/>
      </div>
    </div>
  );
}

export default ManageProductCombo;
