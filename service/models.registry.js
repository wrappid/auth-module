const Coupons = require("./models/Coupons.model");
const Departments = require("./models/Departments.model");
const LoginLogs = require("./models/LoginLogs.model");
const PaymentGateways = require("./models/PaymentGateways.model");
const Permissions = require("./models/Permissions.model");
const PersonContacts = require("./models/PersonContacts.model");
const PersonRelations = require("./models/PersonRelations.model");
const Persons = require("./models/Persons.model");
const Relations = require("./models/Relations.model");
const RolePermissions = require("./models/RolePermissions.model");
const Roles = require("./models/Roles.model");
const SessionManagers = require("./models/SessionManagers.model");
const SettingMeta = require("./models/SettingMeta.model");
const UserCoupons = require("./models/UserCoupons.model");
const UserPayments = require("./models/UserPayments.model");
const UserPermissions = require("./models/UserPermissions.model");
const Users = require("./models/Users.model");
const UserSettings = require("./models/UserSettings.model");
const UserTokens = require("./models/UserTokens.model");
const Otps = require("./models/Otp.model");
const CommunicationTemplates = require("./models/CommunicationTemplates.model");
const WhatsAppComms = require("./models/WhatsAppComms.model");
const SmsComms = require("./models/SmsComms.model");
const MailComms = require("./models/MailComms.model");
const AddressTypes = require("./models/AddressTypes.model");
const PersonAddresses = require("./models/PersonAddresses.model");
const Clinics = require("./models/Clinics.model");
const Appointments = require("./models/Appointments.model");
const AdvicedMedicines = require("./models/AdvicedMedicines.model");
const AdvisedTests = require("./models/AdvisedTests.model");
const ApiLogs = require("./models/ApiLogs.model");
const Applications = require("./models/Applications.model");
const AssistantRequests = require("./models/AssistantRequests.model");
const BusinessEntitySchemas = require("./models/BusinessEntitySchemas.model");
const ChemicalCompositions = require("./models/ChemicalCompositions.model");
const Complaints = require("./models/Complaints.model");
const CompositionDepartments = require("./models/CompositionDepartments.model");
const ConsultationTimings = require("./models/ConsultationTimings.model");
const DataTableOption = require("./models/DataTableOptions.model");
const Diagnoses = require("./models/Diagnosis.model");
const DoctorDetails = require("./models/DoctorDetails.model");
const Followups = require("./models/Followups.model");
const FormSchemas = require("./models/FormSchemas.model");
const Formulations = require("./models/Formulations.model");
const Guidelines = require("./models/Guidlines.model");
const Histories = require("./models/History.model");
const MasterData = require("./models/MasterData.model");
const MedicineCompanies = require("./models/MedicineCompany.model");
const MedicineDetails = require("./models/MedicineDetails.model");
const MedicinePackages = require("./models/MedicinePackages.model");
const Medicines = require("./models/Medicines.model");
const Pages = require("./models/Pages.model");
const Payments = require("./models/Payments.model");
const PersonDocs = require("./models/PersonDocs.model");
const PersonEducations = require("./models/PersonEducations.model");
const PersonExperiences = require("./models/PersonExperiences.model");
// const Prescriptions = require("./models/Prescriptions.model");
const PrescriptionTemplateDesigns = require("./models/PrescriptionTemplateDesign.model");
const PrescriptionTemplates = require("./models/PrescriptionTemplates.model");
const PrescriptionTemplatesMasters = require("./models/PrescriptionTemplatesMasters.model");
const PrescriptionVitals = require("./models/PrescriptionVitals.model");
const Procedures = require("./models/Procedures.model");
const Reffers = require("./models/Reffers.model");
const StringValues = require("./models/StringValues.model");
const SupportedLanguages = require("./models/SupportedLanguages.model");
const Tests = require("./models/Tests.model");

const modelsRegistry = {
  Coupons: {
    database: "application",
    model: Coupons,
  },
  Departments: {
    database: "application",
    model: Departments,
  },
  LoginLogs: {
    database: "application",
    model: LoginLogs,
  },
  PaymentGateways: {
    database: "application",
    model: PaymentGateways,
  },
  Permissions: {
    database: "application",
    model: Permissions,
  },
  PersonContacts: {
    database: "application",
    model: PersonContacts,
  },
  PersonRelations: {
    database: "application",
    model: PersonRelations,
  },
  Persons: {
    database: "application",
    model: Persons,
  },
  Relations: {
    database: "application",
    model: Relations,
  },
  RolePermissions: {
    database: "application",
    model: RolePermissions,
  },
  Roles: {
    database: "application",
    model: Roles,
  },
  SessionManagers: {
    database: "application",
    model: SessionManagers,
  },
  SettingMeta: {
    database: "application",
    model: SettingMeta,
  },
  UserCoupons: {
    database: "application",
    model: UserCoupons,
  },
  UserPayments: {
    database: "application",
    model: UserPayments,
  },
  UserPermissions: {
    database: "application",
    model: UserPermissions,
  },
  Users: {
    database: "application",
    model: Users,
  },
  UserSettings: {
    database: "application",
    model: UserSettings,
  },
  UserTokens: {
    database: "application",
    model: UserTokens,
  },
  Otps: {
    database: "application",
    model: Otps,
  },
  CommunicationTemplates: {
    database: "application",
    model: CommunicationTemplates,
  },
  WhatsAppComms: {
    database: "application",
    model: WhatsAppComms,
  },
  SmsComms: {
    database: "application",
    model: SmsComms,
  },
  MailComms: {
    database: "application",
    model: MailComms,
  },
  AddressTypes: {
    database: "application",
    model: AddressTypes,
  },
  PersonAddresses: {
    database: "application",
    model: PersonAddresses,
  },
  Clinics: {
    database: "application",
    model: Clinics,
  },
  Appointments: {
    database: "application",
    model: Appointments,
  },
  AdvicedMedicines: {
    database: "application",
    model: AdvicedMedicines,
  },
  AdvisedTests: {
    database: "application",
    model: AdvisedTests,
  },
  ApiLogs: {
    database: "application",
    model: ApiLogs,
  },
  Applications: {
    database: "application",
    model: Applications,
  },
  AssistantRequests: {
    database: "application",
    model: AssistantRequests,
  },
  BusinessEntitySchemas: {
    database: "application",
    model: BusinessEntitySchemas,
  },
  ChemicalCompositions: {
    database: "application",
    model: ChemicalCompositions,
  },
  Complaints: {
    database: "application",
    model: Complaints,
  },
  CompositionDepartments: {
    database: "application",
    model: CompositionDepartments,
  },
  ConsultationTimings: {
    database: "application",
    model: ConsultationTimings,
  },
  DataTableOption: {
    database: "application",
    model: DataTableOption,
  },
  Diagnoses: {
    database: "application",
    model: Diagnoses,
  },
  DoctorDetails: {
    database: "application",
    model: DoctorDetails,
  },
  Followups: {
    database: "application",
    model: Followups,
  },
  FormSchemas: {
    database: "application",
    model: FormSchemas,
  },
  Formulations: {
    database: "application",
    model: Formulations,
  },
  Guidelines: {
    database: "application",
    model: Guidelines,
  },
  Histories: {
    database: "application",
    model: Histories,
  },
  MasterData: {
    database: "application",
    model: MasterData,
  },
  MedicineCompanies: {
    database: "application",
    model: MedicineCompanies,
  },
  MedicineDetails: {
    database: "application",
    model: MedicineDetails,
  },
  MedicinePackages: {
    database: "application",
    model: MedicinePackages,
  },
  Medicines: {
    database: "application",
    model: Medicines,
  },
  Pages: {
    database: "application",
    model: Pages,
  },
  Payments: {
    database: "application",
    model: Payments,
  },
  PersonDocs: {
    database: "application",
    model: PersonDocs,
  },
  PersonEducations: {
    database: "application",
    model: PersonEducations,
  },
  PersonExperiences: {
    database: "application",
    model: PersonExperiences,
  },
  // Prescriptions: {
  //   database: "application",
  //   model: Prescriptions,
  // },
  PrescriptionTemplateDesigns: {
    database: "application",
    model: PrescriptionTemplateDesigns,
  },
  PrescriptionTemplates: {
    database: "application",
    model: PrescriptionTemplates,
  },
  PrescriptionTemplatesMasters: {
    database: "application",
    model: PrescriptionTemplatesMasters,
  },
  PrescriptionVitals: {
    database: "application",
    model: PrescriptionVitals,
  },
  Procedures: {
    database: "application",
    model: Procedures,
  },
  Reffers: {
    database: "application",
    model: Reffers,
  },
  StringValues: {
    database: "application",
    model: StringValues,
  },
  SupportedLanguages: {
    database: "application",
    model: SupportedLanguages,
  },
  Tests: {
    database: "application",
    model: Tests,
  },
};

exports.modelsRegistry = modelsRegistry;
