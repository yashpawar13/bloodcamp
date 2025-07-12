// server/routes/donorRoutes.js
import express from "express";
import auth from "../middlewares/authMiddleware.js";
import {
  getAllDonors,
  getDonor,
  createDonor,
  updateDonor,
  deleteDonor,
  exportDonors,
  searchDonors,
  getDonorByMobile,
  getAllDonorsSearch,
} from "../controllers/donorController.js";

const router = express.Router();

//router.use(auth); // Protect all donor routes

router.get("/", getAllDonors);
router.get("/:id", getDonor);
router.post("/", createDonor);
router.put("/:id", updateDonor);
router.delete("/:id", deleteDonor);
router.get("/export", exportDonors);
router.get("/search", searchDonors);
router.get("/by-mobile/:mobile", getDonorByMobile);
router.get("/advanceSearch", getAllDonorsSearch);



export default router;
