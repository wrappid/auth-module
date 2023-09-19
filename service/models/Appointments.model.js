module.exports = (sequelize, DataTypes) => {
  const appointments = sequelize.define("Appointments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    info: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    extraInfo: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    _status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "new",
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  appointments.associate = (models) => {
    appointments.belongsTo(models.Clinics, {
      foreignKey: "clinicId",
      sourceKey: "id",
      as: "Clinic",
    });
    appointments.belongsTo(models.Persons, {
      foreignKey: "doctorId",
      sourceKey: "id",
      as: "Doctor",
    });
    appointments.belongsTo(models.Persons, {
      foreignKey: "patientId",
      sourceKey: "id",
      as: "Patient",
    });
    appointments.hasMany(models.Prescriptions, {
      foreignKey: "appointmentId",
      sourceKey: "id",
      as: "Prescription",
    });
    appointments.belongsTo(models.Users, {
      foreignKey: "createdBy",
      sourceKey: "id",
      as: "Owner",
    });
    appointments.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      sourceKey: "id",
      as: "Updater",
    });
    appointments.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      sourceKey: "id",
      as: "Destroyer",
    });
    appointments.belongsTo(models.Appointments, {
      foreignKey: "rescheduled_appt_id",
      sourceKey: "id",
      as: "RescheduledAppointment",
    });
  };

  return appointments;
};
