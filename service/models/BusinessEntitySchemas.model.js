module.exports = (sequelize, DataTypes) => {
  const businessEntitySchemas = sequelize.define("BusinessEntitySchemas", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ref: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    entityRef: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    name: {
      // This field has to be deleted ASAP
      type: DataTypes.STRING,
      defaultValue: null,
    },
    schema: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    extraInfo: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    commitId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false,
    },
    _status: {
      type: DataTypes.STRING,
      defaultValue: "new",
    },
    comments: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  businessEntitySchemas.associate = (models) => {
    businessEntitySchemas.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    businessEntitySchemas.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    businessEntitySchemas.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return businessEntitySchemas;
};
