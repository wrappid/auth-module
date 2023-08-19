module.exports = (sequelize, DataTypes) => {
  const rolePermissions = sequelize.define("RolePermissions", {
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
    isVisible: {
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

  rolePermissions.associate = (models) => {
    rolePermissions.belongsTo(models.Roles, {
      foreignKey: "roleId",
      sourceKey: "id",
    });
    rolePermissions.belongsTo(models.Permissions, {
      foreignKey: "permissionId",
      sourceKey: "id",
    });
    rolePermissions.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    rolePermissions.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    rolePermissions.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return rolePermissions;
};
