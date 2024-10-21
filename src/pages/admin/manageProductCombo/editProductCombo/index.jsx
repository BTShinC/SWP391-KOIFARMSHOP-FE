import { useState } from "react";
import { Modal, Upload, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { editComboInfo } from "../../../../service/userService";

EditProductComboModal.propTypes = {
  fishData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

function EditProductComboModal({ fishData, onChange }) {
  const initFormValue = {
    productComboID: fishData.productComboID,
    comboName: fishData.comboName,
    size: fishData.size,
    breed: fishData.breed,
    healthStatus: fishData.healthStatus,
    quantity: fishData.quantity,
    description: fishData.description,
    image: fishData.image,
    image1: fishData.image1,
    image2: fishData.image2,
    price: fishData.price,
    consignmentType: fishData.consignmentType,
    desiredPrice: fishData.desiredPrice,
    type: fishData.type,
    status: fishData.status,
    carePackageID: fishData.carePackageID,
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [fileList, setFileList] = useState({
    image: fishData.image
      ? [{ uid: "-1", name: "image.png", status: "done", url: fishData.image }]
      : [],
    image1: fishData.image1
      ? [
          {
            uid: "-2",
            name: "image1.png",
            status: "done",
            url: fishData.image1,
          },
        ]
      : [],
    image2: fishData.image2
      ? [
          {
            uid: "-3",
            name: "image2.png",
            status: "done",
            url: fishData.image2,
          },
        ]
      : [],
  });
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    const { value, name } = event.target;

    setFormValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const uploadedFiles = newFileList.filter((file) => file.originFileObj);
    const uploadPromises = uploadedFiles.map((fileObj, index) => {
      const file = fileObj.originFileObj;
      const storageRef = ref(storage, `uploads/${file.name}`);
      return uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          if (index === 0) {
            setFormValue((prevFormValue) => ({ ...prevFormValue, image: url }));
          } else if (index === 1) {
            setFormValue((prevFormValue) => ({
              ...prevFormValue,
              image1: url,
            }));
          } else if (index === 2) {
            setFormValue((prevFormValue) => ({
              ...prevFormValue,
              image2: url,
            }));
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    });

    Promise.all(uploadPromises);
  };

  const handleOk = async () => {
    const data = {
      productComboID: formValue.productComboID,
      comboName: formValue.comboName,
      size: formValue.size,
      breed: formValue.breed,
      healthStatus: formValue.healthStatus,
      quantity: formValue.quantity,
      description: formValue.description,
      image: formValue.image, // Ảnh chính
      image1: formValue.image1, // Ảnh phụ 1
      image2: formValue.image2, // Ảnh phụ 2
      price: parseFloat(formValue.price),
      consignmentType: formValue.consignmentType,
      desiredPrice: parseFloat(formValue.desiredPrice),
      type: formValue.type,
      status: formValue.status,
      carePackageID: formValue.carePackageID,
    };
    console.log(data);
    try {
      let res = await editComboInfo(data);
      if (res) {
        console.log("Thành công");
        onChange();
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setOpen(false);
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
            <h2>Thông tin Combo</h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {/* Upload ảnh chính */}
              <div>
                <label className="form-label">Ảnh chính:</label>
                <Upload
                  name="image"
                  listType="picture-card"
                  className="image-uploader"
                  fileList={fileList.image}
                  onChange={({ fileList }) =>
                    handleUploadChange(fileList, "image")
                  }
                  beforeUpload={() => false}
                  required
                >
                  {fileList.image.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </div>

              {/* Upload ảnh phụ 1 */}
              <div>
                <label className="form-label">Ảnh phụ 1:</label>
                <Upload
                  name="image1"
                  listType="picture-card"
                  className="image-uploader"
                  fileList={fileList.image1}
                  onChange={({ fileList }) =>
                    handleUploadChange(fileList, "image1")
                  }
                  beforeUpload={() => false}
                  required
                >
                  {fileList.image1.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </div>

              {/* Upload ảnh phụ 2 */}
              <div>
                <label className="form-label">Ảnh phụ 2:</label>
                <Upload
                  name="image2"
                  listType="picture-card"
                  className="image-uploader"
                  fileList={fileList.image2}
                  onChange={({ fileList }) =>
                    handleUploadChange(fileList, "image2")
                  }
                  beforeUpload={() => false}
                  required
                >
                  {fileList.image2.length >= 1 ? null : (
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
              <Input
                className="form-control"
                type="text"
                name="breed"
                value={formValue.breed}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Kích thước trung bình:</label>
              <Input
                className="form-control"
                type="text"
                name="size"
                value={formValue.size}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Số lượng:</label>
              <Input
                className="form-control"
                type="number"
                name="quantity"
                value={formValue.quantity}
                min={1}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Tình trạng sức khỏe:</label>
              <Input
                className="form-control"
                type="text"
                name="healthStatus"
                value={formValue.healthStatus}
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
              <Input
                className="form-control"
                type="text"
                name="type"
                value={formValue.type}
                onChange={handleChange}
                required
              />
            </div>
            {formValue.type === "Ký gửi" && (
              <div>
                <label className="form-label">Loại hình ký gửi:</label>
                <Input
                  className="form-control"
                  type="text"
                  name="consignmentType"
                  value={formValue.consignmentType || "Ký gửi để bán"}
                  readOnly
                />
              </div>
            )}
            <div>
              <label className="form-label">Giá:</label>
              <Input
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

export default EditProductComboModal;
