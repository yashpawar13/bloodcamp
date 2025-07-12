import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Donor = sequelize.define("Donor", {
  donor_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  camp_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.STRING },
  dob: { type: DataTypes.DATEONLY },
  blood_group: { type: DataTypes.STRING },
  mobile_no: { type: DataTypes.STRING },
  alternate_no: { type: DataTypes.STRING },
  donor_type: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  created_on: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  created_by: { type: DataTypes.STRING },
  modified_by: { type: DataTypes.STRING },
  modified_on: { type: DataTypes.DATE },
}, {
  timestamps: false,
});
  Donor.associate = (models) => {
    Donor.belongsTo(models.Camp, {
      foreignKey: "camp_id",
      as: "camp",
    });
  };
export default Donor;
