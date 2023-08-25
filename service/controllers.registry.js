const authController = require("./controllers/auth.controller")

const ControllerssRegistry = {
    checkLoginOrRegister: authController.checkLoginOrRegister
};

module.exports = ControllerssRegistry;