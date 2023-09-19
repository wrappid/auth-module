module.exports = (sequelize, DataTypes) => {
  const advicedMedicines = sequelize.define("AdvicedMedicines", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    formulation: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    frequency: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    meal: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    durationCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    durationType: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    notes: {
      type: DataTypes.TEXT,
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

  advicedMedicines.associate = (models) => {
    advicedMedicines.belongsTo(models.Medicines, {
      foreignKey: "medicineId",
      sourceKey: "id",
    });
    advicedMedicines.belongsTo(models.Prescriptions, {
      foreignKey: "prescriptionId",
      sourceKey: "id",
    });
    advicedMedicines.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    advicedMedicines.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    advicedMedicines.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return advicedMedicines;
};
