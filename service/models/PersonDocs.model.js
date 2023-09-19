module.exports = (sequelize, DataTypes) => {
  const personDocs = sequelize.define("PersonDocs", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    docUrl: {
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

  personDocs.associate = (models) => {
    personDocs.belongsTo(models.Persons, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    personDocs.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    personDocs.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    personDocs.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return personDocs;
};
