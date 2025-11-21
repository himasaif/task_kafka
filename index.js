import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./src/config/mongo.js";
import routerLog from "./src/presentation/routes/userLog.route.js";
import { startConsumer } from "./src/infrastructure/kafka/consumer.kafka.js";
import { connectProducer } from "./src/infrastructure/kafka/producer.kafka.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

async function startApp() {
  console.log("Starting API...");
  console.log("MONGO_URI from env (in index):", process.env.MONGO_URI);

  const mongoUri = process.env.MONGO_URI;
  await connectDB(mongoUri);
  console.log("MongoDB Connected (from index)");

  await connectProducer();
  console.log("Kafka Producer Connected");

  startConsumer();
  console.log("Kafka Consumer Started");

  app.use("/log", routerLog);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startApp();
