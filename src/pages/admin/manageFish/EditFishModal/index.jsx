import { useState } from "react";
import { Modal, Upload, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { editFishInfo } from "../../../../service/userService";

EditFishModal.propTypes = {
  fishData: PropTypes.object.isRequired,
  onChange : PropTypes.func.isRequired,
};

function EditFishModal({ fishData , onChange }) {
  const initFormValue = {
    productID: fishData.productID,
    breed: fishData.breed,
    size: fishData.size,
    sex: fishData.sex,
    healthStatus: fishData.healthStatus,
    personalityTrait: fishData.personalityTrait,
    origin: fishData.origin,
    description: fishData.description,
    image: fishData.image,
    price: fishData.price,
    certificate: fishData.certificate,
    type: fishData.type,
    quantity: 1,
    status: "Còn hàng",
    desiredPrice: fishData.desiredPrice,
    consignmentType: fishData.consignmentType,
    carePackageID: fishData.carePackageID,
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [fileList, setFileList] = useState(
    fishData.image
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: fishData.image,
          },
        ]
      : []
  );

  const [certificateList, setCertificateList] = useState(
    fishData.certificate
      ? [
          {
            uid: "-1",
            name: "certificate.png",
            status: "done",
            url: fishData.certificate,
          },
        ]
      : []
  );

  const [open, setOpen] = useState(false);
  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `uploads/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            imageUrl: url,
          }));
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleCertificateChange = ({ fileList: newFileList }) => {
    setCertificateList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `uploads/certificates/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            certificateUrl: url,
          }));
        })
        .catch((error) => {
          console.error("Error uploading certificate:", error);
        });
    }
  };

  const handleOk = async () => { // Thêm `async` vào hàm
    // Xử lý lưu thông tin cá
    console.log("Form value:", formValue);
    
    const data = {
      id: fishData.productID,
      productName: fishData.productName,
      breed: formValue.breed,
      size: formValue.size,
      sex: formValue.sex,
      healthStatus: formValue.healthStatus,
      personalityTrait: formValue.personalityTrait,
      origin: formValue.origin,
      description: formValue.description,
      image: formValue.image,
      price: formValue.price,
      certificate: formValue.certificate,
      type: formValue.type,
      quantity: 1,
      status: formValue.status,
      desiredPrice: formValue.price,
      consignmentType: formValue.consignmentType
    };
    console.log(data);
    try {
      let res = await editFishInfo(data); // Sử dụng `await` để chờ kết quả
      if (res) {
        onChange();
        console.log("Thành công");
      }
    } catch (error) {
      console.log("Lỗi:", error);
    }
  
    onClose(); // Gọi hàm onClose để đóng modal
  };
  
  const showModal = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button onClick={showModal}>Chỉnh sửa</Button>
      <Modal open={open} onOk={handleOk} onCancel={onClose} centered>
        <form>
          <div className="add-fish__modal">
            <h2>Thông tin cá</h2>
            <div style={{ display: "flex", gap: "5rem" }}>
              <div>
                <label className="form-label">Ảnh:</label>
                <Upload
                  name="image"
                  listType="picture-card"
                  className="image-uploader"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                  required
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </div>
              <div>
                <label className="form-label">Chứng nhận:</label>
                <Upload
                  name="certificate"
                  listType="picture-card"
                  className="certificate-uploader"
                  fileList={certificateList}
                  onChange={handleCertificateChange}
                  beforeUpload={() => false}
                  required
                >
                  {certificateList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </div>
            </div>
            <div>
              <label className="form-label">Giống:</label>
              <input
                className="form-control"
                type="text"
                name="breed"
                value={formValue.breed}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Kích thước:</label>
              <input
                className="form-control"
                type="text"
                name="size"
                value={formValue.size}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Giới tính:</label>
              <select
                className="form-control"
                name="sex"
                value={formValue.sex}
                onChange={handleChange}
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="Đực">Đực</option>
                <option value="Cái">Cái</option>
              </select>
            </div>
            <div>
              <label className="form-label">Tình trạng sức khỏe:</label>
              <input
                className="form-control"
                type="text"
                name="healthStatus"
                value={formValue.healthStatus}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Đặc điểm tính cách:</label>
              <input
                className="form-control"
                type="text"
                name="personalityTrait"
                value={formValue.personalityTrait}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Nguồn gốc:</label>
              <input
                className="form-control"
                type="text"
                name="origin"
                value={formValue.origin}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Mô tả:</label>
              <textarea
                className="form-control"
                name="description"
                value={formValue.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="form-label">Loại:</label>
              <input
                className="form-control"
                type="text"
                name="type"
                value={formValue.type}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Loại hình ký gửi:</label>
              <select
                className="form-control"
                name="consignmentType"
                value={formValue.consignmentType}
                onChange={handleChange}
                required
              >
                <option value="false">Không</option>
                <option value="true">Ký gửi để bán</option>
              </select>
            </div>
            <div>
              <label className="form-label">Giá:</label>
              <input
                className="form-control"
                type="number"
                name="price"
                min={1}
                value={formValue.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default EditFishModal;
