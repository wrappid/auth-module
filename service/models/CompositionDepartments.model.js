module.exports = function (sequelize, DataTypes) {
  const compositionDepartments = sequelize.define("CompositionDepartments", {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  compositionDepartments.associate = (models) => {
    compositionDepartments.belongsTo(models.ChemicalCompositions, {
      foreignKey: "compositionId",
      sourceKey: "id",
    });
    compositionDepartments.belongsTo(models.Departments, {
      foreignKey: "departmentId",
      sourceKey: "id",
    });
    compositionDepartments.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return compositionDepartments;
};
