const SessionManagers = require("./models/SessionManagers.model");

const modelsRegistry = {
 
  SessionManagers: {
    database: "application",
    model: SessionManagers,
  },
};

exports.modelsRegistry = modelsRegistry;
