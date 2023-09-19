module.exports = (sequelize, DataTypes) => {
  const stringValues = sequelize.define("StringValues", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    _status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new",
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  stringValues.associate = (models) => {
    stringValues.belongsTo(models.SupportedLanguages, {
      foreignKey: "locale",
      sourceKey: "locale",
    });
    stringValues.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    stringValues.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    stringValues.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return stringValues;
};
