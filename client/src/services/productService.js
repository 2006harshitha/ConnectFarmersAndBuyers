import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

export const addProduct = (productData) => axios.post(API_URL, productData);
export const getFarmerProducts = (farmerId) =>
  axios.get(`${API_URL}/${farmerId}`);
export const updateProduct = (id, productData) =>
  axios.put(`${API_URL}/${id}`, productData);
export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);
