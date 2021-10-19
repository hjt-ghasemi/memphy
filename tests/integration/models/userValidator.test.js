const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../../models/user");

let server;

describe("data validation on /api/users", () => {
  let user;

  beforeEach(() => {
    server = require("../../../index");
    userId = mongoose.Types.ObjectId();
    user = {
      email: "user@gmail.com",
      username: "user1",
      password: "Validpassword1",
    };
  });

  afterEach(async () => {
    server.close();
    await User.deleteMany();
  });

  function exec() {
    return request(server).post("/api/users").send(user);
  }

  it("should return 400 status if email is not set", async () => {
    user.email = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if email is not valid", async () => {
    user.email = "invalidEmail";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if email is more than 250 characters", async () => {
    user.email = user.email.padEnd(251, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if username is not set", async () => {
    user.username = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if username is more than 100 characters", async () => {
    user.username = user.username.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if password is not set", async () => {
    user.password = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is more than 100 characters", async () => {
    user.password = user.password.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is less than 8 characters", async () => {
    user.password = "1234567";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password does not have atleast 1 lowercase", async () => {
    user.password = "INVALIDPASSWORD1";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password does not have atleast 1 uppercase", async () => {
    user.password = "invalidpassword1";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password does not have atleast 1 numeric character", async () => {
    user.password = "InvalidPassword";

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
