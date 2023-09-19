module.exports = (sequelize, DataTypes) => {
  const history = sequelize.define("Histories", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    history: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    info: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    reportLink: {
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

  history.associate = (models) => {
    history.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    history.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    history.belongsTo(models.Prescriptions, {
      foreignKey: "prescriptionId",
      sourceKey: "id",
    });
    history.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return history;
};
