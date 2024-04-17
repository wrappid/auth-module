import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev/";

describe("sentOtp", () => {
  test("TC01 Verify API Response Status Code", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.statusCode).toBe(200);
  });
  
  test("TC02 Verify API Response Body Structure", async () =>{
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("Content-Type", "application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response.body).toHaveProperty("message");
  });
  test("TC03 Verify API Response Format JSON", async () =>{
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("Content-Type", "application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response.body).toBeInstanceOf(Object);
  });
  test("TC04 Verify API Response with Invalid Credentials", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animeh@rxefy.com"}) // wrong email Id 
      .set("Content-Type", "Application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response.statusCode).toBe(500); // Expect internal server error for now
  });
  test("TC05 Verify API Response with Missing Email/Phone", async () => {
    const response = await request(API_URL)
      .post("login")
      .send({ data: " " }) // Missing emailOrPhone
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.statusCode).toBe(406);
  });
  test("TC06 Verify API Response Time Within Acceptable Limits", async () => {
    const acceptableResponseTime = 2000;
    const startTime = Date.now();
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    expect(responseTime).toBeLessThanOrEqual(acceptableResponseTime);
  });
  test("TC07 Verify API Request Parameters Correctly Passed", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: ""})
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body.message).toMatch("this field has unspecified keys: data");
  });
  test("TC08 Verify the API Request Method Correct", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.request.method).toBe("POST");
  });
  test("TC09 Verify API Endpoint URL", async () => {
    const reqPath = "/sentOtp";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response : any  = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.req.path).toBe(reqPath);
  });
  test("TC10 Verify API Response Headers", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(response.headers["access-control-allow-origin"]).toBe("*");
    expect(response.headers["connection"]).toBe("keep-alive");

  });
  test("TC011 Verify API Response Payload Size", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com"})
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.status).toBe(200);
    const contentLength = parseInt(response.headers["content-length"] || "0", 10);
    expect(contentLength).toBeLessThan(200 * 1024);
  });
  test("TC012 Verify API Handles Malformed Requests", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: ""})
      .set("Content-Type", "application/json"); 
    expect(response.status).toBe(406); // Expect bad request (modify if different error code)  Expect 406 for now (might need to adjust)
  });
  test("TC013 Verify API Handles Missing Request Payload", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      //.send({ emailOrPhone: "pritam@rxefy.com", password: "Pritam@rxefy123" })
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    //expect(response.status).toBe(400);
    expect(response.status).toBe(406); // Potentially adjust based on API behavior
  });
  /* test("TC014 Verify API Handles Request Payload Size Limit", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "animesh@rxefy.com".repeat(2000000) }) //use .repeat(20000000) for big payload size
      .set("Authorization", "Bearer invalid_token") // Set invalid token for testing
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive");
    expect(response.status).toBe(413);
  });*/
  test("TC15 Verify API Returns Correct Results for String with Special Characters", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ data: "a#nimesh@rxefy.com"})
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBe(406);
  });
  test("TC16 Verify API Returns Correct Results for Alphanumeric String", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ emailOrPhone: "87770t3276" })
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBe(406);
  });
  test("TC17 Verify API Returns Correct Results for String with Spaces", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ emailOrPhone: "ani mesh@rxefy.com" })
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBe(406);
  });
  test("TC18 Verify API Returns Correct Results for String with Non-ASCII Characters", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ emailOrPhone: "87ñ70832é6" })
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBe(406);
    expect(response.body.message).toMatch("emailOrPhone must match the following");
  });
  test("TC19 Verify API Returns Correct Results for String with Escape Characters", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ emailOrPhone: "\n87770\t83276" })
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.statusCode).toBe(406);
  });
  test("TC20 Verify API Response Content Type", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ emailOrPhone: "animesh@rxefy.com" })
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });

  test("TC21 Verify API Response Not Compressed", async () => {
    const response = await request(API_URL)
      .post("sentOtp")
      .send({ emailOrPhone: "animesh@rxefy.com" })
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.headers["content-encoding"]).toBeUndefined();

  });
});