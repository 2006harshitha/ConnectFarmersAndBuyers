import axios from "axios";

const API_URL = "http://localhost:5000/api/farmers"; // We are still using the same backend route

// Search products by query (name or category)
const searchProducts = (query) => {
  return axios.get(`${API_URL}/products/search`, { params: { query } });
};

const buyerService = {
  searchProducts,
};

export default buyerService;
