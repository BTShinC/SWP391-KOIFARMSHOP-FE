import {
  Button,
  TextField,
  Grid,
  FormControlLabel,
  RadioGroup,
  FormControl,
  FormLabel,
  Radio,
} from "@mui/material";
import { useForm } from "react-hook-form";
import "./index.scss";
function CareForm() {
  const {
    register,
    handleSubmit,
    setValue,   
    formState: { errors },
  } = useForm();
  // Sử dụng state để kiểm soát giá trị của RadioGroup
  const handleGenderChange = (event) => {
    setValue("gender", event.target.value); // Cập nhật giá trị gender vào react-hook-form
  };

  const onSubmit = (data) => console.log(data);

  return (
    <div className="care-form" style={{ padding: "2rem" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Cột bên trái: Thông tin cá KOI */}
          <Grid item xs={12} md={6}>
            <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
              Thông tin cá KOI
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("breed", {
                    required: "Vui lòng nhập giống cá",
                  })}
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
                    defaultValue="Đực" // Sử dụng giá trị state
                    onChange={handleGenderChange} // Cập nhật giá trị khi người dùng thay đổi
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
                  {...register("description")}
                  label="Ghi chú"
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Cột bên phải: Thông tin người dùng */}
          <Grid item xs={12} md={6}>
            <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
              Thông tin người dùng
            </h2>
            <Grid container spacing={2}>
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
                  {...register("email", {
                    required: "Vui lòng nhập email",
                  })}
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
            </Grid>
          </Grid>
          {/* Nút Submit ở giữa */}
          <Grid item xs={12} style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default CareForm;
