import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev/";

describe("login", () => {
  test("TC01 Verify API Response Status Code", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.statusCode).toBe(200);
  });
  test("TC02 Verify API Response Body Structure", async () =>{
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123"})
      .set("Content-Type", "application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response.body).toHaveProperty("accessToken");
   
  });
  test("TC03 Verify API Response Format JSON", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body).toBeInstanceOf(Object);
  });
  test("TC04 Verify API Response with Invalid Credentials", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({emailOrPhone: "pritam@rxefy.com", password: "wrongpassword"})
      .set("Content-Type", "Application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response.statusCode).toBe(401);
   
    const response1 = await request(API_URL)
      .post("login")
      .send({emailOrPhone: "Animesh@rxefy.com", password: "wrongpassword"})
      .set("Content-Type", "Application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response1.statusCode).toBe(400);
  
  });
  test("TC05 Verify API Response with Missing Email/Phone", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ password: "Pritam@rxefy123" }) // Missing emailOrPhone
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.statusCode).toBe(406);
  });
  test("TC06 Verify API Response Contains Expected Fields", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("personId");
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body).toHaveProperty("sessionId");
    expect(response.statusCode).toBe(200);

  });
  test("TC07 Verify API Response Data for Each Field", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body).toHaveProperty("status", 200);
    expect(response.body).toHaveProperty("id", 2);
    expect(response.body).toHaveProperty("personId", 1);
    expect(response.body).toHaveProperty("sessionId", 340);
  });
  test("TC08 Verify API Response Time Within Acceptable Limits", async () => {
    const acceptableResponseTime = 2000;
    const startTime = Date.now();
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThanOrEqual(acceptableResponseTime);
  });
  test("TC09 Verify API Request Parameters Correctly Passed", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritm@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const response1 = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@refy.com", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body.message).toMatch("Invalid password");
    expect(response1.body.message).toMatch("User does not exist");
  });
  test("TC010 Verify the API Request Method Correct", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.request.method).toBe("POST");
  });
  test("TC011 Verify API Endpoint URL", async () => {
    const reqPath = "/login";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response : any  = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.req.path).toBe(reqPath);
  });
  test("TC012 Verify API Response Headers", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["connection"]).toBe("keep-alive");

  });
  test("TC013 Verify API Response Payload Size", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.status).toBe(200);
    const contentLength = parseInt(response.headers["content-length"] || "0", 10);

    expect(contentLength).toBeLessThan(10 * 1024);
    // expect(response.headers["content-length"]).toBeLessThan(10 * 1024);

    // const payloadSize = Buffer.from(JSON.stringify(response.body)).length;
    //         const maxSize = 1000; // Set the maximum allowed payload size in bytes
    //         expect(payloadSize).toBeLessThanOrEqual(maxSize)

  });
});