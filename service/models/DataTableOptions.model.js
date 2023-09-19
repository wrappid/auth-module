module.exports = (sequelize, DataTypes) => {
  const dataTableOption = sequelize.define("DataTableOptions", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    tableID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    options: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    extraInfo: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    authRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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

  dataTableOption.associate = (models) => {
    dataTableOption.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    dataTableOption.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    dataTableOption.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return dataTableOption;
};
