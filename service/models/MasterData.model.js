module.exports = (sequelize, DataTypes) => {
  const masterData = sequelize.define("MasterData", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    label: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isInput: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    inputType: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    extraInfo: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    stringValue: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    crowdSourcing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    getValue: {
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

  masterData.associate = (models) => {
    masterData.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    masterData.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    masterData.hasMany(models.MasterData, {
      foreignKey: "parentId",
      sourceKey: "id",
      as: "Children",
    });
    masterData.belongsTo(models.MasterData, {
      foreignKey: "parentId",
      sourceKey: "id",
      as: "Parent",
    });
    masterData.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return masterData;
};
