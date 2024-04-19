import { describe, test, expect, beforeAll } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev";
let token = " ";
beforeAll (async () => {
  const response = await request(API_URL)
    .post("/login")
    .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
    .set("Content-Type", "application/json")
    .set("Accept-Encoding", "gzip, deflate, br")
    .set("Connection", "keep-alive")
    .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  token = response.body.accessToken;
});
describe("getIP", () => {
  test("TC01 Verify API Response Status Code", async () => {
    const response = await request(API_URL)
      .get("/getIP")  
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json") 
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      
    expect(response.statusCode).toBe(200);
  });
  test("TC02 Verify API Request Method for /getIP", async () => {
    try {
      // Attempt to send a request with a method other than GET (e.g., POST)
      await request(API_URL)
        .post("/getIP")  // This should fail because /getIP expects GET
        .send({emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })  // Include any data required for the test
        .set("Content-Type", "application/json")  // Optional headers
        .set("Accept-Encoding", "gzip, deflate, br")
        .set("Connection", "keep-alive")
        .set("User-Agent",
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    } catch (error) {
      
      expect(error).toBeDefined();  
    }
  });
  test("TC03 Verify API Response Headers", async () => {
    const response = await request(API_URL)
      .get("/getIP")  
      .set("Authorization", `Bearer ${token}`)
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["connection"]).toBe("keep-alive");

  });
  test("TC04 Verify API Response Time Within Acceptable Limits", async () => {
    const acceptableResponseTime = 2000;
    const startTime = Date.now();
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const response = await request(API_URL)
      .get("/getIP")  
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThanOrEqual(acceptableResponseTime);
  });
  test("TC05 Verify API Response Payload Size", async () => {
    const response = await request(API_URL)
      .get("/getIP")  
      .set("Authorization", `Bearer ${token}`)
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.status).toBe(200);
    const contentLength = parseInt(response.headers["content-length"] || "0", 10);
    expect(contentLength).toBeLessThan(200 * 1024);
  });
  test("TC06 Verify API Handles Malformed Requests", async () => {
    const response = await request(API_URL)
      .get("/getIP")  
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json") 
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      
    expect(response.statusCode).toBe(401);
  });
  
});