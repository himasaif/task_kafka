# Log Service — Event-Driven Microservice with Kafka & MongoDB

This project is a **scalable event-driven microservice** built with **Node.js, Express, Kafka, and MongoDB**.  
It processes **user activity logs** in real time using Kafka, persists them into MongoDB, and exposes a REST API to query the logs with pagination and filtering.

---

## 🧱 Architecture Overview

The system follows a **clean / layered architecture inspired by DDD**:

- **Presentation Layer (API Layer)**  
  - `Express` routes and controllers  
  - Validates HTTP requests and returns HTTP responses

- **Application Layer (Services)**  
  - Contains the main business use cases  
  - Orchestrates between repositories and Kafka producers/consumers

- **Domain Layer**  
  - `UserLog` Mongoose model and domain rules around logs

- **Infrastructure Layer**  
  - MongoDB connection (`mongoose`)  
  - Kafka producer & consumer (using `kafkajs`)  
  - Repositories that talk to the database

### Data Flow (Happy Path)

1. Client sends `POST /log/create` with log data.
2. API validates the payload and saves the log immediately in MongoDB.
3. The same log is produced to Kafka topic **`user-logs`**.
4. Kafka consumer listens to `user-logs`, processes the message, and (optionally) enriches or re-saves the log.
5. Client can query processed logs using `GET /log` with pagination & filters.

---

## 🛠 Tech Stack

- **Language:** Node.js (ESM)
- **Framework:** Express
- **Messaging:** Apache Kafka (via `kafkajs`)
- **Database:** MongoDB + Mongoose
- **Containerization:** Docker & Docker Compose
- **Orchestration:** Kubernetes (K8s) on Minikube
- **Other:**
  - Logging using `console` (can be extended to `winston`)
  - Environment variables via `.env`

---

## 📂 Project Structure

```bash
.
├── k8s/                      # Kubernetes manifests (Deployments & Services)
├── src/
│   ├── config/
│   │   └── mongo.js          # MongoDB connection
│   ├── domain/
│   │   └── models/
│   │       └── userLog.model.js
│   ├── infrastructure/
│   │   ├── kafka/
│   │   │   ├── producer.kafka.js
│   │   │   └── consumer.kafka.js
│   │   └── repositories/
│   │       └── userLog.repository.js
│   ├── application/
│   │   └── services/
│   │       └── userLog.services.js
│   └── presentation/
│       ├── controllers/
│       │   └── userLog.controller.js
│       └── routes/
│           └── userLog.route.js
├── index.js                  # App entrypoint
├── Dockerfile
├── docker-compose.yml
└── README.md


🔐 Environment Variables
PORT=5000
MONGO_URI=mongodb://mongodb:27017/log-service
KAFKA_BROKER=kafka:9092
When running locally (without Docker)
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/log-service
KAFKA_BROKER=localhost:9092
Create a .env file in the root if you prefer
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/log-service
KAFKA_BROKER=localhost:9092



🚀 Run Locally (without Docker)
npm start

http://localhost:5000
🐳 Run with Docker Compose
docker-compose up --build
☸️ Run on Kubernetes (Minikube)
docker build -t your-docker-username/kafka-api:latest .
docker push your-docker-username/kafka-api:latest
Apply Kubernetes manifests:
kubectl apply -f k8s/zookeeper.yaml
kubectl apply -f k8s/kafka.yaml
kubectl apply -f k8s/mongo.yaml
kubectl apply -f k8s/log-api.yaml




📡 REST API
POST /log/create
Content-Type: application/json

{
  "userId": "user123",
  "action": "login",
  "metadata": {
    "browser": "chrome",
    "time": 17666644441
  }
}

Response (201)
{
  "message": "Log created successfully",
  "data": {
    "_id": "....",
    "userId": "user123",
    "action": "login",
    "metadata": {
      "browser": "chrome",
      "time": 17666644441
    },
    "createdAt": "2025-11-21T12:08:37.026Z",
    "updatedAt": "2025-11-21T12:08:37.026Z"
  }
}
2️⃣ Get Logs (with pagination & filters)
GET /log
//////////////////////////
🧪 How to Test the Flow
Use Postman or curl to send POST /log/create and GET /log requests.

Use MongoDB Compass or mongosh to inspect the log-service.userlogs collection.

Check container logs for messages like:

Message sent to Kafka: ...

Received log from Kafka: ...

Log saved to Mongo with id: ...
🏗 Design & Architecture Notes
Event-driven: Kafka decouples the API from the processing pipeline.

MongoDB: Flexible document-based storage for log data.

Layered architecture: Controllers → Services → Repositories → Infrastructure.

Cloud-ready: Docker + K8s manifests make it easy to deploy on any cloud / free tier.
🎥 Demo
Starting the stack (Docker/K8s).

Sending requests to POST /log/create and GET /log.

Seeing data persisted in MongoDB.

A quick walkthrough of the architecture and main files.
