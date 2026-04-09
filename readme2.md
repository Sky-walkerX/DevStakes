# 🌾 Farm2City – Direct Farmer Marketplace (AI + ML Powered)

Link -- https://devstakes-1.onrender.com/


A modern, full-stack web application that connects farmers directly with buyers, eliminating middlemen and enabling fair pricing using AI and Machine Learning.

---

## 🚀 Overview

**Farm2City** is a responsive and intelligent marketplace platform where:

* Farmers can list and manage their products
* Buyers can browse, filter, and purchase items
* AI assists with price prediction, recommendations, and chatbot support

Built with:

* **Frontend:** React
* **Backend:** FastAPI
* **Machine Learning:** scikit-learn

---

## ✨ Features

### 🔐 Authentication

* Login / Signup system
* Role-based access:

  * Farmer
  * Buyer

---

### 🌾 Farmer Dashboard

* Add products (name, price, quantity, image, category)
* AI-based **price prediction**
* View, update, delete products
* Crop recommendation system

---

### 🛒 Buyer Marketplace

* Browse products in modern card layout
* Filter by category and price
* View product details
* Add to cart and place orders

---

### 🤖 AI Chatbot

* Floating chatbot UI
* Answers:

  * Crop prices
  * Farming tips
  * Platform help

---

### 🧠 Machine Learning Features

#### 1. Smart Price Prediction

* Predicts product price based on:

  * category
  * month
  * rainfall (dummy/real)
* Built using regression model

#### 2. Crop Recommendation

* Suggests crops based on:

  * soil type
  * season

#### 3. Intelligent Chatbot

* Uses keyword-based NLP logic

---

### 💬 Negotiation Chat

* Simulated chat between buyer and farmer
* No real-time backend required

---

### 📦 Order System

* Add to cart
* Place order
* Order confirmation

---

### 🎨 UI/UX Highlights

* Dark gradient theme (black → purple/blue)
* Glassmorphism cards
* Smooth animations
* Responsive design
* Clean and modern layout

---

## 🧱 Tech Stack

| Layer     | Technology    |
| --------- | ------------- |
| Frontend  | React         |
| Backend   | FastAPI       |
| ML        | scikit-learn  |
| Database  | SQLite / JSON |
| API Calls | Axios         |

---

## 📁 Project Structure

```
farm2city/
│
├── frontend/ (React)
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── backend/ (FastAPI)
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── ml/
│   │   ├── train.py
│   │   ├── model.pkl
│   │   └── utils.py
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 🔹 Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## 🔗 API Endpoints

### Auth

* `POST /signup`
* `POST /login`

### Products

* `GET /products`
* `POST /products`
* `PUT /products/{id}`
* `DELETE /products/{id}`

### ML APIs

* `GET /predict-price`
* `GET /recommend-crop`

### Orders

* `POST /orders`
* `GET /orders`

### Chatbot

* `POST /chat`

---

## 📊 Machine Learning Workflow

1. Train model using CSV dataset
2. Save model using joblib
3. Load model in FastAPI
4. Serve predictions via API
5. Display results in React UI

---

## ⚡ Performance

* Fast API responses (<500ms)
* Optimized React rendering
* Minimal loading states
* Smooth UX across devices

---

## ❌ Constraints

* No heavy deep learning frameworks
* No overcomplicated architecture
* Focus on usability and speed

---

## 🌟 Future Improvements

* Real-time chat (WebSockets)
* Payment gateway integration
* Advanced ML models
* Location-based recommendations

---


## 💡 Inspiration

Bridging the gap between farmers and consumers using technology, AI, and data-driven insights.

---

## ⭐ Final Note

This project demonstrates how a **simple idea + clean execution + AI integration** can create a powerful real-world solution.

---
