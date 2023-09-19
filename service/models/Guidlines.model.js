module.exports = (sequelize, DataTypes) => {
  const guidelines = sequelize.define("Guidelines", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    guideline: {
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

  guidelines.associate = (models) => {
    guidelines.belongsTo(models.Prescriptions, {
      foreignKey: "prescriptionId",
      sourceKey: "id",
    });
    guidelines.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    guidelines.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    guidelines.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return guidelines;
};
