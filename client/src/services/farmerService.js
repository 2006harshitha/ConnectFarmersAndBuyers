import axios from "axios";

const API_URL = "http://localhost:5000/api/farmers";

// Get farmer products by username
const getFarmerProducts = (username) => {
  return axios.get(`${API_URL}/products/${username}`);
};

// Add a new product
const addProduct = (productData) => {
  return axios.post(`${API_URL}/products`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
// Search products by query (name or category)
const searchProducts = (query) => {
  return axios.get(`${API_URL}/products/search`, { params: { query } });
};

const farmerService = {
  getFarmerProducts,
  addProduct,
  searchProducts, // ✅ add this
};

export default farmerService;
