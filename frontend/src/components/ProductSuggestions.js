// src/components/ProductSuggestions.js
import React from 'react';
import './ProductSuggestions.css';

import img1 from '../images/1.jpg';
import img2 from '../images/2.jpg';
import img3 from '../images/3.jpg';
import img4 from '../images/4.jpg';

const products = [
  {
    name: "Neem Oil Bio-Pesticide",
    price: 299,
    link: "https://www.amazon.in/",
    image: img1
  },
  {
    name: "Copper Fungicide Spray",
    price: 349,
    link: "https://www.amazon.in/",
    image: img2
  },
  {
    name: "Organic Plant Protector",
    price: 399,
    link: "https://www.amazon.in/",
    image: img3
  },
  {
    name: "Fungal Disease Control Pack",
    price: 449,
    link: "https://www.amazon.in/",
    image: img4
  }
];

function ProductSuggestions() {
  return (
    <div className="product-suggestions mb-4">
      <h4 className="text-white mb-3">🛒 Recommended Products</h4>
      <div className="product-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            <img src={product.image} alt={product.name} className="product-img" />
            <h5>{product.name}</h5>
            <p>₹{product.price}</p>
            <a href={product.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light">
              Buy Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSuggestions;
