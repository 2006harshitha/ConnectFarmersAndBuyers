import React, { useEffect, useState } from "react";
import cartService from "../../services/cartService";
import orderService from "../../services/orderService";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const CartTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
`;

const EmptyCart = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 3rem;
`;

const CartList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CartItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
  border-bottom: 1px solid #eee;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1.5rem;
`;

const ProductName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

const ProductPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #28a745;
  min-width: 100px;
  text-align: right;
  margin-right: 2rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const QuantityDisplay = styled.span`
  width: 40px;
  text-align: center;
  font-size: 1rem;
`;

const RemoveButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;

  &:hover {
    background: #cc0000;
  }
`;

const CartSummary = styled.div`
  text-align: right;
  margin-top: 2rem;
  font-size: 1.2rem;
  color: #333;
`;

const BuyNowButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #218838;
  }
`;

const BuyerCart = ({ buyerUsername }) => {
  const [cart, setCart] = useState({ items: [] });
  const [total, setTotal] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCart = async () => {
    const { data } = await cartService.getCart(buyerUsername);
    setCart(data);
    setTotal(
      data.items?.reduce(
        (sum, item) => sum + item.product.pricePerKg * item.quantity,
        0
      ) || 0
    );
  };

  useEffect(() => {
    fetchCart();
  }, [buyerUsername]);

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    await cartService.updateCartItem(buyerUsername, productId, quantity);
    fetchCart();
  };

  const handleRemove = async (productId) => {
    await cartService.removeCartItem(buyerUsername, productId);
    fetchCart();
  };

  const handleBuyNow = async () => {
    console.log("[BuyerCart] Buy Now clicked");
    console.log("[BuyerCart] User:", user);

    try {
      console.log("[BuyerCart] Sending order request...");
      const response = await orderService.placeOrder({
        buyerUsername: user.username,
      });

      console.log("[BuyerCart] Order placed successfully:", response.data);
      alert("Order placed successfully!");
      fetchCart();
    } catch (error) {
      console.error(
        "[BuyerCart] Failed to place order:",
        error.response?.data || error.message
      );
      alert(
        "Failed to place order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <CartContainer>
      <CartTitle>Your Shopping Cart</CartTitle>
      {cart.items.length === 0 ? (
        <EmptyCart>Your cart is empty</EmptyCart>
      ) : (
        <>
          <CartList>
            {cart.items.map((item) => (
              <CartItem key={item.product._id}>
                <ProductInfo>
                  <ProductImage
                    src={`http://localhost:5000/uploads/${item.product.image}`}
                    alt={item.product.name}
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                  />
                  <ProductName>{item.product.name}</ProductName>
                </ProductInfo>

                <ProductPrice>₹{item.product.pricePerKg}</ProductPrice>

                <QuantityControl>
                  <QuantityButton
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity - 1)
                    }
                  >
                    −
                  </QuantityButton>
                  <QuantityDisplay>{item.quantity}</QuantityDisplay>
                  <QuantityButton
                    onClick={() =>
                      handleQuantityChange(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </QuantityButton>
                </QuantityControl>

                <RemoveButton onClick={() => handleRemove(item.product._id)}>
                  Remove
                </RemoveButton>
              </CartItem>
            ))}
          </CartList>

          <CartSummary>
            <p>Total Items: {cart.items.length}</p>
            <p>Total Amount: ₹{total}</p>
            <BuyNowButton onClick={handleBuyNow}>Buy Now</BuyNowButton>
          </CartSummary>
        </>
      )}
    </CartContainer>
  );
};

export default BuyerCart;
