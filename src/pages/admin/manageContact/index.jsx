import { useEffect, useState } from "react";
import { message, Checkbox } from "antd";
import AdminFilter from "../../../components/admin-components/admin-filter";
import AdminHeader from "../../../components/admin-components/admin-headers";
import AdminSideBar from "../../../components/admin-components/admin-sidebar";
import api from "../../../config/api";
import "./index.scss";

const columns = [
  "Mã câu hỏi",
  "Tên người dùng",
  "Thông tin liên hệ",
  "Chủ đề",
  "Câu hỏi",
  "Trạng thái",
  "Đã xem",
];

function ManageContact() {
  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    getAllContacts();
  }, []);

  // Fetch all contacts
  const getAllContacts = async () => {
    try {
      const res = await api.get("/question/all");
      if (res && res.data) {
        console.log("API Response:", res.data); // Debugging: Log API response
        setContactData(res.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra khi tải dữ liệu câu hỏi.");
    }
  };

  // Search contacts by user name or topic
  const handleSearch = (value) => {
    if (value.trim() === "") {
      getAllContacts();
    } else {
      const filtered = contactData.filter(
        (contact) =>
          contact.userName.toLowerCase().includes(value.toLowerCase()) ||
          contact.topic.toLowerCase().includes(value.toLowerCase())
      );
      setContactData(filtered);
    }
  };

  // Update contact status
  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/question/updateStatus/${id}`, { status });
      message.success("Trạng thái câu hỏi đã được cập nhật thành công!");
      getAllContacts(); // Refresh the data
    } catch (error) {
      console.error("Error updating contact status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái câu hỏi.");
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = async (contact) => {
    const newStatus = contact.status === "viewed" ? "not viewed" : "viewed";
    await handleUpdateStatus(contact.questionID, newStatus);
  };

  return (
    <div className="admin">
      <div className="admin-sidebar">
        <AdminSideBar />
      </div>
      <div className="admin-content">
        <AdminHeader />
        <h1 className="content__title">Quản lý câu hỏi</h1>
        <AdminFilter onSearch={handleSearch} />
        <div className="contact-table">
          <h2 className="contact-table__title">Câu hỏi</h2>
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contactData.map((contact) => (
                <tr key={contact.questionID}>
                  <td>{contact.questionID}</td>
                  <td>{contact.userName}</td>
                  <td>{contact.contact}</td>
                  <td>{contact.topic}</td>
                  <td>{contact.question}</td>
                  <td>{contact.status}</td>
                  <td>
                    <Checkbox
                     
                      
                    >
                      Đã xem
                    </Checkbox>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageContact;