import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addDays, format } from "date-fns";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import { fetchAllCarePackages } from "../../../service/userService";
import { v4 as uuidv4 } from "uuid";
CareFormCombo.propTypes = {
  id: PropTypes.number.isRequired,
};

function CareFormCombo({ id }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [koiCarePackages, setKoiCarePackages] = useState([]);
  const navigation = useNavigate();

  const getAllCarePackages = useCallback(async () => {
    try {
      let res = await fetchAllCarePackages();
      if (res && res.data) {
        setKoiCarePackages(res.data);
        console.log("koiCarePackages =>", res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllCarePackages();
  }, [getAllCarePackages]);
  // Lấy thông tin user + thông tin gói chăm sóc
  const user = useSelector((state) => state.user.account);
  console.log(user);
  const carePackageID = id;
  console.log("carePackageID =>", carePackageID);

  const carePackage = koiCarePackages.find((item) => {
    return item.carePackageID === id;
  });
  const getTodayDate = () => {
    return format(new Date(), "yyyy-MM-dd");
  };
  const getTodayDatePlus30Days = () => {
    const today = new Date();
    const futureDate = addDays(today, 30);
    return format(futureDate, "yyyy-MM-dd");
  };
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

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi trang tải lại
    const savedFormValue = localStorage.getItem("careFormCombo");
    if (savedFormValue) {
      const parsedFormValue = JSON.parse(savedFormValue);
      Object.keys(parsedFormValue).forEach((key) =>
        setValue(key, parsedFormValue[key])
      );
      console.log("Form values loaded from localStorage:", parsedFormValue);
    }
  }, [setValue]);

  // Upload ảnh lên Firebase
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
    const uploadedImages = await uploadFilesToFirebase(fileList);
    const finalData = {
      ...data,
      image: uploadedImages[0]?.url,
      image1: uploadedImages[1]?.url,
      image2: uploadedImages[2]?.url,
      comboName: uuidv4(),
      type: "Ký gửi",
      accountID: user?.accountID,
      consignmentType: "chăm sóc",
      carePackageID : carePackage?.carePackageID,
      price: carePackage?.price,
      status: "Chờ xác nhận",
      desiredPrice: carePackage?.price,
    };
    console.log(
      "Form data with uploaded images and certifications combo:",
      finalData
    );
    localStorage.setItem("careFormCombo", JSON.stringify(finalData));
    navigation("/consignmentPayment", { state: finalData });
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
          <Button
            variant="contained"
            className="back-button"
            onClick={() => navigation(-1)}
          >
            Trở lại
          </Button>
        </Box>
        <Box>
          <Typography variant="h2" className="title-typography">
            Ký gửi chăm sóc theo lô
          </Typography>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Box>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Thông tin cá ký gửi
              </Typography>
            </Box>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <Typography>Ảnh lô cá</Typography>
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
                {...register("size", { required: "Vui lòng nhập kích thước" })}
                label="Kích thước trung bình"
                fullWidth
                type="number"
                min={1}
                error={!!errors.size}
                helperText={errors.size?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">cm</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("quantity", {
                  required: "Vui lòng số lượng",
                  min: {
                    value: 2,
                    message: "Số lượng phải lớn hơn hoặc bằng 2",
                  },
                })}
                label="Số lượng cá"
                type="number"
                fullWidth
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
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
            <Box>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Thông tin khách hàng
              </Typography>
            </Box>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
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
                value={carePackage?.packageName}
                disabled
                className="highlighted-textfield"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                label="Tổng chi phí"
                fullWidth
                value={`${new Intl.NumberFormat("vi-VN").format(
                  carePackage?.price || 0
                )} VNĐ`}
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
              />
            </Grid>
            <input
              type="hidden"
              value={user.accountID}
              {...register("accountID")}
            />
          </Grid>
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

export default CareFormCombo;
