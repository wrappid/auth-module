import * as authFunctions from "../functions/auth.functions";
import { getDeviceId } from "../functions/auth.helper.functions";

export const linkedin = async (req: any, res: any) => {
  const { platform } = req.params;
  const deviceId = await getDeviceId(req);
  const code = req.body.authCode;
  // console.log("Authorization code got in controller: ",code);
  try {
    const  { status, ...restData } = await authFunctions.linkedinFunc(code,platform,deviceId);
    res.status(status).json(restData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};