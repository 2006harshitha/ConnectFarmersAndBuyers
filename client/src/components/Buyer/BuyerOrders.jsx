import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import { useAuth } from "../../context/authContext";
import styled from "styled-components";

const OrdersContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const OrderCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const OrderTitle = styled.h3`
  margin: 0 0 1rem;
  color: #2c3e50;
  font-size: 1.2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

const OrderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  padding: 0.3rem 0;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #34495e;
`;

const DetailValue = styled.span`
  color: #7f8c8d;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.status === "Delivered"
      ? "#2ecc71"
      : props.status === "Shipped"
      ? "#3498db"
      : "#f39c12"};
  color: white;
`;

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.username) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await orderService.getBuyerOrders(user.username);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <OrdersContainer>
      <h2 style={{ color: "#2c3e50", marginBottom: "1.5rem" }}>Your Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderTitle>Order #{order._id.slice(-6).toUpperCase()}</OrderTitle>

            <OrderDetail>
              <DetailLabel>Product:</DetailLabel>
              <DetailValue>{order.product?.name}</DetailValue>
            </OrderDetail>

            <OrderDetail>
              <DetailLabel>Quantity:</DetailLabel>
              <DetailValue>{order.quantity} kg</DetailValue>
            </OrderDetail>

            <OrderDetail>
              <DetailLabel>Total Price:</DetailLabel>
              <DetailValue>₹{order.totalPrice.toFixed(2)}</DetailValue>
            </OrderDetail>

            <OrderDetail>
              <DetailLabel>Status:</DetailLabel>
              <DetailValue>
                <StatusBadge status={order.status}>{order.status}</StatusBadge>
              </DetailValue>
            </OrderDetail>

            <OrderDetail>
              <DetailLabel>Farmer:</DetailLabel>
              <DetailValue>{order.farmerUsername}</DetailValue>
            </OrderDetail>
          </OrderCard>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#7f8c8d" }}>
          You have no orders yet.
        </p>
      )}
    </OrdersContainer>
  );
};

export default BuyerOrders;
