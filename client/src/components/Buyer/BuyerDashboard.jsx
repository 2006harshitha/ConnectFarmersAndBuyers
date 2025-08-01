import React, { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import BuyerNavbar from "./BuyerNavbar";
import BuyerProfile from "./BuyerProfile";
import BuyerCart from "./BuyerCart";
import BuyerOrders from "./BuyerOrders";
import ProductSearch from "./ProductSearch";
import ProductCard from "./ProductCard";
import { useAuth } from "../../context/authContext";
import cartService from "../../services/cartService";

const DashboardContainer = styled.div`
  margin-top: 70px;
  padding: 2rem;
  min-height: calc(100vh - 70px);
  background-color: #f8f9fa;
`;

const SearchContainer = styled.div`
  max-width: 800px;
  margin: 0 auto 2rem;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
`;

const NoResults = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
`;

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const { user, loading } = useAuth();

  const addToCart = useCallback(
    async (product) => {
      try {
        await cartService.addToCart(user.username, product._id, 1);
        alert(`${product.name} added to cart!`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart");
      }
    },
    [user?.username]
  );

  if (loading) return <p>Loading dashboard...</p>;
  if (!user) return <p>Error: No user found. Please log in again.</p>;

  return (
    <>
      <BuyerNavbar />
      <DashboardContainer>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchContainer>
                  <ProductSearch setResults={setProducts} />
                </SearchContainer>
                {products.length > 0 ? (
                  <ProductsGrid>
                    {products.map((product) => (
                      <ProductCard
                        key={product._id} // ✅ Using _id as backend sends it
                        product={product}
                        addToCart={addToCart}
                      />
                    ))}
                  </ProductsGrid>
                ) : (
                  <NoResults>
                    Search for products to display them here.
                  </NoResults>
                )}
              </>
            }
          />
          <Route
            path="cart"
            element={<BuyerCart buyerUsername={user.username} />}
          />
          <Route
            path="orders"
            element={<BuyerOrders buyerUsername={user.username} />}
          />
          <Route path="profile" element={<BuyerProfile />} />
        </Routes>
      </DashboardContainer>
    </>
  );
};

export default BuyerDashboard;
