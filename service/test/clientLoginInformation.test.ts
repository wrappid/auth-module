// Functional Testing:

// TC01: Verify Login Information Retrieval with Valid Credentials: Send a request with valid authorization credentials (e.g., access token). The API should respond with a success code (e.g., 200 OK) and the requested client login information.
// TC02: Verify Login Information Retrieval with Invalid Credentials: Send a request with invalid authorization credentials. The API should respond with an error code indicating unauthorized access.
// TC03: Verify Login Information Retrieval with Missing Credentials: Send a request without any authorization credentials. The API should respond with an error code indicating missing credentials.
// TC04: Verify Login Information Retrieval for Non-Existent Client: Send a request with credentials for a non-existent client. The API should respond with an error code indicating the client is not found.
// TC05: Verify Login Information Retrieval with Inactive Client: Send a request with credentials for an inactive client (if applicable). The API should respond with an error code indicating the client account is inactive.
// TC06: Verify Login Information Response Fields: Ensure the response includes the expected information about the client's login credentials or account details (e.g., username, email, ID).
// Technical Testing:

// TC07: Verify API Request Method: Ensure the request to retrieve client login information uses the correct method (e.g., GET).
// TC08: Verify API Endpoint URL: This confirms the documented URL for the "clientLoginInformation" endpoint is correct and functional.
// TC09: Verify API Response Status Code: Validate the response status code for successful information retrieval (e.g., 200 OK) and various error scenarios (e.g., 401 Unauthorized for invalid credentials).
// TC10: Verify API Response Format: Ensure the response format matches the documented format (e.g., JSON or XML).
// TC11: Verify API Response Headers: This checks for the presence and correctness of essential response headers (e.g., Content-Type).
// TC12: Verify API Response Time: Measure the response time for retrieving client login information and ensure it falls within acceptable performance limits.
// TC13: Verify API Handles Malformed Requests: Test if the API can handle malformed requests (e.g., invalid JSON syntax in the authorization header).
// TC14: Verify API Response Payload Size: Ensure the response size from the "clientLoginInformation" endpoint is within expected limits.
// Security Testing:

// TC15: Verify Secure Communication (HTTPS): Ensure the endpoint uses HTTPS for secure communication when transmitting client login information.
import { describe, test, expect } from "@jest/globals";
import request from "supertest";

const API_URL = "https://demoapi.wrappid.dev";
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
let token = "";


beforeAll (async () => {
  const response = await request(API_URL)
    .post("/login")
    .send({ emailOrPhone: "animesh@rxefy.com", password: "Pritam@rxefy123" })
    .set("Content-Type", "application/json")
    .set("Accept-Encoding", "gzip, deflate, br")
    .set("Connection", "keep-alive")
    .set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36");
  token = response.body.accessToken;
});

describe("clientLoginInformation", () => {
  test("TC01 Verify Login Information Retrieval with Valid Credentials", async () => {
    const validAccessToken = token; // Replace with a valid access token
    // eslint-disable-next-line no-unused-vars
    const userId = "433";
  
    const response = await request(API_URL)
      .get("/clientLoginInformation")
      .set("Authorization", `Bearer ${validAccessToken}`) // Set with the valid access token
      .set("Content-Type", "application/json")
      .set("Accept-Encoding", "gzip, deflate, br")
      .set("Connection", "keep-alive");
  
    expect(response.statusCode).toBe(200); // Expect a 200 OK status code
    expect(response.body).toHaveProperty("clientLoginInformation"); // Expect a property containing login information
    // Add more specific assertions based on your API's response structure
  });
});