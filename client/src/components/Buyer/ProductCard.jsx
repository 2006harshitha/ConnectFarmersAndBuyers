import React, { memo, useState } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0);
  transition: all 0.3s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
  opacity: ${({ loaded }) => (loaded ? 1 : 0)};
  position: absolute;
  top: 0;
  left: 0;
`;

const ProductInfo = styled.div`
  padding: 1rem;
  text-align: center;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
`;

const ProductCategory = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
`;

const AddToCartButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

const ProductCard = memo(({ product, addToCart }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <CardContainer>
      <ImageContainer>
        <ProductImage
          src={
            imageError
              ? "/placeholder-product.jpg"
              : `http://localhost:5000/uploads/${product.image}`
          }
          alt={product.name}
          loaded={imageLoaded}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
      </ImageContainer>
      <ProductInfo>
        <ProductName>{product.name}</ProductName>
        <ProductCategory>{product.category}</ProductCategory>
        <ProductPrice>₹{product.pricePerKg} / kg</ProductPrice>
        <AddToCartButton onClick={() => addToCart(product)}>
          Add to Cart
        </AddToCartButton>
      </ProductInfo>
    </CardContainer>
  );
});

export default ProductCard;
