import {
  Button,
  TextField,
  Grid,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
  Box,
  Typography
} from "@mui/material";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { storage } from "../../../firebase"; // Đảm bảo bạn đã cấu hình đúng Firebase
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Firebase storage functions
import { useForm } from "react-hook-form";
import "./index.scss";

function CareForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // State để kiểm soát file upload
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [certFileList, setCertFileList] = useState([]); // Thêm state cho chứng nhận
  const [previewCertImage, setPreviewCertImage] = useState(""); // Preview chứng nhận

  // Preview ảnh khi chọn
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Preview ảnh khi chọn (Chứng nhận)
  const handleCertPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewCertImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Xử lý thay đổi file list
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Xử lý thay đổi chứng nhận
  const handleCertChange = ({ fileList: newCertFileList }) => {
    setCertFileList(newCertFileList); // Xử lý file chứng nhận
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
    const uploadedCerts = await uploadFilesToFirebase(certFileList); // Upload file chứng nhận

    const finalData = {
      ...data,
      images: uploadedImages, // Thêm URL ảnh đã upload vào dữ liệu form
      certifications: uploadedCerts, // Thêm URL chứng nhận vào dữ liệu form
    };

    console.log(
      "Form data with uploaded images and certifications:",
      finalData
    ); // Xem dữ liệu và URL
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

  return (
    <div className="care-form" style={{ padding: "2rem" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography variant="h2" className="title-typography">
            Ký gửi cá thể
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography>Ảnh cá</Typography>
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

          <Grid item xs={6}>
            <Typography>Ảnh chứng nhận</Typography>
            <Upload
              listType="picture-card"
              fileList={certFileList}
              onPreview={handleCertPreview}
              onChange={handleCertChange}
              beforeUpload={() => false}
            >
              {certFileList.length >= 1 ? null : uploadButton}
            </Upload>
            {previewCertImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewCertImage}
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
            <FormControl fullWidth>
              <FormLabel id="demo-radio-buttons-group-label">
                Giới tính
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Đực"
                onChange={(event) => setValue("gender", event.target.value)}
              >
                <FormControlLabel
                  value="Đực"
                  control={<Radio />}
                  label="Đực"
                  {...register("gender")}
                />
                <FormControlLabel
                  value="Cái"
                  control={<Radio />}
                  label="Cái"
                  {...register("gender")}
                />
              </RadioGroup>
            </FormControl>
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
            <TextField
              {...register("fullName", {
                required: "Vui lòng nhập họ và tên",
              })}
              label="Họ và tên"
              fullWidth
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...register("email", { required: "Vui lòng nhập email" })}
              label="Email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...register("phoneNumber", {
                required: "Vui lòng nhập số điện thoại",
              })}
              label="Số điện thoại"
              fullWidth
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Gói chăm sóc"
              fullWidth
              value="GÓI CHĂM SÓC ĐẶC BIỆT" // Giá trị cố định
              disabled // Trường bị disable
              className="highlighted-textfield" // Áp dụng SCSS
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

export default CareForm;