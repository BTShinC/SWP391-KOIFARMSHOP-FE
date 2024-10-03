import api from "../config/api";

const Register = async (data) => {
  try {
    const response = await api.post("Register", data);
    return response.data; // Trả về dữ liệu từ API nếu cần
  } catch (error) {
    console.error("Error registering:", error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const ChangePassword = async (data) => {
  try {
    const response = await api.post("reset", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const sendEmailToRecoveryPassword = async (data) => {
  try {
    const response = await api.post("forgot", data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const fetchAllUser = async () => {
  try {
    const response = await api.get("account");
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const fetchAllProduct = async () => {
  try {
    const response = await api.get("products");
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const editFishInfo = async (data) => {
  try {
    const response = await api.put(`products/${data.id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

const addFish = async (data) => {
  try {
    const response = await api.post(`products`, data);
    return response;
  } catch (error) {
    console.error(error);
    throw error; // Ném lỗi ra ngoài để xử lý trong hàm gọi
  }
};

export {
  Register,
  ChangePassword,
  sendEmailToRecoveryPassword,
  fetchAllUser,
  fetchAllProduct,
  editFishInfo,
  addFish,
};
