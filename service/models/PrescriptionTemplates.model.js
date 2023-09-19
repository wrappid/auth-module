module.exports = (sequelize, DataTypes) => {
  const prescriptionTemplates = sequelize.define("PrescriptionTemplates", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    label: {
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

  prescriptionTemplates.associate = (models) => {
    prescriptionTemplates.belongsTo(models.Departments, {
      foreignKey: "departmentId",
      sourceKey: "id",
    });
    prescriptionTemplates.belongsTo(models.Persons, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    prescriptionTemplates.hasOne(models.PrescriptionTemplateDesigns, {
      foreignKey: "templateId",
      sourceKey: "id",
    });
    prescriptionTemplates.hasMany(models.PrescriptionTemplatesMasters, {
      foreignKey: "templateId",
      sourceKey: "id",
    });
    prescriptionTemplates.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    prescriptionTemplates.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    prescriptionTemplates.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return prescriptionTemplates;
};
