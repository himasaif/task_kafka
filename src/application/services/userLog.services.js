import LogRepository from "../../infrastructure/repositories/userLog.repository.js";

class LogService {
  async saveLog(data) {
    if (!data.createdAt) {
      data.createdAt = new Date();
    }
    if (!data.metadata) {
      data.metadata = {};
    }

    return LogRepository.createLog(data);
  }

  async getLogs(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.userId) filter.userId = query.userId;
    if (query.action) filter.action = query.action;
    if (query.from || query.to) {
      filter.createdAt = {};
      if (query.from) filter.createdAt.$gte = new Date(query.from);
      if (query.to) filter.createdAt.$lte = new Date(query.to);
    }

    const logs = await LogRepository.getLogs(filter, skip, limit);
    const total = await LogRepository.countLogs(filter);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new LogService();
