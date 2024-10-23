import React, { useState, useEffect } from "react";
import { Modal, Form, Upload, Select, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js"; // Ensure the path is correct
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import "./index.scss";

const { Option } = Select;

const EditTransactionModal = ({ visible, onClose, transactionData, onUpdate }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    form.setFieldsValue({ status: transactionData.status }); // Set initial status from transactionData
    setFileList([]); // Reset file list on open
  }, [transactionData, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    // Prepare the API URL for updating transaction status
    const apiUrl = `http://103.90.227.69:8080/api/transactions/updateStatus/${transactionData.transactionID}?status=${encodeURIComponent(values.status)}`;

    // Upload image if exists
    const imageUrl = fileList.length > 0 ? await uploadImage(fileList[0].originFileObj) : null;

    // Make the API call to update the transaction status
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        
          headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header
              'Content-Type': 'application/json' // Định dạng nội dung
          },
        body: JSON.stringify({ imageUrl }), // Include imageUrl if needed
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // If status is "Đã hoàn thành", update the account balance
      if (values.status === "Đã hoàn thành") {
        await updateAccountBalance(transactionData.accountID, transactionData.price);
      }

      // Call the onUpdate function to refresh the data
      await onUpdate(transactionData.transactionID, { ...values, imageUrl });
      onClose(); // Close the modal after updating
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const updateAccountBalance = async (accountID, amount) => {
    const apiUrl = `http://103.90.227.69:8080/api/account/updateBalance/${accountID}?amount=${amount}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update account balance');
      }
    } catch (error) {
      console.error('Error updating account balance:', error);
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `uploads/${file.name}`); // Create a reference to Firebase Storage
    await uploadBytes(storageRef, file); // Upload the file
    return await getDownloadURL(storageRef); // Get the download URL
  };

  return (
    <Modal
      title="Chỉnh sửa giao dịch"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <div>
        <p><strong>Tài khoản:</strong> {transactionData.accountID}</p>
        <p><strong>Số tiền:</strong> {transactionData.price} VND</p>
        <p><strong>Ngày giao dịch:</strong> {new Date(transactionData.date).toLocaleDateString()}</p>
      </div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
          <Select placeholder="Chọn trạng thái">
            <Option value="Đã hoàn thành">Đã hoàn thành</Option>
            <Option value="Đã hủy">Đã hủy</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Bằng chứng chuyển khoản">
          <Upload
            name="image"
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevent automatic upload
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form>
    </Modal>
  );
};

EditTransactionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  transactionData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default EditTransactionModal;
