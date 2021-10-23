const { League } = require("../../../models/league");
const request = require("supertest");
const { User } = require("../../../models/user");

describe("data validation on /api/leagues", () => {
  let server, title, token;

  beforeEach(async () => {
    server = require("../../../index");
    title = "league1";
    const userB = await User.create({
      email: "userB@gmail.com",
      username: "userB",
      password: "userB1password",
      type: "B",
    });

    token = userB.generateJWT();
  });

  afterEach(async () => {
    await User.deleteMany();
    server.close();
  });

  function exec() {
    return request(server)
      .post("/api/leagues")
      .set("x-auth-token", token)
      .send({ title });
  }

  it("should return 400 status if title is not set", async () => {
    title = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if title is less than 5 characters", async () => {
    title = "1234";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if title is more than 50 characters", async () => {
    title = title.padEnd(51, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if title does not match this pattern [a-zA-Z0-9]", async () => {
    title = "?//league";

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
