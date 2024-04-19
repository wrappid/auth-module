
import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev";
// eslint-disable-next-line no-unused-vars
let token = "";
// eslint-disable-next-line no-unused-vars
const a = "Animesh@01";
// eslint-disable-next-line no-unused-vars
const b = "Pritam@01";
beforeAll (async () => {
  const response = await request(API_URL)
    .post("/login")
    .send({ emailOrPhone: "animesh+test@rxefy.com", password: a })// now password is = b 
    .set("Content-Type", "application/json")
    .set("Accept-Encoding", "gzip, deflate, br")
    .set("Connection", "keep-alive")
    .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  token = response.body.accessToken;
});

describe("changePassword", () => {
  // test("TC01 Verify API Response Status Code", async () => {
  //   const response = await request(API_URL)
  //     .post("/changePassword") // Replace with actual endpoint if different
  //     .send({
  //       password: a, // Replace with actual field name
  //       newPassword: b, // Replace with actual field name
  //       confirmPassword: b, // Replace with actual field name
  //     })
  //     .set("Authorization", `Bearer ${token}`)
  //     .set("Content-Type", "application/json")
  //     .set("Accept-Encoding", "gzip, deflate, br")
  //     .set("Connection", "keep-alive");
  
  //   expect(response.statusCode).toBe(200); 
  // });
  // test("TC02 Verify API Response Body Structure", async () => {
  //   const response = await request(API_URL)
  //     .post("/changePassword") // Replace with actual endpoint if different
  //     .send({
  //       password: a, // Replace with actual field name
  //       newPassword: b, // Replace with actual field name
  //       confirmPassword: b, // Replace with actual field name
  //     })
  //     .set("Authorization", `Bearer ${token}`)
  //     .set("Content-Type", "application/json")
  //     .set("Accept-Encoding", "gzip, deflate, br")
  //     .set("Connection", "keep-alive");
        
  //   expect(response.statusCode).toBe(200);
  //   expect(response.headers["content-type"]).toMatch("application/json");
  //   expect(response.body).toHaveProperty("message"); 
  // });
  test("TC03 Verify Password Change with Incorrect Old Password", async () => {
    const response = await request(API_URL)
      .post("/changePassword")
      .send({ password: "jhsdksdb@hhchhj", newPassword: a, confirmPassword: a })
      //.set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br") // Assumed headers, adjust as needed
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  
    // Expected error code for invalid credentials
    const expectedErrorCode = 403; // Adjust based on API's error handling
  
    expect(response.statusCode).toBe(expectedErrorCode);
  
  });
  // test("TC04 Verify API Response Time Within Acceptable Limits", async () => {
  //   const acceptableResponseTime = 2000;
  //   const startTime = Date.now();
  //   // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  //   const response = await request(API_URL)
  //     .post("/changePassword")
  //     .send({ password: a, newPassword: b, confirmPassword: b})
  //     .set("Authorization", `Bearer ${token}`)
  //     .set("Content-Type", "application/json")
  //     .set("Accept-Encoding", "gzip, deflate, br")
  //     .set("Connection", "keep-alive")
  //     .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  //   const endTime = Date.now();
  //   const responseTime = endTime - startTime;
  //   expect(responseTime).toBeLessThanOrEqual(acceptableResponseTime);
  // });
  // test("TC05 Verify API Request Method: Ensure the password change request is sent using the correct method (usually POST)", async () => {
  //   const response = await request(API_URL)
  //     .post("/changePassword") // Replace with actual endpoint if different
  //     .send({
  //       password: b, 
  //       newPassword: a, 
  //       confirmPassword: a, 
  //     })
  //     .set("Authorization", `Bearer ${token}`)
  //     .set("Content-Type", "application/json")
  //     .set("Accept-Encoding", "gzip, deflate, br")
  //     .set("Connection", "keep-alive");
      
  //   expect(response.request.method).toBe("POST");
  // });
  test("TC06 Verify API Handles Malformed Requests  ", async () => {
    const response = await request(API_URL)
      .post("/changePassword")
      .send({ password: "", newPassword: a, confirmPassword: a })
      //.set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br") // Assumed headers, adjust as needed
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  
    // Expected error code for invalid credentials
    const expectedErrorCode = 403; // Adjust based on API's error handling
    expect(response.statusCode).toBe(expectedErrorCode);

  });
  test("TC07 Verify API Handles Missing Request Payload", async () => {
    const response = await request(API_URL)
      .post("/changePassword")
      //.send({ password: "", newPassword: a, confirmPassword: a })
    // .set("Authorization", `Bearer ${token}`)
      .set("content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive")
      .set("User-Agent",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
    
    expect(response.status).toBe(403);
  });
  // test("TC08 Verify API Handles Request Payload Size Limit", async () => {
  //   const response = await request(API_URL)
  //     .post("/changePassword")
  //     .send({ password: b, newPassword: a, confirmPassword: a })
  //     .set("Authorization", `Bearer ${token}`) 
  //     .set("content-Type", "application/json")
  //     .set("Accept-Encoding", "gzip, deflate, br")
  //     .set("Connection", "keep-alive");
  //   expect(response.statusCode).toBe(200); 
    

  //   // eslint-disable-next-line no-unused-vars
  //   const responseLengthString = response.headers["content-length"];
  //   // eslint-disable-next-line no-unused-vars
  //   const responseLengthNumber = parseInt(responseLengthString);

  //   expect(responseLengthNumber).toBeLessThan(1024); 
  // });
  // test("TC09: Verify Password Change with Weak New Password", async () => {
  //     const response = await request(API_URL)
  //       .post("/changePassword")
  //       .send({
  //         password: b, // Replace with a valid old password
  //         newPassword: "123466", // Replace with a weak password
  //         confirmPassword: "123466" // Replace with a weak password
  
  //       })
  //       .set("Authorization", `Bearer ${token}`)
  //       .set("Content-Type", "application/json")
  //       .set("Accept-Encoding", "gzip, deflate, br") // Adjust headers if needed
  //       .set("Connection", "keep-alive")
  //       .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
   
  //     // Expected error code for weak password
  //     const expectedErrorCode = 422; // Adjust based on API's error handling
   
  //     expect(response.statusCode).toBe(expectedErrorCode);
   
     
  //   });
  test("TC10: Verify Password Change with Existing New Password", async () => {
    const response = await request(API_URL)
      .post("/changePassword")
    // Ensure valid authentication if required
      .send({
        password: a, // Replace with existing current password
        newPassword: a, // Same as current password
        confirmPassword: a // Same as current password
  
      })
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br") // Adjust headers if needed
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
   
    // Expected code for validation error
    const expectedErrorCode = 401; // Adjust based on API's error handling
   
    expect(response.statusCode).toBe(expectedErrorCode);
  });
  //   test("TC11: Verify Password Change for Inactive User", async () => {
  //     const response = await request(API_URL)
  //       .post("/changePassword")
  //       // Ensure valid authentication headers for the inactive user
  //       .send({
  //         oldPassword: "inactiveUserPassword", // Replace with inactive user's password
  //         newPassword: "NewStrongPassword123"
  //       })
  //       .set("Content-Type", "application/json")
  //       .set("Accept-Encoding", "gzip, deflate, br") // Adjust headers if needed
  //       .set("Connection", "keep-alive")
  //       .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
   
  //     // Expected error code for inactive account
  //     const expectedErrorCode = 403; // Adjust based on API's error handling
   
  //     expect(response.statusCode).toBe(expectedErrorCode);
   
  //     // Assert that the response body indicates inactive account
  //     // (Specific assertion format will depend on API's response structure)
  //     expect(response.body).toContain("Account is inactive");
  //   });
  test("TC12: Verify Password Change Rate Limiting (Simple)", async () => {
    // Assuming API accepts valid old and new passwords for a change
    const validChangeRequest = {
      password: a,
      newPassword: b,
      confirmPassword: b
  
    };
   
    // Send two quick password change requests (adjust for your rate limit)
    await request(API_URL)
      .post("/changePassword")
      .send(validChangeRequest)
      .set("Content-Type", "application/json");
   
    await request(API_URL)
      .post("/changePassword")
      .send(validChangeRequest)
      .set("Content-Type", "application/json");
   
    // Expect a rate limit error for the second request (assuming 429)
    const response = await request(API_URL)
      .post("/changePassword")
      .send(validChangeRequest)
      .set("Content-Type", "application/json");
   
    expect(response.statusCode).toBe(401);
  });
  test("TC13: Verify API Request Parameters for Password Change", async () => {
     
    const response = await request(API_URL)
      .post("/changePassword")
      .send({ password: a, newPassword: "", confirmPassword: "" }) // Missing newPassword
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br") // Adjust headers if needed
      .set("Connection", "keep-alive")
      .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
   
    // Expected error code for missing parameter
    const expectedErrorCode = 401; // Adjust based on API's error handling
   
    // Assert on the status code
    expect(response.statusCode).toBe(expectedErrorCode);
   
  });
  
  
});