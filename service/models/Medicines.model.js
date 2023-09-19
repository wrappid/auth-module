module.exports = (sequelize, DataTypes) => {
  const medicines = sequelize.define("Medicines", {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    manufacturers: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    engagement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prescriptionRequired: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    useOf: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    alcoholInteraction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pregnancyInteraction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    drivingInteraction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    kidneyInteraction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    liverInteraction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    brestfeedingInteraction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    commonSideEffect: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    howToUse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    crowdsource: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  medicines.associate = (models) => {
    medicines.belongsTo(models.Formulations, {
      foreignKey: "formulationId",
      sourceKey: "id",
    });
    medicines.belongsTo(models.ChemicalCompositions, {
      foreignKey: "chemicalCompositionId",
      sourceKey: "id",
    });
    medicines.belongsTo(models.MedicineCompanies, {
      foreignKey: "medicineCompanyId",
      sourceKey: "id",
    });
    medicines.hasOne(models.MedicinePackages, {
      foreignKey: "medicineId",
      sourceKey: "id",
    });
    medicines.hasOne(models.MedicineDetails, {
      foreignKey: "medicineId",
      sourceKey: "id",
    });
    medicines.hasMany(models.AdvicedMedicines, {
      foreignKey: "medicineId",
      sourceKey: "id",
    });
    medicines.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    medicines.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Uodater",
      sourceKey: "id",
    });
    medicines.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return medicines;
};
