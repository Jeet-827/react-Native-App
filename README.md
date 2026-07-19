# Native API Testing Architecture

This repository contains a full-stack microservices architecture built with React Native (Expo) on the frontend and Express.js on the backend. The backend is orchestrated using an Nginx load balancer, an API Gateway, and multiple independent microservices.

## 🏗️ Architecture Diagram

Here is a visual representation of how traffic flows through the system:

```mermaid
graph TD
    %% Define styles
    classDef client fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff,rx:5px,ry:5px
    classDef lb fill:#e67e22,stroke:#d35400,stroke-width:2px,color:#fff,rx:5px,ry:5px
    classDef gateway fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff,rx:5px,ry:5px
    classDef service fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff,rx:5px,ry:5px
    classDef db fill:#34495e,stroke:#2c3e50,stroke-width:2px,color:#fff,rx:5px,ry:5px

    %% Nodes
    Client["📱 React Native Frontend<br/>(Expo App)"]:::client
    
    Nginx["⚖️ Nginx Load Balancer<br/>(Port 8000)"]:::lb
    
    subgraph "API Gateways (Express-LB)"
        Gateway1["🚀 Gateway Instance 1<br/>(Port 4500)"]:::gateway
        Gateway2["🚀 Gateway Instance 2<br/>(Port 4501)"]:::gateway
        Gateway3["🚀 Gateway Instance 3<br/>(Port 4503)"]:::gateway
    end
    
    subgraph "Microservices"
        AuthService["🔒 Auth Service<br/>(Port 5000)"]:::service
        ProductService["📦 Product Service<br/>(Port 5001)"]:::service
    end
    
    MongoDB[("🍃 MongoDB<br/>(Users/Auth)")]:::db
    PostgreSQL[("🐘 PostgreSQL<br/>(Products)")]:::db

    %% Connections
    Client -->|HTTP GET/POST| Nginx
    Nginx -->|Round Robin| Gateway1
    Nginx -->|Round Robin| Gateway2
    Nginx -->|Round Robin| Gateway3
    
    Gateway1 -->|/api/authservice/*| AuthService
    Gateway1 -->|/api/productservice/*| ProductService
    
    Gateway2 -->|/api/authservice/*| AuthService
    Gateway2 -->|/api/productservice/*| ProductService
    
    Gateway3 -->|/api/authservice/*| AuthService
    Gateway3 -->|/api/productservice/*| ProductService
    
    AuthService --> MongoDB
    ProductService --> PostgreSQL
```

## 📂 Project Structure

- **`frontend/`**: The React Native application (Expo). Configured to send all API requests to the Nginx Load Balancer.
- **`apigetway/`**: The core routing layer. Contains:
  - **`server.js`**: The Express application acting as the API Gateway. It uses `http-proxy-middleware` to forward requests to the specific microservices.
  - **`compose.yml`**: Docker Compose configuration that orchestrates multiple instances of the gateway and Nginx.
  - **`backend/`**: The Authentication Service (handles users, login, tokens).
  - **`product/`**: The Product Service (handles product data).
- **`nginx.conf`**: The configuration file for the Nginx Load Balancer, which distributes incoming traffic among the gateway instances.

## 🚀 Setup & Installation

### 1. Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/)
- [Expo CLI](https://docs.expo.dev/)

### 2. Local Environment Setup

Each service requires environment variables. Make sure you have `.env` files created where necessary (e.g., in `frontend/`, `apigetway/backend/`, and `apigetway/product/`).

Install dependencies for all services:
```bash
# Frontend
cd frontend
npm install

# API Gateway
cd ../apigetway
npm install

# Auth Service
cd backend
npm install

# Product Service
cd ../product
npm install
```

### 3. Running with Docker Compose (Recommended)

To spin up the Nginx Load Balancer and multiple Gateway instances, run the following from the `apigetway` directory:

```bash
cd apigetway
docker compose up -d --build
```
This will:
- Build the `express-lb` Docker image.
- Start 3 Gateway containers (`app1`, `app2`, `app3`).
- Start the Nginx container, listening on port `8000`.

### 4. Running the Microservices Locally

Currently, the Auth and Product microservices are designed to be run via Node locally (while the Gateway/Nginx run in Docker).

```bash
cd apigetway
npm run dev
```
*(This uses `concurrently` to start the backend on port 5000 and the product service on port 5001).*

### 5. Starting the Frontend

```bash
cd frontend
npm run web
```
The frontend will start on port `8081` and automatically route API requests to `http://localhost:8000`, hitting your Nginx load balancer!

## 🛠️ Testing the Load Balancer

You can use `autocannon` to verify that Nginx is successfully load balancing across your gateway instances:

```bash
npx autocannon -c 100 -d 10 http://localhost:8000/api/productservice/getproduct
```
This will send 100 concurrent requests for 10 seconds and output a performance benchmark.
