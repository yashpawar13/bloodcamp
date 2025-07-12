// server/routes/campRoutes.js
import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  getAllCamps,
  getCamp,
  createCamp,
  updateCamp,
  deleteCamp,
  exportCamps,
  searchCamps,
} from "../controllers/campController.js";

const router = express.Router();

router.use(auth); // Protect all camp routes

router.get("/", getAllCamps);
router.get("/:id", getCamp);
router.post("/", createCamp);
router.put("/:id", updateCamp);
router.delete("/:id", deleteCamp);
router.get("/export", exportCamps);
router.get("/search", searchCamps);

export default router;
