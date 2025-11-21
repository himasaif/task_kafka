
import LogService from "../../application/services/userLog.services.js"; 
import { sendLogMessage } from "../../infrastructure/kafka/producer.kafka.js";

class UserLogController {
  async createLog(req, res, next) {
    try {
      const { userId, action, metadata } = req.body;

      const logPayload = {
        userId,
        action,
        metadata,
        createdAt: new Date(),
      };

      await sendLogMessage(logPayload);

      return res.status(201).json({
        message: "Log queued successfully",
        data: logPayload,
      });
    } catch (error) {
      console.error("Error in createLog:", error);
      if (next) return next(error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getLogs(req, res, next) {
    try {
      const result = await LogService.getLogs(req.query); 
      return res.status(200).json({
        message: "Logs fetched successfully",
        ...result,
      });
    } catch (error) {
      console.error("Error in getLogs:", error);
      if (next) return next(error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
}

export default new UserLogController();
