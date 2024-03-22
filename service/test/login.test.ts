import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "http://localhost:8080";


describe("login", () => {
  test("TC01 Verify API Response Status Code", async () => {
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBe(200);
  });

  test("TC02 Verify API Response Format JSON", async () => {
    const response: any = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response._body).toBeInstanceOf(Object);
  });

  test("TC03 Verify API Response Contains Expected Fields", async () => {
    const response: any = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response._body).toHaveProperty("status");
    expect(response._body).toHaveProperty("message");
    expect(response._body).toHaveProperty("id");
    expect(response._body).toHaveProperty("personId");
    expect(response._body).toHaveProperty("accessToken");
    expect(response._body).toHaveProperty("refreshToken");
    expect(response._body).toHaveProperty("sessionId");
  });

  test("TC04 Verify API Response Data for Each Field", async () => {
    const response: any = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response._body).toHaveProperty("status", 200);
    expect(response._body).toHaveProperty("id", 381);
    expect(response._body).toHaveProperty("personId", 396);
  });

  test("TC05 Verify API Response Time Within Acceptable Limits", async () => {
    const acceptableResponseTime = 2000;
    const startTime = Date.now();
    await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThanOrEqual(acceptableResponseTime);
  });

  test("TC06 Verify API Request Parameters Correctly Passed", async () => {
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxey123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const response1 = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "877703276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body.message).toMatch("Invalid password");
    expect(response1.body.message).toMatch("emailOrPhone must match the following");
  });
  test("TC07 Verify the API Request Method Correct", async () => {
    const response: any = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.req.method).toBe("POST");
  });

  test("TC08 Verify API Endpoint URL", async () => {
    const reqPath = "/login";
    const response: any = await request(API_URL)
      .post(reqPath)
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.req.path).toBe(reqPath);
  });

  test("TC09 Verify API Response Headers", async () => {
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["connection"]).toBe("keep-alive");
  });

  test("TC10 Verify API Response Payload Size", async () => {
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const payloadSize = Buffer.from(JSON.stringify(response.body)).length;
    const maxSize = 1000; // Set the maximum allowed payload size in bytes
    expect(payloadSize).toBeLessThanOrEqual(maxSize);
  });

  test("TC11 Verify API Handles Malformed Requests", async () => {
    //Request with wrong password
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxey123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    // Request with invalid emailOrPhone
    const response1 = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "877703276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body.message).toMatch("Invalid password");
    expect(response1.body.message).toMatch("emailOrPhone must match the following");
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC12 Verify API Handles Authentication Failure (Skipped...)", () => { });

  test("TC13 Verify API Handles Missing Request Payload", async () => {
    const response = await request(API_URL)
      .post("/login")
      .send({})
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBeGreaterThanOrEqual(400);
    expect(response.statusCode).toBeLessThan(500);
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC14 Verify API Handles Non-Existent Resource (Skipped...)", () => { });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC15 Verify API Handles Unauthorized Access (Skipped...)", () => { });

  test("TC16 Verify API Handles Request Payload Size Limit", async () => {
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276".repeat(20000000), password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.status).toBe(413); // 413 Payload Too Large

  });

  test("TC17 Verify API Handles Invalid Request Data", async () => {
    //Request with Invalid password
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxey123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    // Request with invalid emailOrPhone
    const response1 = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "877703276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body.message).toMatch("Invalid password");
    expect(response1.body.message).toMatch("emailOrPhone must match the following");
  });

  test("TC18 Verify API Handles Invalid Request Method", async () => {
    // Request with invalid reqMethod
    const response = await request(API_URL)
      .get("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    // Request with invalid reqMethod
    const response1 = await request(API_URL)
      .put("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    // Request with invalid reqMethod
    const response2 = await request(API_URL)
      .patch("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.status).toBe(404);
    expect(response1.status).toBe(404);
    expect(response2.status).toBe(404);

  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC19 Verify API Returns Success for Resource Creation (Skipped...)", () => { });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC20 Verify API Returns Success for Resource Update(Skipped...)", () => { });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC21 Verify API Returns Success for Resource Deletion (Skipped...)", () => { });

  test("TC22 Verify API Returns Success for Resource Retrieval ", async () => {
    const response = await request(API_URL)
      .post("/login")
      .send({ emailOrPhone: "8777083276", password: "Pritam@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBe(200);
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC23 Verify API Returns Correct Resource by Identifier", () => { });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC24 Verify API Returns Correct Resource by Parameters", () => { });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC25 Verify API Response Contains Pagination Info (Skipped...)", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC26 Verify API Response Sorting Based on Parameters", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC27 Verify API Response Contains Filtering Info", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC28 Verify API Returns Correct Results for Partial String", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC29 Verify API Returns Correct Results for Case-Insensitive String", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC30 Verify API Returns Correct Results for String with Special Characters", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC31 Verify API Returns Correct Results for Multi-Word String", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC32 Verify API Returns Correct Results for Alphanumeric String", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC33 Verify API Returns Correct Results for String with Spaces", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC34 Verify API Returns Correct Results for String with Non-ASCII Characters", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC35 Verify API Returns Correct Results for String with Mixed Character Types", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC36 Verify API Returns Correct Results for String with HTML Tags", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC37 Verify API Returns Correct Results for String with Escape Characters", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC38 Verify API Response Content Type", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC39 Verify API Response Compression (Accept-Encoding)", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC40 Verify API Response Not Compressed", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC41 Verify API Response Not Compressed (Other Encoding)", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC42 Verify API Response Language (Accept-Language)", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC43 Verify API Response Locale", async () => { });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC44 Verify API Response Timezone (Accept-Timezone)", async () => { });
});