module.exports = (sequelize, DataTypes) => {
  const SettingMeta = sequelize.define("SettingMeta", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    label: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    value: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  SettingMeta.associate = (models) => {
    SettingMeta.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    SettingMeta.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    SettingMeta.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return SettingMeta;
};
