const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../../models/user");

describe("data validation on /api/coachs", () => {
  let server, token;

  const tokenA = new User({
    type: "A",
  }).generateJWT();

  const tokenB = new User({
    type: "B",
  }).generateJWT();

  const tokenC = new User({ type: "C" }).generateJWT();

  let coach;
  beforeEach(() => {
    server = require("../../../index");
    coach = {
      name: "coachName",
      lname: "coachLname",
      team: { _id: mongoose.Types.ObjectId(), name: "teamName" },
      age: 50,
      avatar: "https://google.com",
    };
  });
  afterEach(() => {
    server.close();
  });

  function exec() {
    return request(server)
      .post("/api/coachs")
      .set("x-auth-token", token)
      .send(coach);
  }

  it("should return 400 status if name is not set", async () => {
    coach.name = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname is not set", async () => {
    coach.lname = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if name is more than 100 characters", async () => {
    coach.name = coach.name.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname is more than 100 characters", async () => {
    coach.lname = coach.lname.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if name doesnt follow this pattern /[a-zA-z]", async () => {
    coach.name = "12345";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname doesnt follow this pattern /[a-zA-z]", async () => {
    coach.lname = "12345";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if team _id is not valid ID", async () => {
    coach.team._id = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if team name is more than 100 characters", async () => {
    coach.team.name = coach.team.name.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if age is lower than 10", async () => {
    coach.age = 9;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if age is more than 120", async () => {
    coach.age = 121;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if avatar uri is more than 1000 characters", async () => {
    coach.avatar = coach.avatar.padEnd(1001, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
