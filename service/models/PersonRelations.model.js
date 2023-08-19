module.exports = (sequelize, DataTypes) => {
  const personRelations = sequelize.define("PersonRelations", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

  personRelations.associate = (models) => {
    personRelations.belongsTo(models.Persons, {
      foreignKey: "personId",
      sourceKey: "id",
      as: "Person",
    });
    personRelations.belongsTo(models.Persons, {
      foreignKey: "relatedPersonId",
      sourceKey: "id",
      as: "RelatedPerson",
    });
    personRelations.belongsTo(models.Relations, {
      foreignKey: "relationId",
      sourceKey: "id",
    });
    personRelations.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    personRelations.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    personRelations.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return personRelations;
};
