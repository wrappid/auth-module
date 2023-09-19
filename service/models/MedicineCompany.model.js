module.exports = (sequelize, DataTypes) => {
  const medicineCompany = sequelize.define("MedicineCompanies", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isin: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    address: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    pin: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    countryOfOrigin: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
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

  medicineCompany.associate = (models) => {
    medicineCompany.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    medicineCompany.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    medicineCompany.hasMany(models.Medicines, {
      foreignKey: "medicineCompanyId",
      sourceKey: "id",
    });
    medicineCompany.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return medicineCompany;
};
