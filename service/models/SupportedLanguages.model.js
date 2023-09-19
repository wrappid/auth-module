module.exports = (sequelize, DataTypes) => {
  const supportedLanguages = sequelize.define("SupportedLanguages", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    locale: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "en",
    },
    _status: {
      type: DataTypes.STRING,
      defaultValue: "new",
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  supportedLanguages.associate = (models) => {
    supportedLanguages.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    supportedLanguages.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    supportedLanguages.hasMany(models.StringValues, {
      foreignKey: "locale",
      sourceKey: "locale",
    });
    supportedLanguages.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return supportedLanguages;
};
