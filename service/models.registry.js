const FileHandlers = require("./models/FileHandlers.model");
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
const SessionManager = require("./models/SessionManager.model");
const SettingMeta = require("./models/SettingMeta.model");
const UserCoupons = require("./models/UserCoupons.model");
const UserPayments = require("./models/UserPayments.model");
const UserPermissions = require("./models/UserPermissions.model");
const Users = require("./models/Users.model");
const UserSettings = require("./models/UserSettings.model");
const UserTokens = require("./models/UserTokens.model");
const Otps = require("./models/Otp.model");
const CommunicationTemplates = require("./models/communicationTemplates.model");
const WhatsAppComms = require("./models/WhatsAppComms.model");
const SmsComms = require("./models/SmsComms.model");
const MailComms = require("./models/MailComms.model");



const modelsRegistry = {
    "FileHandlers": {
        database: "application",
        model   : FileHandlers
    },
    "Coupons": {
        database: "application",
        model   : Coupons
    },
    "Departments": {
        database: "application",
        model   : Departments
    },
    "LoginLogs": {
        database: "application",
        model   : LoginLogs
    },
    "PaymentGateways": {
        database: "application",
        model   : PaymentGateways
    },
    "Permissions": {
        database: "application",
        model   : Permissions
    },
    "PersonContacts": {
        database: "application",
        model   : PersonContacts
    },
    "PersonRelations": {
        database: "application",
        model   : PersonRelations
    },
    "Persons": {
        database: "application",
        model   : Persons
    },
    "Relations": {
        database: "application",
        model   : Relations
    },
    "RolePermissions": {
        database: "application",
        model   : RolePermissions
    },
    "Roles": {
        database: "application",
        model   : Roles
    },
    "SessionManager": {
        database: "application",
        model   : SessionManager
    },
    "SettingMeta": {
        database: "application",
        model   : SettingMeta
    },
    "UserCoupons": {
        database: "application",
        model   : UserCoupons
    },
    "UserPayments": {
        database: "application",
        model   : UserPayments
    },
    "UserPermissions": {
        database: "application",
        model   : UserPermissions
    },
    "Users": {
        database: "application",
        model   : Users
    },
    "UserSettings": {
        database: "application",
        model   : UserSettings
    },
    "UserTokens": {
        database: "application",
        model   : UserTokens
    },
    "Otps": {
        database: "application",
        model   : Otps
    },
    "CommunicationTemplates": {
        database: "application",
        model   : CommunicationTemplates
    },
    "WhatsAppComms": {
        database: "application",
        model   : WhatsAppComms
    },
    "SmsComms": {
        database: "application",
        model   : SmsComms
    },
    "MailComms": {
        database: "application",
        model   : MailComms
    },
};

exports.modelsRegistry = modelsRegistry;