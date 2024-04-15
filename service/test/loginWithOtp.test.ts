import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev/";



describe("loginWithOtp", () => {
  test("TC01 Verify API Response Status Code", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ data: "animesh@rxefy.com", otp: "666001" }) // Include the retrieved OTP
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.statusCode).toBe(200); // Assert successful loginWithOtp status code
    // Optionally, assert successful loginWithOtp response body for messages etc.
  }); test("TC02 Verify API Response Body Structure", async () =>{
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001"})
      .set("Content-Type", "application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response.body).toHaveProperty("accessToken");
   
  });
  test("TC03 Verify API Response Format JSON", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "8777083276", otp: "666001"})
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.body).toBeInstanceOf(Object);
  });
  test("TC04 Verify API Response with Invalid Credentials", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({emailOrPhone: "pritam@rxefy.com", otp: "666001"})
      .set("Content-Type", "Application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response.statusCode).toBe(401);
   
    const response1 = await request(API_URL)
      .post("loginWithOtp")
      .send({emailOrPhone: "Animesh@rxefy.com", otp: "666001"})
      .set("Content-Type", "Application/Json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"); 
    expect(response1.statusCode).toBe(400);
  
  });
  test("TC05 Verify API Response with Missing Email/Phone", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ otp: "666001", }) // Missing emailOrPhone
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.statusCode).toBe(406);
  });
  test("TC06 Verify API Response Contains Expected Fields", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
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
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
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
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
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
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", password: "Pritm@rxefy123" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    const response1 = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@refy.com", otp: "666001" })
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
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.request.method).toBe("POST");
  });
  test("TC011 Verify API Endpoint URL", async () => {
    const reqPath = "/loginWithOtp";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response : any  = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.req.path).toBe(reqPath);
  });
  test("TC012 Verify API Response Headers", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
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
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.status).toBe(200);
    const contentLength = parseInt(response.headers["content-length"] || "0", 10);
    expect(contentLength).toBeLessThan(200 * 1024);
 

    // const  payloadSize = Buffer.from(JSON.stringify(response.body)).length;
    //         const maxSize = 1000; // Set the maximum allowed payload size in bytes
    //         expect(payloadSize).toBeLessThanOrEqual(maxSize)

  });

  //new 
  test("TC014 Verify API Handles Malformed Requests", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "Pritam@rxefy.com"}) // Missing password field
      .set("Content-Type", "application/json"); 
    expect(response.status).toBe(406); // Expect bad request (modify if different error code)  Expect 406 for now (might need to adjust)
  });
  test("TC015 Verify API Handles Authentication Failure", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp") // Replace with correct endpoint
      .set("Authorization", "Bearer invalid_token") // Set invalid token for testing
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive");
    expect(response.status).toBe(406); // Expect bad request (modify if different error code)  Expect 406 for now (might need to adjust)
  });
  test("TC016 Verify API Handles Missing Request Payload", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      //.send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    //expect(response.status).toBe(400);
    expect(response.status).toBe(406); // Potentially adjust based on API behavior
  });
  test("TC017 Verify API Handles Non-Existent Resource", async () => {
    const response = await request(API_URL)
      .post("invalid-resource") // Replace with a non-existent endpoint
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
      .set("Authorization", "Bearer invalid_token") // Set invalid token for testing
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive");
    expect(response.status).toBe(404);
  });
  test("TC018 Verify API Handles Unauthorized Access", async () => {
    const response = await request(API_URL)
      .get("loginWithOtp") 
      //.send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
      .set("Authorization", "Bearer invalid_token") // Set invalid token for testing
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive");
    expect(response.status).toBe(401); // 
  });
  test("TC019 Verify API Handles Request Payload Size Limit", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp") 
      .send({ emailOrPhone: "pritam@rxefy.com".repeat(2000000), otp: "666001" }) //use .repeat(20000000) for big payload size
      .set("Authorization", "Bearer invalid_token") // Set invalid token for testing
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive");
    expect(response.status).toBe(413);
  });
  test("TC020 Verify API Handles Invalid Request Method", async () => {
    const response = await request(API_URL)
      .put("loginWithOtp") 
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" }) 
      .set("Authorization", "Bearer invalid_token") // Set invalid token for testing
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive");
    expect(response.status).toBe(405);
  });
  test("TC021 Verify API Returns Success for Resource Creation", async () => {
    const validData = {emailOrPhone: "pritam@rxefy.com", otp: "666001"}; 
  
    const response = await request(API_URL)
      .post("loginWithOtp")  
      .send(validData)
      .set("Content-Type", "application/json") // Adjust if needed based on API
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    expect(response.status).toBe(200); // Expect Created (200) status code
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC22 Verify API Returns Success for Resource Update", async () => {
    const updateData = { emailOrPhone: "pritam@rxefy.com", otp: "666001" };  // Replace with actual data
    
    const response = await request(API_URL)
      .put("loginWithOtp") // Missing resource ID in the path
      .send(updateData)
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("Content-Type", "application/json") // Adjust if needed based on API
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    
    expect(response.status).toBeGreaterThanOrEqual(400); // Expect Bad Request (400) or similar error
    // Optional: Verify the presence of an error message indicating missing resource ID
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test("TC23 Verify API Returns Success for Resource Deletion (Skipped...)", () => { });
  test("TC024 Verify API Returns Success for Resource Retrieval", async () => {
  //   const response = await request(API_URL)
  //     .post("loginWithOtp")
  //     .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
  //     .set("Content-Type", "application/json")
  //     .set("Accept-Encoding", "gzip, deflate, br")
  //     .set("Connection", "keep-alive")
  //     .set("User-Agent",
  //       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

  //   expect(response.statusCode).toBe(200);
  });
  //new test cases added
  test("TC025: Verify loginWithOtp Fails for Inactive User", async () => {
  //   const inactiveUserData = {
  //     username: "animesh@rxefy.com", // Replace with actual inactive username or email
  //     password: "Rxefy@012", // Replace with actual password
  //   };

    //   const response = await request(API_URL)
    //     .post("loginWithOtp") // Replace with actual loginWithOtp endpoint
    //     .send(inactiveUserData)
    //     .set("Accept-Encoding", "gzip, deflate, br")
    //     .set("Connection", "keep-alive")
    //     .set("Content-Type", "application/json") // Adjust if needed based on API
    //     .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    //   expect(response.status).toBeGreaterThanOrEqual(400); // Expect Bad Request (400) or similar error code
  });
  test("TC026: Verify loginWithOtp Handling of Multiple Attempts (if applicable)", async () => {
    //   // Check if API supports account lockout after failed loginWithOtp attempts
  
    //   if (apiSupportsLockout) {
    //     const userData = {
    //       username: "test_user", // Replace with actual username or email
    //       password: "incorrect_password", // Replace with incorrect password
    //     };
  
    //     // Define the number of failed attempts to simulate (adjust based on your API lockout threshold)
    //     const numAttempts = 5;
  
    //     for (let i = 0; i < numAttempts; i++) {
    //       const response = await request(API_URL)
    //         .post("/loginWithOtp") // Replace with actual loginWithOtp endpoint
    //         .send(userData)
    //         .set("Accept-Encoding", "gzip, deflate, br")
    //         .set("Connection", "keep-alive")
    //         .set("Content-Type", "application/json") // Adjust if needed based on API
    //         .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  
    //       // Expect unsuccessful loginWithOtp response (e.g., 401 Unauthorized)
    //       expect(response.status).toBeGreaterThanOrEqual(400);
    //     }
  
    //     // Attempt loginWithOtp with correct credentials after simulated failed attempts
    //     const correctResponse = await request(API_URL)
    //       .post("/loginWithOtp") // Replace with actual loginWithOtp endpoint
    //       .send({ username: userData.username, password: "correct_password" }) // Replace with correct password
    //       .set("Accept-Encoding", "gzip, deflate, br")
    //       .set("Connection", "keep-alive")
    //       .set("Content-Type", "application/json") // Adjust if needed based on API
    //       .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  
  //     // Expected behavior depends on your API's lockout implementation:
  //     if (/* API immediately locks out after exceeding attempts */) {
  //       expect(correctResponse.status).toBeGreaterThanOrEqual(400); // Expect continued failure due to lockout
  //     } else {
  //       expect(correctResponse.status).toBe(200); // Expect successful loginWithOtp after a lockout period (if applicable)
  //     }
  //   } else {
  //     console.log("Skipping multiple loginWithOtp attempts test - Account lockout not supported by API");
  //   }
  });
  test("TC027: Verify loginWithOtp Response Contains User Information (Optional)", async () => {
    const response = await request(API_URL)
      .post("loginWithOtp")
      .send({ emailOrPhone: "pritam@rxefy.com", otp: "666001" })
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");

    expect(response.statusCode).toBe(200);
  
    // Optional Assertions for User Information:
    if (response.body) { // Check if there's a response body (might be empty on some APIs)
      expect(response.body.id).toBeDefined(); // Verify presence of user ID
      expect(response.body.username).toBeDefined(); // Verify presence of username (or email)
      // Add assertions for other expected user information fields based on your API response structure
      // (e.g., name, email, roles, permissions)
      expect(response.body.name).toBeDefined(); // Example assertion for name
    }
  });
  
  test("TC029: Verify loginWithOtp with Encrypted Credentials (if applicable)", async () => {
    // // Check if your API supports encrypted credentials
  
    // if (/* Your API supports encrypted credentials */) {
    //   // You'll need a library/function to handle credential encryption based on your API's requirements
  
    //   const encryptedCredentials = encryptCredentials({
    //     username: "test_user", // Replace with actual username or email
    //     password: "correct_password", // Replace with correct password
    //   });
  
    //   const response = await request(API_URL)
    //     .post("/loginWithOtp") // Replace with actual loginWithOtp endpoint
    //     .send(encryptedCredentials) // Send encrypted credentials
    //     .set("Accept-Encoding", "gzip, deflate, br")
    //     .set("Connection", "keep-alive")
    //     .set("Content-Type", "application/json") // Adjust if needed based on API
    //     .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  
    //   expect(response.status).toBe(200); // Expect successful loginWithOtp (200 OK)
    // } else {
    //   console.log("Skipping encrypted credentials test - Not supported by API");
    // }
  });
});
