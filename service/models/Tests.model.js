module.exports = (sequelize, DataTypes) => {
  const tests = sequelize.define("Tests", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    subCategory: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    instruction: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    info: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    price: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    extraInfo: {
      type: DataTypes.JSONB,
      defaultValue: null,
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

  tests.associate = (models) => {
    tests.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    tests.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    tests.hasMany(models.AdvisedTests, {
      foreignKey: "testId",
      sourceKey: "id",
    });
    tests.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return tests;
};
