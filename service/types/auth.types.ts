// Base response data interface for user-person relationship
interface IUserPersonData {
  userId: number;
  personId: number;
}

// Base response data interface for user-person relationship
interface ResData {
  message: string;
  data: IUserPersonData;
}

// Complete response structure
interface IApiResponse {
  status: number;
  resData: ResData;
}

interface RequestBody<T> {
  data: T;
}

interface ResponseBody<T> {
  data: T;
  message?: string;
}

interface IUserAuthData {
  id: number;
  personId: 
  number; 
  accessToken: 
  string; 
  refreshToken: 
  string; 
  sessionId: string;
}


interface Register {
  status: number,
  resData: ResponseBody<IUserAuthData>
}

export{
  IUserPersonData,
  IApiResponse,
  RequestBody,
  ResponseBody,
  IUserAuthData,
  Register
};