// client/src/components/Farmer/FarmerProducts.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/authContext";
import farmerService from "../../services/farmerService";
import ProductForm from "./ProductForm";

const ProductsContainer = styled.div`
  margin-top: 70px;
  padding: 20px;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? "250px" : "0")};
  transition: margin-left 0.3s ease;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #2e7d32;
`;

const AddButton = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1b5e20;
  }
`;

const ProductsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  margin: 0 0 10px;
  color: #2e7d32;
`;

const ProductDetail = styled.p`
  margin: 5px 0;
  color: #555;
`;

const FarmerProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!user || !user.username) return; // ✅ Wait until user is loaded
        const response = await farmerService.getFarmerProducts(user.username);
        console.log("Fetched products:", response.data); // ✅ Add this
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddProduct = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
    setShowForm(false);
  };

  return (
    <>
      <ProductsContainer sidebarOpen={sidebarOpen}>
        <ProductsHeader>
          <Title>Your Products</Title>
          <AddButton onClick={handleAddProduct}>+ Add Product</AddButton>
        </ProductsHeader>

        {showForm ? (
          <ProductForm
            onClose={handleFormClose}
            onProductAdded={handleProductAdded}
          />
        ) : (
          <ProductsList>
            {products.map((product) => (
              <ProductCard key={product._id}>
                <ProductImage
                  src={`${
                    process.env.REACT_APP_API_URL || "http://localhost:5000"
                  }/uploads/${product.image}`}
                  alt={product.name}
                />

                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductDetail>Product ID: {product.productId}</ProductDetail>
                  <ProductDetail>Category: {product.category}</ProductDetail>
                  <ProductDetail>Price: ₹{product.pricePerKg}/kg</ProductDetail>
                  <ProductDetail>
                    Available: {product.quantity} kg
                  </ProductDetail>
                  <ProductDetail>
                    Expires: {new Date(product.expiryDate).toLocaleDateString()}
                  </ProductDetail>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductsList>
        )}
      </ProductsContainer>
    </>
  );
};

export default FarmerProducts;
