import Camp from "../models/Camp.js";
import { Op } from "sequelize";
import { exportToCSV } from "../utils/csvExporter.js";

export const getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.findAll();
    res.json(camps);
  } catch {
    res.status(500).json({ msg: "Error fetching camps" });
  }
};

export const getCamp = async (req, res) => {
  try {
    const camp = await Camp.findByPk(req.params.id);
    camp ? res.json(camp) : res.status(404).json({ msg: "Not found" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

export const createCamp = async (req, res) => {
  try {
    const camp = await Camp.create({
      ...req.body,
      created_by: req.user.id,
      created_on: new Date(),
    });
    res.status(201).json(camp);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ msg: "Creation error" });
  }
};

export const updateCamp = async (req, res) => {
  try {
    const camp = await Camp.findByPk(req.params.id);
    if (!camp) return res.status(404).json({ msg: "Not found" });

    await camp.update({
      ...req.body,
      modified_by: req.user.id,
      modified_on: new Date(),
    });

    res.json(camp);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ msg: "Update error" });
  }
};


export const deleteCamp = async (req, res) => {
  try {
    const camp = await Camp.findByPk(req.params.id);
    if (!camp) return res.status(404).json({ msg: "Not found" });

    await camp.destroy();
    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Delete error" });
  }
};

export const searchCamps = async (req, res) => {
  const { name, location, date } = req.query;

  const whereClause = {};
  if (name) whereClause.name = { [Op.like]: `%${name}%` };
  if (location) whereClause.location = { [Op.like]: `%${location}%` };
  if (date) whereClause.date = date;

  try {
    const camps = await Camp.findAll({ where: whereClause });
    res.json(camps);
  } catch {
    res.status(500).json({ msg: "Search failed" });
  }
};

export const exportCamps = async (req, res) => {
  try {
    const camps = await Camp.findAll({
      attributes: [
        "name", "date", "location", "organiser",
        "blood_bank", "time_from", "time_to"
      ],
    });

    exportToCSV(res, camps, "camps.csv");
  } catch (err) {
    console.error("Export failed:", err);
    res.status(500).json({ msg: "Export failed" });
  }
};

