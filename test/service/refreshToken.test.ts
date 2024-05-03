import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev/";

const APIReqMethod: {[key: string]: RequestMethod} = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch"
};

type GenericObject ={
    [key: string]: any
} 

type RequestMethod = "get" | "post" | "put" | "patch";

type APITestOptionsType = {
    method: RequestMethod;
    endpoint: string;
    data?:  GenericObject
}

async function apiTest(options: APITestOptionsType) {
  const apiRequest = request(API_URL);
  // .set("Content-Type", "application/json")
  // .set("Accept-Encoding", "gzip, deflate, br")
  // .set("Connection", "keep-alive")
  // .set("User-Agent",
  //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

  let requestInstance = null;

  switch (options.method) {
    case APIReqMethod.GET:
      requestInstance = apiRequest.get(options.endpoint);
        
      break;
    case APIReqMethod.POST:
      requestInstance = apiRequest.post(options.endpoint);
        
      break;
    case APIReqMethod.PUT:
      requestInstance = apiRequest.put(options.endpoint);
        
      break;
    case APIReqMethod.PATCH:
      requestInstance = apiRequest.patch(options.endpoint);
        
      break;
    default:
      throw new Error("Method was not mentioned");
      break;
  }

  return await requestInstance.send(options.data).set("Content-Type", "application/json")
    .set("Accept-Encoding", "gzip, deflate, br")
    .set("Connection", "keep-alive")
    .set("User-Agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

}

describe("login", () => {
  test("TC01 Verify API Response Status Code", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "neel@rxefy.com", password: "Asdf123@@" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    
    expect(response.statusCode).toBe(200);
  });

  test("TC01 Verify API Response Status Code _ through function", async () => { 
    //{ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" }
    const response = await apiTest({
      method: APIReqMethod.POST,
      endpoint: "login", 
      data: { emailOrPhone: "neel@rxefy.com", password: "Asdf123@@" } 
    });

    expect(response.statusCode).toBe(200);
  });
});