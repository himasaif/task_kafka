import { Kafka } from "kafkajs";

const broker = process.env.KAFKA_BROKER || "localhost:9092";
const brokers = broker.split(",").map((b) => b.trim());

console.log("Kafka Producer brokers:", brokers);

const kafka = new Kafka({
  clientId: "log-service",
  brokers,
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer Connected...");
};

export const sendLogMessage = async (logData) => {
  try {
    await producer.send({
      topic: "user-logs",
      messages: [{ value: JSON.stringify(logData) }],
    });

    console.log("Message sent to Kafka:", logData);
  } catch (err) {
    console.error("Error sending Kafka message:", err.message);
  }
};
