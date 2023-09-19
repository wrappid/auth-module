module.exports = (sequelize, DataTypes) => {
  const prescriptionTemplatesMasters = sequelize.define(
    "PrescriptionTemplatesMasters",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        defaultValue: "unknown",
      },
      deletedAt: {
        type: "TIMESTAMP",
        allowNull: true,
      },
    }
  );

  prescriptionTemplatesMasters.associate = (models) => {
    prescriptionTemplatesMasters.belongsTo(models.PrescriptionTemplates, {
      foreignKey: "templateId",
      sourceKey: "id",
    });
    prescriptionTemplatesMasters.belongsTo(models.MasterData, {
      foreignKey: "masterId",
      sourceKey: "id",
    });
    prescriptionTemplatesMasters.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    prescriptionTemplatesMasters.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    prescriptionTemplatesMasters.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return prescriptionTemplatesMasters;
};
