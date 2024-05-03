import { describe, test, expect } from "@jest/globals";
import { WrappaidTest, coreConstant } from "@wrappid/service-core";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev/";

const wrappidTest = new WrappaidTest({baseURL: API_URL});

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
    const response = await wrappidTest.apiTest({
      method: coreConstant.httpMethod.HTTP_POST,
      endpoint: "login", 
      data: { emailOrPhone: "neel@rxefy.com", password: "Asdf123@@" } 
    });

    expect(response.statusCode).toBe(200);
  });
});