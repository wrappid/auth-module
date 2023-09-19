module.exports = (sequelize, DataTypes) => {
  const AssistantRequests = sequelize.define("AssistantRequests", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    query: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "",
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

  AssistantRequests.associate = (models) => {
    AssistantRequests.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    }),
      AssistantRequests.belongsTo(models.Users, {
        foreignKey: "assistantId",
        as: "Assistant",
        sourceKey: "id",
      });
    AssistantRequests.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return AssistantRequests;
};
