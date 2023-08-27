module.exports = (sequelize, DataTypes) => {
  const person = sequelize.define("Persons", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    middleName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    lastName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    photoUrl: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    extraInfo: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    height: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    weight: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: null,
    },
    medicalId: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dob: {
      type: "TIMESTAMP",
      defaultValue: new Date(),
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    profileId: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    userInvitationToken: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    website: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    _status: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: "TIMESTAMP",
      allowNull: true,
    },
  });

  person.associate = (models) => {
    person.belongsTo(models.Users, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "User",
    });
    person.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    person.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    person.belongsTo(models.Departments, {
      foreignKey: "departmentId",
      sourceKey: "id",
    });
    person.hasMany(models.PersonRelations, {
      foreignKey: "personId",
      sourceKey: "id",
      as: "Person",
    });
    person.hasMany(models.PersonContacts, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    person.hasMany(models.PersonRelations, {
      foreignKey: "relatedPersonId",
      sourceKey: "id",
      as: "RelatedPersons",
    });
    /* person.hasOne(models.DoctorDetails, {
      foreignKey: "doctorId",
      sourceKey: "id",
    });
    person.hasMany(models.PersonAddresses, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    person.hasMany(models.PersonEducations, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    person.hasMany(models.PersonExperiences, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    person.hasMany(models.PersonDocs, {
      foreignKey: "personId",
      sourceKey: "id",
    });
    person.hasMany(models.Appointments, {
      foreignKey: "doctorId",
      sourceKey: "id",
      as: "DoctorAppointments",
    });
    person.hasMany(models.Appointments, {
      foreignKey: "patientId",
      sourceKey: "id",
      as: "PatientAppointments",
    }); */
    person.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return person;
};
