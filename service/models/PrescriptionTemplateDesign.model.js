module.exports = (sequelize, DataTypes) => {
  const prescriptionTemplateDesign = sequelize.define(
    "PrescriptionTemplateDesigns",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
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
        defaultValue: "unknown",
      },
      deletedAt: {
        type: "TIMESTAMP",
        allowNull: true,
      },
    }
  );

  prescriptionTemplateDesign.associate = (models) => {
    prescriptionTemplateDesign.belongsTo(models.PrescriptionTemplates, {
      foreignKey: "templateId",
      sourceKey: "id",
    });
    prescriptionTemplateDesign.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    prescriptionTemplateDesign.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    prescriptionTemplateDesign.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return prescriptionTemplateDesign;
};
