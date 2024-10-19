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
import { addDays, format } from "date-fns";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import "./index.scss";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
CareForm.propTypes = {
  id: PropTypes.number.isRequired,
};
function CareForm({ id }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const koiCarePackages = [
    {
      id: 1,
      title: "Gói chăm sóc cá Koi tiêu chuẩn",
      price: "1.500.000đ/tháng",
      description:
        "Bao gồm kiểm tra sức khỏe định kỳ và tư vấn chăm sóc cá Koi.",
      services: [
        "Kiểm tra chất lượng nước",
        "Kiểm tra sức khỏe cá",
        "Tư vấn dinh dưỡng",
      ],
      image: "/images/cakoi2.webp",
    },
    {
      id: 2,
      title: "Gói chăm sóc cá Koi nâng cao",
      price: "3.000.000đ/tháng",
      description: "Dịch vụ chăm sóc chuyên sâu cho các giống cá Koi quý hiếm.",
      services: ["Kiểm tra chuyên sâu", "Điều trị bệnh cá", "Chăm sóc định kỳ"],
      image: "/images/a.jpg",
    },
    {
      id: 3,
      title: "Gói chăm sóc cá Koi VIP",
      price: "5.000.000đ/tháng",
      description:
        "Dịch vụ cao cấp bao gồm chăm sóc, điều trị, và tư vấn toàn diện.",
      services: ["Chăm sóc 24/7", "Tư vấn chuyên gia", "Bảo hiểm sức khỏe cá"],
      image: "/images/ca-koi-chat-luong.webp",
    },
    {
      id: 4,
      title: "Gói lên màu cho cá Koi",
      price: "3.500.000đ/tháng",
      description:
        "Dịch vụ chuyên nghiệp giúp tăng cường màu sắc cá Koi, cải thiện sức khỏe và ngoại hình.",
      services: [
        "Chăm sóc dinh dưỡng đặc biệt",
        "Kiểm tra định kỳ tình trạng màu sắc",
        "Tư vấn điều chỉnh chế độ chăm sóc",
      ],
      image: "/images/image 111.png",
    },
  ];
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [certFileList, setCertFileList] = useState([]);
  const [previewCertImage, setPreviewCertImage] = useState("");
  const user = useSelector((state) => state.user.account);
  console.log(user);
  const carePackageID = id;
  console.log("carePackageID =>", carePackageID);

  const carePackage = koiCarePackages.find((item) => {
    return item.id === id;
  });

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

  const handleCertChange = ({ fileList: newCertFileList }) => {
    setCertFileList(newCertFileList);
  };

  // Upload ảnh và chứng nhận lên Firebase
  const uploadFilesToFirebase = async (files) => {
    const uploadPromises = files.map((fileObj) => {
      const file = fileObj.originFileObj;
      const storageRef = ref(storage, `upload/${file.name}`);

      return uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((downloadURL) => ({
          name: file.name,
          url: downloadURL,
        }))
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles;
    } catch (error) {
      console.error("Error uploading files:", error);
      return [];
    }
  };

  // Xử lý submit form
  const onSubmit = async (data) => {
    const uploadedImages = await uploadFilesToFirebase(fileList);
    const uploadedCerts = await uploadFilesToFirebase(certFileList);

    const finalData = {
      ...data,
      images: uploadedImages,
      certifications: uploadedCerts,
    };

    console.log(
      "Form data with uploaded images and certifications:",
      finalData
    );
    navigation("/consignmentPayment", { state: finalData });
  };

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

  const getTodayDate = () => {
    return format(new Date(), "yyyy-MM-dd");
  };
  const getTodayDatePlus30Days = () => {
    const today = new Date();
    const futureDate = addDays(today, 30);
    return format(futureDate, "yyyy-MM-dd");
  };
  const navigation = useNavigate();

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
            <Grid item xs={12} sx={{ marginBottom: 3 }}>
              <Typography>Ảnh cá</Typography>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
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
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
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

            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("breed", { required: "Vui lòng nhập giống cá" })}
                label="Giống cá"
                fullWidth
                error={!!errors.breed}
                helperText={errors.breed?.message}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 2 }}>
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

            <Grid item xs={12} sx={{ marginBottom: 2 }}>
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

            <Grid item xs={12} sx={{ marginBottom: 2 }}>
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
          </Grid>
          <Grid item xs={6}>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("fullName", {
                  required: "Vui lòng nhập họ và tên",
                })}
                label="Họ và tên"
                fullWidth
                value={user.fullName}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("email", { required: "Vui lòng nhập email" })}
                label="Email"
                fullWidth
                value={user.email}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("phoneNumber", {
                  required: "Vui lòng nhập số điện thoại",
                })}
                label="Số điện thoại"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={user.phoneNumber}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                label="Gói chăm sóc"
                fullWidth
                value={carePackage.title}
                disabled
                className="highlighted-textfield"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <input
                type="hidden"
                {...register("carePackageID")} 
                value={carePackage.id}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                label="Tổng chi phí"
                fullWidth
                value={carePackage.price}
                disabled
                className="highlighted-textfield"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 3.5 }}>
              <TextField
                label="Thời gian dự kiến nhận cá"
                fullWidth
                value={getTodayDate()}
                disabled
                className="highlighted-textfield"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                label="Thời gian dự kiến nhận lại cá"
                fullWidth
                value={getTodayDatePlus30Days()}
                disabled
                className="highlighted-textfield"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("description")}
                label="Ghi chú"
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
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
