module.exports = (sequelize, DataTypes) => {
  const personExperiences = sequelize.define("PersonExperiences", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    designation: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    organization: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    field: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    location: {
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

  personExperiences.associate = (models) => {
    personExperiences.belongsTo(models.Persons, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    personExperiences.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    personExperiences.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    personExperiences.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return personExperiences;
};
