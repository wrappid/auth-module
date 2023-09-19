module.exports = (sequelize, DataTypes) => {
  const medicineDetails = sequelize.define("MedicineDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    introduction: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    howToUse: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    safetyAdvise: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    ifMiss: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    label: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    factBox: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    qa: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  medicineDetails.associate = (models) => {
    medicineDetails.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    medicineDetails.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    medicineDetails.belongsTo(models.Medicines, {
      foreignKey: "medicineId",
      sourceKey: "id",
    });
    medicineDetails.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return medicineDetails;
};
