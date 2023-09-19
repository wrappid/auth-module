module.exports = (sequelize, DataTypes) => {
  const personAddresses = sequelize.define("PersonAddresses", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addLine1: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addLine2: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    landmark: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    district: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    pin: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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

  personAddresses.associate = (models) => {
    personAddresses.belongsTo(models.Persons, {
      as: "Person",
      foreignKey: "personId",
      sourceKey: "id",
    });
    personAddresses.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    personAddresses.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    personAddresses.belongsTo(models.AddressTypes, {
      foreignKey: "addressTypeId",
      sourceKey: "id",
    });
    personAddresses.hasOne(models.Clinics, {
      foreignKey: "personAddressId",
      sourceKey: "id",
    });
    personAddresses.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return personAddresses;
};
