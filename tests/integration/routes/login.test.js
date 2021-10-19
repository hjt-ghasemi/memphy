const request = require("supertest");
const { User } = require("../../../models/user");

describe("/api/login", () => {
  let server, user;

  beforeEach(async () => {
    server = require("../../../index");
    user = {
      email: "email@gmail.com",
      username: "username",
      password: "myPassword1",
    };

    await User.create(user);
  });

  afterEach(async () => {
    await User.deleteMany();
    await server.close();
  });

  describe("POST /", () => {
    it("should return 400 status if no user registerd for the given email and username", async () => {
      user.email = "anotheremail@gmail.com";

      const res = await request(server).post("/api/login").send(user);

      expect(res.status).toBe(400);
    });

    it("should return 400 status if password is wrong", async () => {
      user.password = "invalidPassword1";

      const res = await request(server).post("/api/login").send(user);

      expect(res.status).toBe(400);
    });

    it("should return token in response", async () => {
      const res = await request(server).post("/api/login").send(user);

      expect(res.body.token).not.toBeNull();
    });
  });
});
