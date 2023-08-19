module.exports = (sequelize, DataTypes) => {
  const userPayments = sequelize.define("UserPayments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "debit",
    },
    paymentDate: {
      type: "TIMESTAMP",
      defaultValue: new Date(),
    },
    token: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    getwayData: {
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

  userPayments.associate = (models) => {
    userPayments.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "User",
      sourceKey: "id",
    });
    userPayments.belongsTo(models.PaymentGateways, {
      foreignKey: "paymentGetwayId",
      sourceKey: "id",
    });
    userPayments.belongsTo(models.Coupons, {
      foreignKey: "couponId",
      sourceKey: "id",
    });
    userPayments.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    userPayments.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    userPayments.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return userPayments;
};
