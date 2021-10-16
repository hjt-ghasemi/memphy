const mongoose = require("mongoose");
const request = require("supertest");

let server;

describe("data validation on /api/coachs", () => {
  let name, lname, team, age, avatar;
  beforeEach(() => {
    server = require("../../../index");
    name = "coachName";
    lname = "coachLname";
    team = { _id: mongoose.Types.ObjectId(), name: "teamName" };
    age = 50;
    avatar = "https://google.com";
  });
  afterEach(() => {
    server.close();
  });

  function exec() {
    return request(server)
      .post("/api/coachs")
      .send({ name, lname, team, age, avatar });
  }

  it("should return 400 status if name is not set", async () => {
    name = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname is not set", async () => {
    lname = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if name is more than 100 characters", async () => {
    name = name.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname is more than 100 characters", async () => {
    lname = lname.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if name doesnt follow this pattern /[a-zA-z]", async () => {
    name = "12345";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname doesnt follow this pattern /[a-zA-z]", async () => {
    lname = "12345";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if team _id is not valid ID", async () => {
    team._id = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if team name is more than 100 characters", async ()=>{
    team.name = team.name.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  })

  it("should return 400 status if age is lower than 10", async()=>{
    age = 9;

    const res = await exec();

    expect(res.status).toBe(400);
  })

   it("should return 400 status if age is more than 120", async()=>{
    age = 121;

    const res = await exec();

    expect(res.status).toBe(400);
  })

  it("should return 400 status if avatar uri is more than 1000 characters", async () => {
    avatar = avatar.padEnd(1001, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  })
});
