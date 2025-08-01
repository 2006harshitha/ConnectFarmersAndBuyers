// client/src/components/Farmer/ProductForm.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/authContext";
import farmerService from "../../services/farmerService";

const FormContainer = styled.div`
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8fff8;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  color: #2e7d32;
  text-align: center;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #2e7d32;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #c8e6c9;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #2e7d32;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #c8e6c9;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #2e7d32;
  }
`;

const Button = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: #1b5e20;
  }
`;

const ProductForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    quantity: "",
    pricePerKg: "",
    totalKg: "",
    image: null,
    expiryDate: "",
  });

  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("category", formData.category);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("pricePerKg", formData.pricePerKg);
      formDataToSend.append("expiryDate", formData.expiryDate);
      formDataToSend.append("image", formData.image);
      formDataToSend.append("farmerUsername", user.username);

      const response = await farmerService.addProduct(formDataToSend);
      alert(
        `Product added successfully!\nProduct ID: ${response.data.productId}`
      );

      setFormData({
        category: "",
        name: "",
        quantity: "",
        pricePerKg: "",
        image: null,
        expiryDate: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <FormContainer>
      <FormTitle>Add New Product</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Category</Label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Item Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Quantity Available in terms of kgs</Label>
          <Input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Price per Kg (₹)</Label>
          <Input
            type="number"
            name="pricePerKg"
            value={formData.pricePerKg}
            onChange={handleChange}
            min="1"
            step="0.01"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Product Image</Label>
          <Input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Expiry Date</Label>
          <Input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            min={today}
            required
          />
        </FormGroup>

        <Button type="submit">Add Product</Button>
      </form>
    </FormContainer>
  );
};

export default ProductForm;
