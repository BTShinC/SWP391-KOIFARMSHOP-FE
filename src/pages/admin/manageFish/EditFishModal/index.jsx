import { useState } from "react";
import { Modal, Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { editFishInfo } from "../../../../service/userService";

EditFishModal.propTypes = {
  fishData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

function EditFishModal({ fishData, onChange }) {
  const initFormValue = {
    productID: fishData.productID,
    productName:fishData.productName,
    breed: fishData.breed,
    size: fishData.size,
    age: fishData.age,
    sex: fishData.sex,
    healthStatus: fishData.healthStatus,
    personalityTrait: fishData.personalityTrait,
    origin: fishData.origin,
    description: fishData.description,
    image: fishData.image,
    image1: fishData.image1,
    image2: fishData.image2,
    price: fishData.price,
    certificate: fishData.certificate,
    type: fishData.type,
    quantity: 1,
    status: fishData.status,
    desiredPrice: fishData.desiredPrice,
    consignmentType: fishData.consignmentType,
    carePackageID: fishData.carePackageID,
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [fileList, setFileList] = useState(
    [fishData.image, fishData.image1, fishData.image2]
      .filter(Boolean)
      .map((image, index) => ({
        uid: `-${index}`,
        name: `image${index}.png`,
        status: "done",
        url: image,
      }))
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
    setFormValue((prevValue) => ({
      ...prevValue,
      [name]: value,
      consignmentType:
        name === "type" && value === "Ký gửi"
          ? "Ký gửi để bán"
          : "Trang trại đăng bán",
    }));
  };

  const handleUploadChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const uploadedImagesPromises = newFileList.map(async (file) => {
      try {
        const storageRef = ref(storage, `uploads/${file.name}`);
        await uploadBytes(storageRef, file.originFileObj);
        return await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading file:", error);
        return null;
      }
    });

    const urls = await Promise.all(uploadedImagesPromises);

    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      image: urls[0] || null,
      image1: urls[1] || null,
      image2: urls[2] || null,
    }));
  };

  const handleCertificateChange = async ({ fileList: newFileList }) => {
    setCertificateList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `uploads/certificates/${file.name}`);

      try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setFormValue((prevFormValue) => ({
          ...prevFormValue,
          certificate: url,
        }));
      } catch (error) {
        console.error("Error uploading certificate:", error);
      }
    }
  };

  const handleOk = async () => {
    const data = {
      productID: fishData.productID,
      productName: formValue.productName,
      breed: formValue.breed,
      size: formValue.size,
      sex: formValue.sex,
      age: formValue.age,
      healthStatus: formValue.healthStatus,
      personalityTrait: formValue.personalityTrait,
      origin: formValue.origin,
      description: formValue.description,
      image: formValue.image, 
      image1: formValue.image1, 
      image2: formValue.image2, 
      price: formValue.price,
      certificate: formValue.certificate,
      type: formValue.type,
      quantity: 1,
      status: fishData.status,
      desiredPrice: formValue.desiredPrice,
      consignmentType: formValue.consignmentType,
    };

    try {
      const res = await editFishInfo(data);
      if (res) {
        onChange();
        console.log("Thành công");
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response || error.message || error);
    }

    onClose();
    message.success("Cập nhật cá thành công") 
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
          <div className="edit-fish__modal">
            <h2>Chỉnh sửa thông tin cá</h2>
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
                  multiple
                  required
                >
                  {fileList.length >= 3 ? null : (
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
              <label className="form-label">Tên sản phẩm:</label>
              <input
                className="form-control"
                type="text"
                name="productName"
                value={formValue.productName}
                onChange={handleChange}
                required
              />
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
              <label className="form-label">Tuổi:</label>
              <input
                className="form-control"
                type="number"
                name="age"
                min={1}
                value={formValue.age}
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
              <select
                className="form-control"
                name="type"
                value={formValue.type}
                onChange={handleChange}
                required
              >
                <option value="Trang trại">Trang trại</option>
                <option value="Ký gửi">Ký gửi</option>
              </select>
            </div>
            {formValue.consignmentType === "Ký gửi để bán" ? (
              <>
                <div>
                  <label className="form-label">Giá đăng bán:</label>
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
                <div>
                  <label className="form-label">Giá khách hàng mong muốn:</label>
                  <input
                    className="form-control"
                    type="number"
                    name="desiredPrice"
                    min={1}
                    value={formValue.desiredPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="form-label">Giá đăng bán:</label>
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
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}

export default EditFishModal;
