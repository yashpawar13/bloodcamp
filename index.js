import Sequelize from "sequelize";
import DonorModel from "./models/Donor.js";
import CampModel from "./models/Camp.js";

const sequelize = new Sequelize(/* db config */);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Donor = DonorModel(sequelize, Sequelize.DataTypes);
db.Camp = CampModel(sequelize, Sequelize.DataTypes);

// call associate methods
if (db.Donor.associate) db.Donor.associate(db);
if (db.Camp.associate) db.Camp.associate(db);

export default db;
