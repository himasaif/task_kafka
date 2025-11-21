import { Router } from "express";
import userLogController from "../controllers/userLog.controller.js";

const router = Router();

router.post("/create", (req, res, next) =>
  userLogController.createLog(req, res, next)
);

router.get("/", (req, res, next) =>
  userLogController.getLogs(req, res, next)
);

export default router;
