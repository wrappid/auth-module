module.exports = (sequelize, DataTypes) => {
  const userPermissions = sequelize.define("UserPermissions", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    filter: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  userPermissions.associate = (models) => {
    userPermissions.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    userPermissions.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    userPermissions.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "User",
      sourceKey: "id",
    });
    userPermissions.belongsTo(models.Permissions, {
      foreignKey: "permissionId",
      sourceKey: "id",
    });
    userPermissions.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return userPermissions;
};
