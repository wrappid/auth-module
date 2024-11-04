// Base response data interface for user-person relationship
interface IUserPersonData {
  name?: string;
  photoUrl?: string;
  identifier: string
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
  data?: T;
  error?: Error;
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
  email:string;
  emailVerified:boolean;
  phone:string;
  phoneVerified:boolean;
  name: string
  photoUrl:string;
}


interface Register {
  status: number,
  resData: ResponseBody<IUserAuthData>
}

// You can also use an interface
interface LogoutResponse {
  status: number;
  message: string;
}

// You can also use an interface
interface RefreshToken {
  status: number;
  accessToken: string;
}

interface RegisterWithPass {
  identifier: string; 
  password: string; 
  confirmPassWord:string,
  otp: string
}

interface LoginWithOtp {
  identifier: string;
  otp: string;
}

interface LoginWithPass {
  identifier: string;
  password: string;
}

interface ResetPass {
  identifier: string;
  password:string;
  confirmPassword:string;
  otp: string;
}

interface UserRequest extends Express.Request {
  user: {
    userId: string;
  }
}

interface SenOtpBody {
  identifier: string;
  serviceName:string;
  userID?:number;
}

export type {
  IApiResponse, IUserAuthData, IUserPersonData, LoginWithOtp,
  LoginWithPass, LogoutResponse,
  RefreshToken, Register, RegisterWithPass, RequestBody, ResetPass, ResponseBody, SenOtpBody, UserRequest
};
