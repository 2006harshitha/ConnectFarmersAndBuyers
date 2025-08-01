import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import { useAuth } from "../../context/authContext";
import styled from "styled-components";

const OrdersContainer = styled.div`
  max-width: 1000px;
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
  transition: all 0.2s ease;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
`;

const OrderTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
`;

const OrderDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #34495e;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
`;

const DetailValue = styled.span`
  color: #7f8c8d;
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  grid-column: 1 / -1;
  max-width: 200px;
  margin-top: 0.5rem;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const StatusOption = styled.option`
  padding: 0.5rem;
`;

const NoOrdersMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.username) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await orderService.getFarmerOrders(user.username);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching farmer orders:", error);
    }
  };

  const updateStatus = async (orderId, status) => {
    await orderService.updateOrderStatus(orderId, null, status);
    fetchOrders();
  };

  return (
    <OrdersContainer>
      <h2 style={{ color: "#2c3e50", marginBottom: "1.5rem" }}>Your Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard key={order._id}>
            <OrderHeader>
              <OrderTitle>
                Order #{order._id.slice(-6).toUpperCase()}
              </OrderTitle>
              <DetailValue>Buyer: {order.buyerUsername}</DetailValue>
            </OrderHeader>

            <OrderDetail>
              <DetailLabel>Product</DetailLabel>
              <DetailValue>{order.product?.name}</DetailValue>
            </OrderDetail>

            <OrderDetail>
              <DetailLabel>Quantity</DetailLabel>
              <DetailValue>{order.quantity} kg</DetailValue>
            </OrderDetail>

            <OrderDetail>
              <DetailLabel>Price</DetailLabel>
              <DetailValue>₹{order.totalPrice?.toFixed(2)}</DetailValue>
            </OrderDetail>

            <OrderDetail>
              <DetailLabel>Current Status</DetailLabel>
              <DetailValue>{order.status}</DetailValue>
            </OrderDetail>

            <StatusSelect
              onChange={(e) => updateStatus(order._id, e.target.value)}
              value={order.status}
            >
              <StatusOption value="Pending">Pending</StatusOption>
              <StatusOption value="Shipped">Shipped</StatusOption>
              <StatusOption value="Delivered">Delivered</StatusOption>
            </StatusSelect>
          </OrderCard>
        ))
      ) : (
        <NoOrdersMessage>No orders found.</NoOrdersMessage>
      )}
    </OrdersContainer>
  );
};

export default FarmerOrders;
