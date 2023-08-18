const authFunctions = require("../functions/auth.functions");
const { databaseActions } = require("@wrappid/service-core");



/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports.checkLoginOrRegister = async (req, res) => {
  try {
    let data = await authFunctions.checkLoginOrRegisterUtil(req, db)
    res.status(data?.status).json(data)
  } catch (error) {
    console.error("checkLoginOrRegister Error:: ", error);
    res.status(500).json({ message: error.message });
  }
};
