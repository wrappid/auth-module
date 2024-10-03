import { getDeviceId } from "../functions/auth.helper.functions";
import * as socialLoginFunc from "../functions/soicial.login.function";

/**
 *
 * @description Social login controller
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object
*/
export const socialLogin = async (req: any, res: any) => {
  try {
    const { platform } = req.params;
    const { platformToken } = req.body;
    const deviceId = await getDeviceId(req);
    const { status, ...resData } = await socialLoginFunc.socialLoginFunc(platform, platformToken, deviceId);
    res.status(status).json({...resData});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
