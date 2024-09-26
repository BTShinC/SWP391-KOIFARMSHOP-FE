import "./index.scss";
import { useState } from "react";
function AddFish() {
  const [formData, setFormData] = useState({
    breed: "",
    size: "",
    sex: "",
    healthStatus: "",
    personalityTrait: "",
    origin: "",
    description: "",
    image: "",
    price: "",
    certificate: "",
    type: "",
    quality: "",
    status: "",
    koiConsignmentID: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };


  return (
    <div className="add-fish-page">
      <div className="add-fish-container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              name="breed"
              placeholder="Giống cá"
              onChange={handleChange}
            />
            <input
              type="text"
              name="size"
              placeholder="Kích thước"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <input
              type="text"
              name="sex"
              placeholder="Giới tính"
              onChange={handleChange}
            />
            <input
              type="text"
              name="healthStatus"
              placeholder="Trạng thái sức khỏe"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <input
              type="text"
              name="personalityTrait"
              placeholder="Tập tính"
              onChange={handleChange}
            />
            <input
              type="text"
              name="origin"
              placeholder="Nguồn gốc"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <textarea
              name="description"
              placeholder="Mô tả"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="row">
            {" "}
            <input
              type="text"
              name="image"
              placeholder="Hình ảnh"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <input
              type="number"
              name="price"
              placeholder="Giá"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <input
              type="text"
              name="certificate"
              placeholder="Chứng nhận"
              onChange={handleChange}
            />{" "}
          </div>
          <div className="row">
            <select name="type" onChange={handleChange} required>
              <option value="">Phân loại</option>
              <option value="Ký gửi">Consignment</option>
              <option value="Nông trại">Farm</option>
            </select>
            <input
              type="text"
              name="quality"
              placeholder="Chất lượng"
              required
              onChange={handleChange}
            />
          </div>
          <div className="row">
            <select name="status" onChange={handleChange} required>
              <option value="">Trạng thái</option>
              <option value="Done">Done</option>
            </select>
            <input
              type="text"
              name="koiConsignmentID"
              placeholder="ID Ký gửi"
              onChange={handleChange}
            />
          </div>
          <div className="row">
            {" "}
            <input
              type="number"
              name="quantity"
              placeholder="Số lượng"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Thêm cá</button>
        </form>
      </div>
    </div>
  );

}

export default AddFish;
