module.exports = (sequelize, DataTypes) => {
  const prescriptionVitals = sequelize.define("PrescriptionVitals", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    value: {
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

  prescriptionVitals.associate = (models) => {
    prescriptionVitals.belongsTo(models.Prescriptions, {
      foreignKey: "prescriptionId",
      sourceKey: "id",
    });
    prescriptionVitals.belongsTo(models.MasterData, {
      foreignKey: "masterDataId",
      sourceKey: "id",
      as: "Vital",
    });
    prescriptionVitals.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    prescriptionVitals.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    prescriptionVitals.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return prescriptionVitals;
};
