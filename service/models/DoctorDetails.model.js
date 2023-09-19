module.exports = (sequelize, DataTypes) => {
  const doctorDetails = sequelize.define("DoctorDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    regNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    degrees: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    regYear: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    regDate: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    regLink: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    extraInfo: {
      type: DataTypes.JSONB,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    yearInfo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    salutation: {
      type: DataTypes.STRING,
      defaultValue: "",
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
    phoneNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    emailId: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    bloodGroup: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    parentName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    birthDate: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isNewDoctor: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    checkExistingUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    birthDateStr: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    birthPlace: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    nationality: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    eligbleToVote: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    adharNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    uprnNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    doctorEducationId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    college: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    doctorDegree: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    university: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    otherSubject: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    monthOfPass: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    yearOfPassing: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    smcId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    registrationDate: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    registrationNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    smcName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    homeAddress: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    officeAddress: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    officeaddress: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addressLine1: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addressLine2: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    economicStatus: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    country: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    pincode: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    photos: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    doctRegistrationNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    universityId_view: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    universityId: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    monthandyearOfPass: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    passoutCollege: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    collegeId: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stateId: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    catagory: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    catagory_view: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    registrationDatePrevious: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    registrationNoPrevious: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    smcNamePrevious: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    uprnNoPrevious: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    removedStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    removedOn: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    restoredStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    restoredOn: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    remarks: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    regnNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    smcIds: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    trasanctionStatus: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqual1: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqualyear1: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqualuniv1: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqual2: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqualyear2: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqualuniv2: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqual3: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqualyear3: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    addlqualuniv3: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    patientfirstName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    patientmiddleName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    patientlastName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    patientphoneNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    patientemailId: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    appealBy: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    altphone: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    landLineNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    patientlandLineNo: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    patientaltphone: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    picName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    signatureName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    stateMedicalCouncil: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    countryType: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    universityName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    qualification: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    imrNumber: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    docId: {
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

  doctorDetails.associate = (models) => {
    doctorDetails.belongsTo(models.Persons, {
      foreignKey: "doctorId",
      as: "Persons",
      sourceKey: "id",
    });
    doctorDetails.belongsTo(models.Users, {
      foreignKey: "createdBy",
      as: "Owner",
      sourceKey: "id",
    });
    doctorDetails.belongsTo(models.Users, {
      foreignKey: "updatedBy",
      as: "Updater",
      sourceKey: "id",
    });
    doctorDetails.belongsTo(models.Users, {
      foreignKey: "deletedBy",
      as: "Destroyer",
      sourceKey: "id",
    });
  };

  return doctorDetails;
};
