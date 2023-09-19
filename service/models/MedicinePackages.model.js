module.exports = (sequelize, DataTypes) => {
  const medicinePackages = sequelize.define("MedicinePackages", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    packaging: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    packagingType: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    mrp: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    prescriptionRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    storage: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    extraInfo: {
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

  medicinePackages.associate = (models) => {
    medicinePackages.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    medicinePackages.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    medicinePackages.belongsTo(models.Medicines, {
      foreignKey: "medicineId",
      sourceKey: "id",
    });
    medicinePackages.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return medicinePackages;
};
