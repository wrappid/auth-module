module.exports = (sequelize, DataTypes) => {
  const clinics = sequelize.define("Clinics", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    licenseId: {
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
    photoUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  clinics.associate = (models) => {
    clinics.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    clinics.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    clinics.belongsTo(models.PersonAddresses, {
      as: "Address",
      foreignKey: "personAddressId",
      sourceKey: "id",
    });
    clinics.hasMany(models.Appointments, {
      foreignKey: "clinicId",
      sourceKey: "id",
    });
    clinics.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return clinics;
};
