module.exports = (sequelize, DataTypes) => {
  const payments = sequelize.define("Payments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    paymentDate: {
      type: "TIMESTAMP",
      defaultValue: new Date(),
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
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

  payments.associate = (models) => {
    payments.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "User",
      sourceKey: "id",
    });
    payments.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    payments.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    payments.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return payments;
};
