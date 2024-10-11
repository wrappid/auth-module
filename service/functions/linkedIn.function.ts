import {
  WrappidLogger,
} from "@wrappid/service-core";
import fetch from "node-fetch-commonjs";
import constant from "../constants/constants";
import { CheckUser } from "./soicial.login.function";

/**
 * Get Access Token
 * @param platformToken
 * @param clientId
 * @param clientSecret
 * @param redirectUri
 * @returns
 */
async function getAccessToken(platformToken:string,clientId:string,clientSecret:string,redirectUri:string):Promise<string>{
  try{
    const tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
    const response = await fetch(tokenUrl, {
      method: constant.httpMethod.HTTP_POST,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: platformToken,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });
    const data: any = await response.json();
    if (!data.access_token) {
      WrappidLogger.error("Unable to generate Access Token");
      throw new Error("Unable to generate Access Token");    
    }
    const token = data.access_token;
    return token;
  }catch(error){
    WrappidLogger.error("Error in generating Access Token " + error);
    throw error;
  }
}

/**
 * Get User Details from LinkedIn
 * @param token 
 * @returns 
 */
async function getUserDetails(token:string):Promise<CheckUser>{
  try{
    const userResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (userResponse.status != 200) {
      WrappidLogger.error(`Failed to fetch user data: ${userResponse.statusText}`);
      throw new Error(`Failed to fetch user data: ${userResponse.statusText}`);
    }
    const rawData: any = await userResponse.json();
    const nameParts = rawData.name.trim().split(" ");
    let firstName = "", middleName = "", lastName = "";
          
    // Assign the parts of the name accordingly
    if (nameParts.length === 1) {
      firstName = nameParts[0];
    } else if (nameParts.length === 2) {
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else if (nameParts.length > 2) {
      firstName = nameParts[0];
      middleName = nameParts.slice(1, -1).join(" "); // Everything in the middle
      lastName = nameParts[nameParts.length - 1];
    }
    const userData: CheckUser = {
      firstName: firstName || "",
      middleName: middleName || "", // Default to empty string if middleName is null
      lastName: lastName || "",
      platformId: rawData.sub,
      email: rawData.email,
    };
    return userData;
  }catch(error){
    WrappidLogger.error("Error in getting user details " + error);
    throw error;
  }
  
}

export { getAccessToken,getUserDetails };