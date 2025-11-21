import UserLog from "../../domain/models/userLogs.models.js";

class LogRepository {
  createLog(data) {
    return UserLog.create(data);
  }

  getLogs(filter, skip, limit) {
    return UserLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  countLogs(filter) {
    return UserLog.countDocuments(filter);
  }
}

export default new LogRepository();
