import * as authFunctions from "../functions/auth.functions";
import { getDeviceId } from "../functions/auth.helper.functions";

export const facebook = async (req: any, res: any) => {
  try {
    const { platform } = req.params;
  
    const { accessToken } = req.body;
    const deviceId = await getDeviceId(req);
  
    // Call the function to fetch user data and pages
    const { status, ...resData } = await authFunctions.facebookFunc(platform, accessToken, deviceId);
    res.status(status).json({
      resData,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};