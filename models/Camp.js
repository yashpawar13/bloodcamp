import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Camp = sequelize.define("Camp", {
  camp_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY },
  location: { type: DataTypes.STRING },
  organiser: { type: DataTypes.STRING },
  blood_bank: { type: DataTypes.STRING },
  time_from: { type: DataTypes.STRING },
  time_to: { type: DataTypes.STRING },
  created_on: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  created_by: { type: DataTypes.STRING },
  modified_by: { type: DataTypes.STRING },
  modified_on: { type: DataTypes.DATE },
}, {
  timestamps: false,
});
  Camp.associate = (models) => {
    Camp.hasMany(models.Donor, {
      foreignKey: "camp_id",
      as: "donors",
    });
  };
export default Camp;
