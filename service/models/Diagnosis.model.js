module.exports = (sequelize, DataTypes) => {
  const diagnosis = sequelize.define("Diagnoses", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    diagnosis: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    info: {
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

  diagnosis.associate = (models) => {
    diagnosis.belongsTo(models.Prescriptions, {
      foreignKey: "prescriptionId",
      sourceKey: "id",
    });
    diagnosis.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    diagnosis.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    diagnosis.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return diagnosis;
};
