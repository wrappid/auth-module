const authController = require("./controllers/auth.controller")

const controllersRegistry = {
    checkLoginOrRegister: authController.checkLoginOrRegister
};

module.exports = controllersRegistry;