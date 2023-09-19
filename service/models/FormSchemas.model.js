module.exports = (sequelize, DataTypes) => {
  const formSchema = sequelize.define("FormSchemas", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    /**
     * @todo have to change column name ref is a keyword in
     * react which causes problem
     */
    // ref: {
    //   type: DataTypes.STRING,
    //   defaultValue: null,
    // },
    entityRef: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    formID: {
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
    authRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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

  formSchema.associate = (models) => {
    formSchema.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    formSchema.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    formSchema.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return formSchema;
};
