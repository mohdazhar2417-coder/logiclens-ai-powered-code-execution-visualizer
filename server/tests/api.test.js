import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret";
delete process.env.MONGO_URI;

const { createApp } = await import("../app.js");
const app = createApp();

test("auth signup, login, and me work in demo mode", async () => {
  const signupResponse = await request(app).post("/api/auth/signup").send({
    name: "Test Learner",
    email: "learner@example.com",
    password: "Password123!",
  });

  assert.equal(signupResponse.status, 201);
  assert.ok(signupResponse.body.token);
  assert.equal(signupResponse.body.user.role, "student");

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "learner@example.com",
    password: "Password123!",
  });

  assert.equal(loginResponse.status, 200);
  assert.ok(loginResponse.body.token);

  const meResponse = await request(app)
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${loginResponse.body.token}`);

  assert.equal(meResponse.status, 200);
  assert.equal(meResponse.body.user.email, "learner@example.com");
});

test("explain endpoint returns real trace structure", async () => {
  const response = await request(app).post("/api/explain").send({
    code: `public class Main {
      public static void main(String[] args) {
        int n = 3;
        int sum = 0;
        for (int i = 1; i <= n; i++) {
          sum = sum + i;
        }
        System.out.println(sum);
      }
    }`,
    customInputs: { n: 3 },
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.detection.supportLevel, "full");
  assert.ok(Array.isArray(response.body.steps));
  assert.ok(response.body.steps.length > 0);
  assert.ok(Array.isArray(response.body.nodes));
  assert.ok(Array.isArray(response.body.edges));
  assert.equal(response.body.finalOutput, "6");
});

test("validation rejects incomplete login requests", async () => {
  const response = await request(app).post("/api/auth/login").send({
    email: "",
  });

  assert.equal(response.status, 400);
});
