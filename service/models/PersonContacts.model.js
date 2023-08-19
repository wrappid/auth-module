module.exports = (sequelize, DataTypes) => {
  const personContacts = sequelize.define("PersonContacts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    data: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    primaryFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notificationFlag: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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

  personContacts.associate = (models) => {
    personContacts.belongsTo(models.Persons, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    personContacts.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    personContacts.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    personContacts.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return personContacts;
};
