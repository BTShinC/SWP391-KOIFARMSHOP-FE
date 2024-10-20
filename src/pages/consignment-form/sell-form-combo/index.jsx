import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { storage } from "../../../firebase"; // Đảm bảo bạn đã cấu hình đúng Firebase
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Firebase storage functions
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function SellFormCombo() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi trang tải lại
    const savedFormValue = localStorage.getItem("sellFormCombo");
    if (savedFormValue) {
      const parsedFormValue = JSON.parse(savedFormValue);
      Object.keys(parsedFormValue).forEach((key) =>
        setValue(key, parsedFormValue[key])
      );
      console.log(
        "Form values loaded from localStorage cá thể:",
        parsedFormValue
      );
    }
  }, [setValue]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const user = useSelector((state) => state.user.account);
  // Preview ảnh khi chọn
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Xử lý thay đổi file list
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Upload ảnh và chứng nhận lên Firebase
  const uploadFilesToFirebase = async (files) => {
    const uploadPromises = files.map((fileObj) => {
      const file = fileObj.originFileObj;
      const storageRef = ref(storage, `upload/${file.name}`); // Tạo reference trong Firebase Storage

      return uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef)) // Lấy URL sau khi upload
        .then((downloadURL) => ({
          name: file.name,
          url: downloadURL, // Trả về URL của file sau khi upload
        }))
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises); // Chờ tất cả các file được upload
      return uploadedFiles; // Trả về danh sách file đã upload
    } catch (error) {
      console.error("Error uploading files:", error);
      return [];
    }
  };
  // Xử lý submit form
  const onSubmit = async (data) => {
    const uploadedImages = await uploadFilesToFirebase(fileList); // Upload file hình ảnh cá KOI
    const finalData = {
      ...data,
      image: uploadedImages[0]?.url,
      image1: uploadedImages[1]?.url,
      image2: uploadedImages[2]?.url,
      type: "Ký gửi",
      consignmentType: "Ký gửi để bán",
      price: 1,
    };
    console.log(
      "Form data with uploaded images and certifications:",
      finalData
    );
    localStorage.setItem("sellFormCombo", JSON.stringify(finalData));
    navigation("/consignmentSellPayment", { state: finalData });
  };

  // Nút upload ảnh và chứng nhận
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const navigation = useNavigate();
  return (
    <div className="care-form" style={{ padding: "2rem" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} className="button-container">
          <Button
            onClick={() => {
              console.log("Quay lại");
              navigation(-1);
            }}
            className="back-button"
          >
            Quay lại
          </Button>
        </Grid>
        <Box>
          <Typography variant="h2" className="title-typography">
            Ký gửi theo lô ONLINE
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography>Ảnh lô cá</Typography>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false} // Tắt tự động upload
            >
              {fileList.length >= 4 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewImage}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("breed", { required: "Vui lòng nhập giống cá" })}
              label="Giống cá"
              fullWidth
              error={!!errors.breed}
              helperText={errors.breed?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("size", {
                required: "Vui lòng kích thước trung bình",
              })}
              label="Kích thước trung bình"
              fullWidth
              error={!!errors.size}
              helperText={errors.size?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("quantity", {
                required: "Vui lòng nhập số lượng",
              })}
              label="Số lượng"
              fullWidth
              type="number"
              inputProps={{ min: 7 }}
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Giá bán mong đợi"
              {...register("desiredPrice", {
                required: "Vui lòng nhập giá bạn mong muốn",
              })}
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              error={!!errors.desiredPrice}
              helperText={errors.desiredPrice?.message}
              className="highlighted-textfield"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Số ngày dự định ký gửi"
              {...register("day", {
                required: "Vui lòng nhập số ngày dự định ký gửi",
              })}
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              error={!!errors.day}
              helperText={errors.day?.message}
              className="highlighted-textfield"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("origin", {
                required: "Vui lòng nhập nguồn gốc",
              })}
              label="Nguồn gốc"
              fullWidth
              error={!!errors.origin}
              helperText={errors.origin?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("healthStatus", {
                required: "Vui lòng nhập tình trạng sức khỏe cá",
              })}
              label="Tình trạng sức khỏe"
              fullWidth
              error={!!errors.healthStatus}
              helperText={errors.healthStatus?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Typography variant="h5">Thông tin khách hàng</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Họ và tên"
              fullWidth
              defaultValue={user?.fullName}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              defaultValue={user?.email}
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Số điện thoại"
              fullWidth
              defaultValue={user?.phoneNumber}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("description")}
              label="Ghi chú"
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>
          <input type="hidden" value={user.accountID} name="accountID"></input>
          {/* Nút Submit */}
          <Grid item xs={12} style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button type="submit" className="submit-form-btn">
              Xác nhận thông tin
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default SellFormCombo;
