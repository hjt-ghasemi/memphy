const request = require("supertest");
const { User } = require("../../../models/user");

describe("Testing permission middleware on routes", () => {
  let server, token, userA, userB, userC;

  beforeEach(async () => {
    server = require("../../../index");

    userA = await User.create({
      email: "userA@email.com",
      username: "userA",
      password: "Password1",
      type: "A",
    });
    userB = await User.create({
      email: "userB@email.com",
      username: "userB",
      password: "Password1",
      type: "B",
    });
    userC = await User.create({
      email: "userC@email.com",
      username: "userC",
      password: "Password1",
      type: "C",
    });
  });

  afterEach(async () => {
    await User.deleteMany();
    await server.close();
  });

  describe('route with "C" type', () => {
    it("should return 401 status if no token provided", async () => {
      const res = await request(server).get("/api/users/me");

      expect(res.status).toBe(401);
    });

    it("should return 400 status if token is invalid", async () => {
      token = "invalidToken";

      const res = await request(server)
        .get("/api/users/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
      expect(res.text).toContain("token");
    });

    it("should return 200 status if token type C is provided", async () => {
      token = userC.generateJWT();

      const res = await request(server)
        .get("/api/users/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });

    it("should return 200 status if token type B is provided", async () => {
      token = userB.generateJWT();

      const res = await request(server)
        .get("/api/users/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });

    it("should return 200 status if token type A is provided", async () => {
      token = userA.generateJWT();

      const res = await request(server)
        .get("/api/users/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });
  });

  describe('route with "B" type', () => {
    it("should return 401 status if no token provided", async () => {
      const res = await request(server).get("/api/players");

      expect(res.status).toBe(401);
    });

    it("should return 400 status if token is invalid", async () => {
      token = "invalidToken";

      const res = await request(server)
        .get("/api/players")
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
      expect(res.text).toContain("token");
    });

    it("should return 403 status if token type C is provided", async () => {
      token = userC.generateJWT();

      const res = await request(server)
        .get("/api/players")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 200 status if token type B is provided", async () => {
      token = userB.generateJWT();

      const res = await request(server)
        .get("/api/players")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });

    it("should return 200 status if token type A is provided", async () => {
      token = userA.generateJWT();

      const res = await request(server)
        .get("/api/players")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });
  });

  describe('route with "A" type', () => {
    it("should return 401 status if no token provided", async () => {
      const res = await request(server).get("/api/users");

      expect(res.status).toBe(401);
    });

    it("should return 400 status if token is invalid", async () => {
      token = "invalidToken";

      const res = await request(server)
        .get("/api/users")
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
      expect(res.text).toContain("token");
    });

    it("should return 403 status if token type C is provided", async () => {
      token = userC.generateJWT();

      const res = await request(server)
        .get("/api/users")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 403 status if token type B is provided", async () => {
      token = userB.generateJWT();

      const res = await request(server)
        .get("/api/users")
        .set("x-auth-token", token);

      expect(res.status).toBe(403);
    });

    it("should return 200 status if token type A is provided", async () => {
      token = userA.generateJWT();

      const res = await request(server)
        .get("/api/users")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });
  });
});
