import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import { Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
SellFormCombo.propTypes = {
  isOnline: PropTypes.bool,
};

function SellFormCombo({ isOnline }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    getValues,
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
  const user = useSelector((state) => state?.user);
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
    const uploadPromises = files.map(async (fileObj) => {
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
      return uploadedFiles.filter(Boolean); // Loại bỏ những file upload thất bại
    } catch (error) {
      console.error("Error uploading files:", error);
      return [];
    }
  };

  // Xử lý submit form
  const onSubmit = async (data) => {
    try {
      // Kiểm tra số lượng ảnh
      if (fileList.length < 3) {
        toast.error("Vui lòng upload đủ 3 hình ảnh");
        return;
      }

      // Bắt đầu upload ảnh song song
      const uploadedImages = await uploadFilesToFirebase(fileList);

      // Kiểm tra xem tất cả ảnh có được upload thành công không
      if (uploadedImages.length < 3) {
        toast.error("Vui lòng đảm bảo tất cả hình ảnh được upload thành công");
        return;
      }

      const consignmentDate = format(new Date(), "yyyy-MM-dd");
      const finalData = {
        ...data,
        image: uploadedImages[0]?.url,
        image1: uploadedImages[1]?.url,
        image2: uploadedImages[2]?.url,
        type: "Ký gửi",
        consignmentType: "Ký gửi để bán",
        price: parseFloat(data.desiredPrice.replace(/\./g, "").replace(",", ".")),
        status: "Chờ xác nhận",
        comboName: uuidv4(),
        salePrice: parseFloat(data.desiredPrice.replace(/\./g, "").replace(",", ".")), 
        reason: "Vui lòng mang cá đến trang trại để hoàn thành thủ tục",
        formType: "sellFormCombo",
        consignmentDate: consignmentDate,
        desiredPrice: parseFloat(data.desiredPrice.replace(/\./g, "").replace(",", ".")),
      };

      console.log("Form data with uploaded images:", finalData);

      // Lưu dữ liệu vào localStorage
      localStorage.setItem("sellFormCombo", JSON.stringify(finalData));

      // Điều hướng đến trang tiếp theo
      navigation("/consignmentSellPayment", { state: finalData });
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Có lỗi xảy ra trong quá trình xử lý form");
    }
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
            Ký gửi theo lô {isOnline ? "Online" : "Offline"}
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
          {isOnline && (
            <Grid item xs={12}>
              <TextField
                {...register("farmName", {
                  required: "Vui lòng nhập đường dẫn trang trại của bạn",
                  pattern: {
                    value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/,
                    message:
                      "Vui lòng nhập một đường dẫn hợp lệ (bắt đầu bằng http hoặc https)",
                  },
                })}
                label="Đường dẫn trang trại của bạn"
                type="url"
                fullWidth
                error={!!errors.farmName}
                helperText={errors.farmName?.message}
              />
            </Grid>
          )}
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
                min: {
                  value: 500000,
                  message: "Giá bán mong đợi phải lớn hơn 500,000",
                },
                validate: (value) =>
                  !isNaN(parseInt(value.replace(/\./g, ""), 10)) ||
                  "Vui lòng nhập số hợp lệ",
              })}
              fullWidth
              type="text"
              inputProps={{ inputMode: "numeric", pattern: "[0-9.]*" }} // Chấp nhận số và dấu chấm
              error={!!errors.desiredPrice}
              helperText={errors.desiredPrice?.message}
              value={
                getValues("desiredPrice")
                  ?.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".") || ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\./g, ""); // Loại bỏ dấu chấm
                setValue("desiredPrice", rawValue); // Cập nhật giá trị mà không có dấu chấm
                trigger("desiredPrice"); // Kiểm tra lại trường này
              }}
              className="highlighted-textfield"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Số ngày dự định ký gửi"
              {...register("duration", {
                required: "Vui lòng nhập số ngày dự định ký gửi",
              })}
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
              error={!!errors.duration}
              helperText={errors.duration?.message}
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
              defaultValue="không"
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
