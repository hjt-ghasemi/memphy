const request = require("supertest");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");

describe("/api/users", () => {
  let server, user, userId, token;

  beforeEach(async () => {
    server = require("../../../index");
    userId = mongoose.Types.ObjectId();
    user = {
      _id: userId,
      email: "email@gmail.com",
      username: "username",
      password: "ValidPassword1",
    };

    await User.create(user);

    userA = await User.create({
      email: "userAemail@gmail.com",
      username: "userA",
      password: "ValidPassword1",
      type: "A",
    });

    token = userA.generateJWT();
  });

  afterEach(async () => {
    await User.deleteMany();
    server.close();
  });

  describe("GET /", () => {
    it("should return all of users in db", async () => {
      const res = await request(server)
        .get("/api/users")
        .set("x-auth-token", token);

      expect(res.body[0].email).toBe(user.email);
      expect(res.body[0].username).toBe(user.username);
    });

    it("should not send password in users object", async () => {
      const res = await request(server)
        .get("/api/users")
        .set("x-auth-token", token);

      expect(res.body[0].password).toBeUndefined();
    });
  });

  describe("GET /:id", () => {
    it("should return specific user by id", async () => {
      const res = await request(server)
        .get("/api/users/" + userId)
        .set("x-auth-token", token);

      expect(res.body.email).toBe(user.email);
      expect(res.body.username).toBe(user.username);
    });

    it("should not send user password in response", async () => {
      const res = await request(server)
        .get("/api/users/" + userId)
        .set("x-auth-token", token);

      expect(res.body.password).toBeUndefined();
    });

    it("should return 404 if user not found", async () => {
      userId = mongoose.Types.ObjectId();

      const res = await request(server)
        .get("/api/users/" + userId)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.text).toContain("not found");
    });

    it("should return 400 if given id is invalid", async () => {
      userId = "invalid Id";

      const res = await request(server)
        .get("/api/users/" + userId)
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
      expect(res.text).toContain("invalid");
    });
  });

  describe("POST /", () => {
    it("should return user in body of response", async () => {
      delete user._id;
      user.email = "newEmail@gmail.com";
      user.username = "newUsername";

      const res = await request(server).post("/api/users").send(user);

      expect(res.body.email).toBe(user.email);
      expect(res.body.username).toBe(user.username);
    });

    it("should save the user in database", async () => {
      delete user._id;
      user.email = "newEmail@gmail.com";
      user.username = "newUsername";

      const res = await request(server).post("/api/users").send(user);

      const userInDb = await User.findById(res.body._id);

      expect(userInDb).not.toBeNull();
    });

    it("should return 400 status if email is repetitive", async () => {
      delete user._id;
      user.username = "newUsername";

      const res = await request(server).post("/api/users").send(user);

      expect(res.status).toBe(400);
      expect(res.text).toContain("already");
    });

    it("should return 400 status if username is repetitive", async () => {
      delete user._id;
      user.email = "newEmail@gmail.com";

      const res = await request(server).post("/api/users").send(user);

      expect(res.status).toBe(400);
      expect(res.text).toContain("already");
    });

    it("should return token in header 'x-auth-token'", async () => {
      delete user._id;
      user.email = "newEmail@gmail.com";
      user.username = "newUsername";

      const res = await request(server).post("/api/users").send(user);

      expect(res.headers["x-auth-token"]).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    it("should return 404 status if no user found for the given id", async () => {
      delete user._id;
      userId = mongoose.Types.ObjectId();

      const res = await request(server)
        .put("/api/users/" + userId)
        .set("x-auth-token", token)
        .send(user);

      expect(res.status).toBe(404);
      expect(res.text).toContain("not found");
    });

    it("should return 400 status if given id is not valid", async () => {
      delete user._id;
      userId = "invalidId";

      const res = await request(server)
        .put("/api/users/" + userId)
        .set("x-auth-token", token)
        .send(user);

      expect(res.status).toBe(400);
    });

    it("should return updated user in response", async () => {
      delete user._id;
      user.email = "newemail@gmail.com";

      const res = await request(server)
        .put("/api/users/" + userId)
        .set("x-auth-token", token)
        .send(user);

      expect(res.body.email).toBe(user.email);
      expect(res.body.username).toBe(user.username);
    });

    it("should not return password in response", async () => {
      delete user._id;
      user.email = "newemail@gmail.com";

      const res = await request(server)
        .put("/api/users/" + userId)
        .set("x-auth-token", token)
        .send(user);

      expect(res.body.password).toBeUndefined();
    });

    it("should save the new user in database", async () => {
      delete user._id;
      user.email = "newemail@gmail.com";
      user.username = "newUsername";
      user.password = "newUserpassword1";

      await request(server)
        .put("/api/users/" + userId)
        .set("x-auth-token", token)
        .send(user);

      const userInDb = await User.findById(userId);

      const isSamePassword = await bcrypt.compare(
        user.password,
        userInDb.password
      );

      expect(userInDb.email).toBe(user.email);
      expect(userInDb.username).toBe(user.username);
      expect(isSamePassword).toBe(true);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 400 status if given id is invalid", async () => {
      userId = "invalid id";

      const res = await request(server)
        .delete("/api/users/" + userId)
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
      expect(res.text).toContain("invalid");
    });

    it("should return 404 status if no user found", async () => {
      userId = mongoose.Types.ObjectId();

      const res = await request(server)
        .delete("/api/users/" + userId)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.text).toContain("not found");
    });

    it("should return deleted user in response", async () => {
      const res = await request(server)
        .delete("/api/users/" + userId)
        .set("x-auth-token", token);

      expect(res.body._id).toBe(userId.toHexString());
    });

    it("should delete the user from data base", async () => {
      await request(server)
        .delete("/api/users/" + userId)
        .set("x-auth-token", token);

      const userInDb = await User.findById(userId);

      expect(userInDb).toBeNull();
    });
  });

  describe("GET /me", () => {
    it("should return current user information if token is provided", async () => {
      const res = await request(server)
        .get("/api/users/me")
        .set("x-auth-token", token);

      expect(res.body._id).toBe(userA._id.toHexString());
    });
  });
});
