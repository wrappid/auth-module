module.exports = (sequelize, DataTypes) => {
  const consultationTimings = sequelize.define("ConsultationTimings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    startTime: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    endTime: {
      type: "TIMESTAMP",
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
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
  consultationTimings.associate = (models) => {
    consultationTimings.belongsTo(models.Clinics, {
      foreignKey: "clinicId",
      sourceKey: "id",
    });
    consultationTimings.belongsTo(models.Persons, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    consultationTimings.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    consultationTimings.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    consultationTimings.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return consultationTimings;
};
