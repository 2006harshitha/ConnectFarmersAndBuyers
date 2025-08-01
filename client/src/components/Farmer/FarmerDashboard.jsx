// client/src/components/Farmer/FarmerDashboard.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../Layout/Navbar";
import Sidebar from "../Layout/Sidebar";
import FarmerProfile from "./FarmerProfile";
import FarmerProducts from "./FarmerProducts";
import FarmerOrders from "./FarmerOrders";
import FarmerAnalytics from "./FarmerAnalytics";
import { useAuth } from "../../context/authContext"; // Import your auth context

const DashboardContainer = styled.div`
  margin-top: 70px;
  padding: 20px;
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? "250px" : "0")};
  transition: margin-left 0.3s ease;
  min-height: calc(100vh - 70px);
  background-color: #f8fff8;
`;

const SidebarWrapper = styled.div`
  position: fixed;
  top: 70px;
  left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
  width: 250px;
  height: calc(100vh - 70px);
  transition: left 0.3s ease;
  z-index: 100;
`;

const FarmerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth(); // ✅ Correct property from context

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <SidebarWrapper isOpen={sidebarOpen}>
        <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      </SidebarWrapper>
      <DashboardContainer sidebarOpen={sidebarOpen}>
        <Routes>
          <Route
            path="profile"
            element={<FarmerProfile username={user?.username} />}
          />
          <Route path="products" element={<FarmerProducts />} />
          <Route path="orders" element={<FarmerOrders />} />

          <Route
            path="/"
            element={
              <div>
                <h2>Welcome {user?.username || "Farmer"}!</h2>
                <p>
                  Here you can manage your products, view orders, and see
                  analytics.
                </p>
              </div>
            }
          />
        </Routes>
      </DashboardContainer>
    </>
  );
};

export default FarmerDashboard;
