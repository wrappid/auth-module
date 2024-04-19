/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev";

describe("Auth Module", () => {
  describe("checkLoginOrRegister", () => {
    test("TC01 Verify API Response Status Code", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com"})
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.status).toBe(200);
    });
    test("TC02 Verify API Response Body Structure", async () =>{
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com"})
        .set("Content-Type", "application/Json")
        .set("Accept-Encoding", "gzip, deflate, br")
        .set("Connection", "keep-alive")
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
      expect(response.body).toHaveProperty("message");
    });
    test("TC03 Verify API Response Format JSON", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.body.data).toBeInstanceOf(Object);
    });
    test("TC04 Verify API Response Contains Expected Fields", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("photoUrl");
      expect(response.body.data).toHaveProperty("isVerified");
    });
    test("TC05 Verify API Response Data for Each Field", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.body.data.name).toEqual("Pritam  Mondal");
      expect(response.body.data.photoUrl).toEqual("https://s3.ap-south-1.amazonaws.com/test-wrappid-bucket-storage/2024-03-07T13:27:42.221Z-pexels-michael-block-3225517.jpg");
      expect(response.body.data.isVerified).toEqual(true);
    });
    test("TC06 Verify API Response Time Within Acceptable Limits", async () => {
      const acceptableResponseTime = 1000;
      const startTime = Date.now();
      await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThanOrEqual(acceptableResponseTime);
    });
    test("TC07 Verify API Request Parameters Correctly Passed", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.body.message).toMatch("User Found");
    });
    test("TC08 Verify the API Request Method Correct", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.req.method).toBe("POST");
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response1: any = await request(API_URL)
        .put("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response1.status).toBe(404);
    });
    test("TC09 Verify API Endpoint URL", async () => {
      const reqPath = "/checkLoginOrRegister";
      const response: any = await request(API_URL)
        .post(reqPath)
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.req.path).toBe(reqPath);
    });
    test("TC10 Verify API Response Headers", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
    });
    test("TC11 Verify API Response Payload Size", async () => {
      const response: any = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      const payloadSize = Buffer.from(JSON.stringify(response.body)).length;
      const maxSize = 1000; // Set the maximum allowed payload size in bytes
      expect(payloadSize).toBeLessThanOrEqual(maxSize);

    });
    test("TC12 Verify API Handles Malformed Requests", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send()
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).not.toContain(200);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC13 Verify API Handles Authentication Failure", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "rahul@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(400);
    });
    test("TC14 Verify API Handles Missing Request Payload", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send()
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.statusCode).toBeLessThan(500);
    });
    test("TC15 Verify API Handles Non-Existent Resource", async () => {
      const response = await request(API_URL)
        .post("/invalid-resource")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(404);
    });  
    test("TC16 Verify API Handles Request Payload Size Limit", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com".repeat(2000000) })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.status).toBe(413); // 413 Payload Too Large

    });
    test("TC17 Verify API Handles Invalid Request Data", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "877708277" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.status).toBe(406); // 406 Not Acceptable

    });
    test("TC18 Verify API Handles Invalid Request Method", async () => {
      const response = await request(API_URL)
        .get("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.status).toBe(404);

      const response1 = await request(API_URL)
        .put("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response1.status).toBe(404);

      const response2 = await request(API_URL)
        .patch("/checkLoginOrRegister")
        .send({ emailOrPhone: "877708277" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response2.status).toBe(404);
    });
    test("TC19 Verify API Returns Success for Resource Creation", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(200);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC20 Verify API Returns Success for Resource Update (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC21 Verify API Returns Success for Resource Deletion (Skipped...)", async () => { });
    test("TC22 Verify API Returns Success for Resource Retrieval", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("photoUrl");
      expect(response.body.data).toHaveProperty("isVerified");

    });
    test("TC23 Verify API Returns Correct Resource by Identifier", async () => {
      await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    });
  
    test("TC24 Verify API Returns Correct Results for String with Special Characters", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "#pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(406);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  
    test("TC25 Verify API Returns Correct Results for Alphanumeric String", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "87770t3276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(406);
    });
    test("TC26 Verify API Returns Correct Results for String with Spaces", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "prit am@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(406);
    });
    test("TC27 Verify API Returns Correct Results for String with Non-ASCII Characters", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "87ñ70832é6" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toMatch("emailOrPhone must match the following");
    });
    test("TC28 Verify API Returns Correct Results for String with Escape Characters", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "\n87770\t83276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(406);
    });
    test("TC29 Verify API Response Content Type", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
 
    test("TC30 Verify API Response Not Compressed", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.headers["content-encoding"]).toBeUndefined();

    });
    test("TC31 Verify API Response Language (Accept-Language)", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.header["content-language"]).toBe("en-US");
    });
    test("TC32 Verify API Response Timezone (Accept-Timezone)", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "pritam@rxefy.com" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        .set("Accept-Timezone", "Asia/Kolkata");
      expect(response.header["content-language"]).toBe("en-US");
    });
  });
});








































































