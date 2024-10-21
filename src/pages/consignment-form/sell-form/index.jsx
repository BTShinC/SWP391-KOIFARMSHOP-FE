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
  Typography,
} from "@mui/material";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { storage } from "../../../firebase"; // Đảm bảo bạn đã cấu hình đúng Firebase
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // Firebase storage functions
import { useForm } from "react-hook-form";
import "./index.scss";
import SellFormCombo from "../sell-form-combo";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
function SellForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi trang tải lại
    const savedFormValue = localStorage.getItem("sellForm");
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

  // State để kiểm soát file upload
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [certFileList, setCertFileList] = useState([]); // Thêm state cho chứng nhận
  const [previewCertImage, setPreviewCertImage] = useState(""); // Preview chứng nhận
  const [isBatchSell, setIsBatchSell] = useState(false); // State để theo dõi loại form
  const user = useSelector((state) => state?.user?.account);
  const navigation = useNavigate();
  // Nếu người dùng chọn ký gửi bán lô thì render component khác
  if (isBatchSell) {
    return <SellFormCombo />;
  }

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
      productName: uuidv4(),
      image: uploadedImages[0]?.url,
      image1: uploadedImages[1]?.url,
      image2: uploadedImages[2]?.url,
      certificate: uploadedCerts[0]?.url,
      status: "Chờ xác nhận",
      type: "Ký gửi",
      consignmentType: "Ký gửi để bán",
      price: data.desiredPrice,
    };

    console.log(
      "Form data with uploaded images and certifications:",
      finalData
    );
    localStorage.setItem("sellForm", JSON.stringify(finalData));
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

  return (
    <div className="care-form" style={{ padding: "2rem" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={12} className="button-container">
          {/* Nút Quay lại */}
          <Button
            onClick={() => {
              console.log("Quay lại");
              window.history.back();
            }}
            className="back-button"
          >
            Quay lại
          </Button>
          <Button
            onClick={() => {
              setIsBatchSell(true);
            }}
            className="batch-sell-button"
          >
            Chuyển sang ký gửi bán lô
          </Button>
        </Grid>
        <Box>
          <Typography variant="h2" className="title-typography">
            Ký gửi bán cá thể ONLINE
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
              {fileList.length >= 3 ? null : uploadButton}
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
              {...register("age", {
                required: "Vui lòng nhập tuổi cá",
                min: 1,
              })}
              label="Số tháng tuổi"
              fullWidth
              type="number"
              error={!!errors.age}
              helperText={errors.age?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register("size", {
                required: "Vui lòng nhập kích thước",
              })}
              label="Kích thước ( cm ) "
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              error={!!errors.size}
              helperText={errors.size?.message}
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
            <FormControl fullWidth>
              <FormLabel id="demo-radio-buttons-group-label">
                Giới tính
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Đực"
                onChange={(event) => setValue("sex", event.target.value)}
              >
                <FormControlLabel
                  value="Đực"
                  control={<Radio />}
                  label="Đực"
                  {...register("sex")}
                />
                <FormControlLabel
                  value="Cái"
                  control={<Radio />}
                  label="Cái"
                  {...register("sex")}
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
              {...register("personalityTrait", {
                required: "Vui lòng nhập tính cách cá",
              })}
              label="Tính cách"
              fullWidth
              error={!!errors.personalityTrait}
              helperText={errors.personalityTrait?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <Box marginBottom={2}>
              <Typography variant="h5">Thông tin khách hàng</Typography>
            </Box>
            <TextField
              label="Họ và tên"
              defaultValue={user?.fullName}
              fullWidth
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
              defaultValue={user?.phoneNumber}
              fullWidth
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

export default SellForm;
