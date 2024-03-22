import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "http://localhost:8080";

describe("Auth Module", () => {
  describe("checkLoginOrRegister", () => {
    test("TC01 Verify API Response Status Code", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.status).toBe(200);
    });

    test("TC02 Verify API Response Format JSON", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.body.data).toBeInstanceOf(Object);
    });

    test("TC03 Verify API Response Contains Expected Fields", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("photoUrl");
      expect(response.body.data).toHaveProperty("isVerified");
    });

    test("TC04 Verify API Response Data for Each Field", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.body.data.name).toEqual("salman    khan");
      expect(response.body.data.photoUrl).toEqual("https://elasticbeanstalk-ap-south-1-423772433424.s3-ap-south-1.amazonaws.com/prescriptionDocuments/photo-1697136462539.jpg");
      expect(response.body.data.isVerified).toEqual(true);
    });

    test("TC05 Verify API Response Time Within Acceptable Limits", async () => {
      const acceptableResponseTime = 1000;
      const startTime = Date.now();
      await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThanOrEqual(acceptableResponseTime);
    });

    test("TC06 Verify API Request Parameters Correctly Passed", async () => {
      await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    });

    test("TC07 Verify the API Request Method Correct", async () => {
      const response: any = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.req.method).toBe("POST");

    });

    test("TC08 Verify API Endpoint URL", async () => {
      const reqPath = "/checkLoginOrRegister";
      const response: any = await request(API_URL)
        .post(reqPath)
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.req.path).toBe(reqPath);
    });

    test("TC09 Verify API Response Headers", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
    });

    test("TC10 Verify API Response Payload Size", async () => {
      const response: any = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      const payloadSize = Buffer.from(JSON.stringify(response.body)).length;
      const maxSize = 1000; // Set the maximum allowed payload size in bytes
      expect(payloadSize).toBeLessThanOrEqual(maxSize);

    });
    test("TC11 Verify API Handles Malformed Requests", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send()
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).not.toContain(200);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC12 Verify API Handles Authentication Failure (Skipped...)", async () => { });
    test("TC13 Verify API Handles Missing Request Payload", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send()
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBeGreaterThanOrEqual(400);
      expect(response.statusCode).toBeLessThan(500);
    });
    test("TC14 Verify API Handles Non-Existent Resource", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083277" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(201);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC15 Verify API Handles Unauthorized Access (Skipped....)", async () => { });
    test("TC16 Verify API Handles Request Payload Size Limit", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083277".repeat(20000000) })
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
        .send({ emailOrPhone: "8777083277" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.status).toBe(404);

      const response1 = await request(API_URL)
        .put("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083277" })
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
        .send({ emailOrPhone: "8777083277" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(201);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC20 Verify API Returns Success for Resource Update (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC21 Verify API Returns Success for Resource Deletion (Skipped...)", async () => { });
    test("TC22 Verify API Returns Success for Resource Retrieval", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Object);
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("photoUrl");
      expect(response.body.data).toHaveProperty("isVerified");

    });
    test("TC23 Verify API Returns Correct Resource by Identifier", async () => {
      await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC24 Verify API Returns Correct Resource by Parameters (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC25 Verify API Response Contains Pagination Info (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC26 Verify API Response Sorting Based on Parameters (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC27 Verify API Response Contains Filtering Info (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC28 Verify API Returns Correct Results for Partial String (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC29 Verify API Returns Correct Results for Case-Insensitive String (Skipped...)", async () => { });
    test("TC30 Verify API Returns Correct Results for String with Special Characters", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "#8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(200);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC31 Verify API Returns Correct Results for Multi-Word String (Skipped...)", async () => { });
    test("TC32 Verify API Returns Correct Results for Alphanumeric String", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "87770t3276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(406);
    });
    test("TC33 Verify API Returns Correct Results for String with Spaces", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "877 70 83276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(200);
    });
    test("TC34 Verify API Returns Correct Results for String with Non-ASCII Characters", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "87ñ70832é6" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(406);
      expect(response.body.message).toMatch("emailOrPhone must match the following");
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC35 Verify API Returns Correct Results for String with Mixed Character Types (Skipped...)", async () => { });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC36 Verify API Returns Correct Results for String with HTML Tags (Skipped...)", async () => { });
    test("TC37 Verify API Returns Correct Results for String with Escape Characters", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "\n87770\t83276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.statusCode).toBe(200);
    });
    test("TC38 Verify API Response Content Type", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC39 Verify API Response Compression (Accept-Encoding) (Skipped...)", async () => { });
    test("TC40 Verify API Response Not Compressed", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.headers["content-encoding"]).toBeUndefined();

    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC41 Verify API Response Not Compressed (Other Encoding) (Skipped...)", async () => { });
    test("TC42 Verify API Response Language (Accept-Language)", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
      expect(response.header["content-language"]).toBe("en-US");
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    test("TC43 Verify API Response Locale", async () => { });
    test("TC44 Verify API Response Timezone (Accept-Timezone)", async () => {
      const response = await request(API_URL)
        .post("/checkLoginOrRegister")
        .send({ emailOrPhone: "8777083276" })
        .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")
        .set("Accept-Timezone", "Asia/Kolkata");
      expect(response.header["content-language"]).toBe("en-US");
    });
  });
});








































































