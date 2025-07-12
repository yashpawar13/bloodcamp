import Donor from "../models/Donor.js";
import Camp from "../models/Camp.js";
import { Op } from "sequelize";
import { exportToCSV } from "../utils/csvExporter.js";

export const getAllDonors = async (req, res) => {
  try {
    var test = req.query.camp_id;
    const whereClause = {};
    if (test) {
      whereClause.camp_id = test;
    }

    const donors = await Donor.findAll({ where: whereClause });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching donors" });
  }
};

export const getAllDonorsSearch = async (req, res) => {
  try {
    const {
      name,
      loc,
      gender,
      blood_group,
      donor_type,
      camp_name,
      camp_location,
      organiser,
      blood_bank
    } = req.query;

    const whereClauseDonor = {};
    const whereClauseCamp = {};

    // Donor filters
    if (name) {
      whereClauseDonor.name = { [Op.like]: `%${name}%` };
    }

    if (loc) {
      whereClauseDonor.address = { [Op.like]: `%${loc}%` };
    }

    if (gender) {
      whereClauseDonor.gender = gender;
    }

    if (blood_group) {
      whereClauseDonor.blood_group = blood_group;
    }

    if (donor_type) {
      whereClauseDonor.donor_type = donor_type;
    }

    // Camp filters
    if (camp_name) {
      whereClauseCamp.name = { [Op.like]: `%${camp_name}%` };
    }

    if (camp_location) {
      whereClauseCamp.location = { [Op.like]: `%${camp_location}%` };
    }

    if (organiser) {
      whereClauseCamp.organiser = { [Op.like]: `%${organiser}%` };
    }

    if (blood_bank) {
      whereClauseCamp.blood_bank = { [Op.like]: `%${blood_bank}%` };
    }

    const donors = await Donor.findAll({
      where: whereClauseDonor,
      include: [
        {
          model: Camp,
          as: "camp",
          where: whereClauseCamp,
          required: true // Only return donors with matching camps
        }
      ]
    });

    res.json(donors);
  } catch (err) {
    console.error("Error searching donors:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDonor = async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    donor ? res.json(donor) : res.status(404).json({ msg: "Not found" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

export const createDonor = async (req, res) => {
  try {
    var test = req.params.id
    const donor = await Donor.create({
      ...req.body,
      created_by: req.user?.test || null,
      created_on: new Date(),
    });
    res.status(201).json(donor);
  } catch (err) {
    res.status(500).json({ msg: "Error creating donor" ,error: err.message});
  }
};

export const updateDonor = async (req, res) => {
  try {
    //const donor = await Donor.findByPk(req.params.donor_id);
    const donor = await Donor.findOne({
      where: { donor_id: req.params.id }, // ✅ Explicitly look for donor_id
    });
    var test = req.params.id
    if (!donor) return res.status(404).json({ msg: "Not found" });

    await donor.update({
      ...req.body,
      modified_by: req.user?.id || null,
      modified_on: new Date(),
    });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message,test:test });
  }
};

export const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) return res.status(404).json({ msg: "Not found" });

    await donor.destroy();
    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
};

export const searchDonors = async (req, res) => {
  try {
    const { name, blood_group, donor_type, camp_id } = req.query;

    const whereClause = {};
    if (name) whereClause.name = { [Op.like]: `%${name}%` };
    if (blood_group) whereClause.blood_group = blood_group;
    if (donor_type) whereClause.donor_type = donor_type;
    if (camp_id) whereClause.camp_id = camp_id;

    const donors = await Donor.findAll({ where: whereClause });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
};

export const getDonorByMobile = async (req, res) => {
  try {
    const donor = await Donor.findOne({
      where: { mobile_no: req.params.mobile },
    });
    if (!donor) return res.status(404).json({ msg: "No donor found" });

    res.set("Cache-Control", "no-store"); // ✅ add this
    res.json(donor);
  } catch {
    res.status(500).json({ msg: "Error fetching donor by mobile" });
  }
};

export const exportDonors = async (req, res) => {
  try {
    const donors = await Donor.findAll({
      attributes: [
        "donor_id",
        "name",
        "gender",
        "dob",
        "blood_group",
        "donor_type",
        "mobile_no",
        "alternate_no",
        "address",
        "camp_id",
        "created_on",
        "created_by",
        "modified_on",
        "modified_by",
      ],
    });
    exportToCSV(res, donors, "donors.csv");
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Export failed" });
  }
};
