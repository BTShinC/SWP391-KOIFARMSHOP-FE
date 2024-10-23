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
import { useEffect, useState } from "react";
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import "./index.scss";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

CareForm.propTypes = {
  carePackage: PropTypes.object.isRequired,
};

function CareForm({ carePackage }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [certFileList, setCertFileList] = useState([]);
  const [previewCertImage, setPreviewCertImage] = useState("");
  const user = useSelector((state) => state?.user);
  console.log(user);

  // Cập nhật giá trị cho carePackageID khi dữ liệu sẵn sàng
  useEffect(() => {
    if (carePackage?.carePackageID) {
      setValue("carePackageID", carePackage.carePackageID);
    }
  }, [carePackage, setValue]);

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
      image: uploadedImages[0]?.url || "",
      image1: uploadedImages[1]?.url || "",
      image2: uploadedImages[2]?.url || "",
      certificate: uploadedCerts[0]?.url || "",
      accountID: user?.accountID,
      price: carePackage?.price,
      type: "Ký gửi",
      consignmentType: "chăm sóc",
      status: "Chờ xác nhận",
      desiredPrice: carePackage?.price,
      productName: uuidv4(),
      reason: "",
      farmName: "",
      consignmentDate: consignmentDate,
      total: carePackage.price
    };
    console.log(
      "Form data with uploaded images and certifications cá thể:",
      finalData
    );
    localStorage.setItem("careForm", JSON.stringify(finalData));
    navigation("/consignmentPayment", { state: finalData });
  };

  useEffect(() => {
    // Lấy dữ liệu từ localStorage khi trang tải lại
    const savedFormValue = localStorage.getItem("careForm");
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
  const consignmentDate = format(new Date(), "yyyy-MM-dd");
  const getTodayAndThreeDaysLater = () => {
    const today = format(new Date(), "dd/MM/yyyy"); // Ngày hôm nay
    const threeDaysLater = format(addDays(new Date(), 3), "dd/MM/yyyy"); // 3 ngày sau
    return { today, threeDaysLater };
  };
  const getTodayDatePlus30DaysAndThreeDaysLater = () => {
    const today = new Date();
    const todayPlus30Days = format(addDays(today, 30), "dd/MM/yyyy"); // 30 ngày sau
    const threeDaysAfter30Days = format(addDays(today, 33), "dd/MM/yyyy"); // 33 ngày sau (3 ngày sau 30 ngày)

    return { todayPlus30Days, threeDaysAfter30Days };
  };

  const { today, threeDaysLater } = getTodayAndThreeDaysLater();
  const { todayPlus30Days, threeDaysAfter30Days } =
    getTodayDatePlus30DaysAndThreeDaysLater();

  const navigation = useNavigate();

  return (
    <div className="care-form" style={{ padding: "2rem" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("carePackageID")} />
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
            Ký gửi chăm sóc cá thể
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
                {...register("size", {
                  required: "Vui lòng nhập Kích thước",
                  min: {
                    value: 1,
                    message: "Kích thước phải lớn hơn hoặc bằng 1",
                  },
                })}
                label="Kích thước"
                type="number"
                fullWidth
                error={!!errors.size}
                helperText={errors.size?.message}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("age", {
                  required: "Vui lòng nhập tuổi",
                })}
                label="Số năm tuổi cá"
                fullWidth
                error={!!errors.age}
                helperText={errors.age?.message}
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
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                {...register("personalityTrait", {
                  required: "Vui lòng nhập tính cách cá",
                })}
                label="Tính cách cá"
                fullWidth
                error={!!errors.personalityTrait}
                helperText={errors.personalityTrait?.message}
              />
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Thông tin khách hàng
              </Typography>
            </Box>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                label="Họ và tên"
                fullWidth
                value={user?.fullName || ""}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 3 }}>
              <TextField
                label="Email"
                fullWidth
                value={user?.email || ""}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 3 }}>
              <TextField
                label="Số điện thoại"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={user?.phoneNumber || ""}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
              />
            </Grid>

            <Grid item xs={12} sx={{ marginBottom: 3 }}>
              <TextField
                label="Gói chăm sóc"
                fullWidth
                value={carePackage?.packageName || ""}
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
                value={new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(carePackage?.price || 0)}
                disabled
                className="highlighted-textfield"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginBottom: 2 }}>
              <TextField
                label="Tổng thời gian"
                fullWidth
                value={`${carePackage?.duration || 0} ngày`}
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
                fullWidth
                defaultValue="Không"
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
