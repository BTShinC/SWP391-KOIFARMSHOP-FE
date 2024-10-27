import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addDays, format } from "date-fns";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

CareFormCombo.propTypes = {
  carePackage: PropTypes.object.isRequired, // Truyền carePackage qua props
};

function CareFormCombo({ carePackage }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  // Lấy thông tin user từ Redux
  const user = useSelector((state) => state?.user);

  const consignmentDate = format(new Date(), "yyyy-MM-dd");
  const getTodayAndThreeDaysLater = () => {
    const today = format(new Date(), "dd/MM/yyyy");
    const threeDaysLater = format(addDays(new Date(), 3), "dd/MM/yyyy"); 
    return { today, threeDaysLater };
  };
  const getTodayDatePlus30DaysAndThreeDaysLater = () => {
    const today = new Date();
    const todayPlus30Days = format(addDays(today, 30), "dd/MM/yyyy"); 
    const threeDaysAfter30Days = format(addDays(today, 33), "dd/MM/yyyy"); 

    return { todayPlus30Days, threeDaysAfter30Days };
  };

  const { today, threeDaysLater } = getTodayAndThreeDaysLater();
  const { todayPlus30Days, threeDaysAfter30Days } =
    getTodayDatePlus30DaysAndThreeDaysLater();

  // Preview ảnh khi chọn
  const handlePreview = useCallback(async (file) => {
    if (!file.url && !file.preview) {
      file.preview = URL.createObjectURL(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  }, []);

  // Xử lý thay đổi file list
  const handleChange = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList);
  }, []);

  // Upload ảnh lên Firebase
  const uploadFilesToFirebase = useCallback(async (files) => {
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
    return await Promise.all(uploadPromises);
  }, []);

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
      consignmentType: "Ký gửi chăm sóc",
      carePackageID: carePackage?.carePackageID,
      price: carePackage?.price,
      status: "Chờ xác nhận",
      desiredPrice: carePackage?.price,
      reason: "Vui lòng mang cá đến trang trại để hoàn tất thủ tục ký gửi chăm sóc",
      farmName: "",
      consignmentDate: consignmentDate,
      today : today,
      formType :'careFormCombo',
      total: carePackage?.price,
      duration : 30,
    };
  
    console.log("Form data with uploaded images:", finalData);
    localStorage.setItem("careFormCombo", JSON.stringify(finalData));
    navigate("/consignmentPayment", { state: finalData });
  };

  // Nút upload ảnh
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
            onClick={() => navigate(-1)}
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
                beforeUpload={() => false}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("quantity", {
                  required: "Vui lòng nhập số lượng",
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
                value={`Từ ${today} tới ${threeDaysLater}`}
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
                value={`Từ ${todayPlus30Days} tới ${threeDaysAfter30Days}`}
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
                defaultValue="Không"
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
