module.exports = (sequelize, DataTypes) => {
  const personEducations = sequelize.define("PersonEducations", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    degree: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    school: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    board: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    field: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    startMonth: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    startYear: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    endMonth: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    endYear: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    startDate: {
      type: "TIMESTAMP",
      defaultValue: new Date(),
    },
    endDate: {
      type: "TIMESTAMP",
      defaultValue: new Date(),
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

  personEducations.associate = (models) => {
    personEducations.belongsTo(models.Persons, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    personEducations.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    personEducations.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    personEducations.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return personEducations;
};
