
import { Kafka } from "kafkajs";
import LogService from "../../application/services/userLog.services.js";

const broker = process.env.KAFKA_BROKER || "localhost:9092";
const brokers = broker.split(",").map((b) => b.trim());

const kafka = new Kafka({
  clientId: "log-service",
  brokers,
});

const consumer = kafka.consumer({ groupId: "log-service-group" });

export async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-logs", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const value = message.value.toString();
        const logData = JSON.parse(value);

        console.log("Received log from Kafka:", logData);

     
        const { _id, ...cleanData } = logData; 
        const saved = await LogService.saveLog(cleanData);

        console.log("Log saved to Mongo with id:", saved._id.toString());
      } catch (err) {
        console.error("Error while processing log message:", err);
      }
    },
  });
}
