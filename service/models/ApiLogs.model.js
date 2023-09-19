module.exports = (sequelize, DataTypes) => {
  const apiLogs = sequelize.define("ApiLogs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    apiId: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    route: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    extraInfo: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    source: {
      type: DataTypes.STRING,
      defaultValue: "server-side",
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  apiLogs.associate = (models) => {
    apiLogs.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    apiLogs.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    apiLogs.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "User",
      sourceKey: "id",
    });
    apiLogs.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return apiLogs;
};
