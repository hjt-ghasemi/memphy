const mongoose = require("mongoose");
const request = require("supertest");
const { Team } = require("../../../models/team");
const { User } = require("../../../models/user");

describe("data validation on /api/teams", () => {
  let server, team, token;

  beforeEach(async () => {
    server = require("../../../index");

    team = {
      title: "teamTitle",
      league: mongoose.Types.ObjectId(),
      country: "country",
      coach: mongoose.Types.ObjectId(),
      players: [mongoose.Types.ObjectId()],
      avatar: "http://www.avatar.avatar",
    };

    const userB = await User.create({
      email: "userB@gmail.com",
      username: "userB",
      password: "userB1password",
      type: "B",
    });

    token = userB.generateJWT();
  });

  afterEach(async () => {
    await Team.deleteMany();
    await User.deleteMany();
    server.close();
  });

  function exec() {
    return request(server)
      .post("/api/teams")
      .set("x-auth-token", token)
      .send(team);
  }

  it("should return 400 status if title is not set", async () => {
    team.title = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if title is more than 100 characters", async () => {
    team.title = team.title.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if title does not follow this pattern [a-zA-Z0-9]", async () => {
    team.title = "#(@*&$*(#&(*@#";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if league is not objectId type", async () => {
    team.league = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if country is more than 100 characters", async () => {
    team.country = team.country.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if coach is not objectId type", async () => {
    team.coach = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if palyer array items are not objectId type", async () => {
    team.players[0] = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if avatar url is more than 1000 character", async () => {
    team.avatar = team.avatar.padEnd(1001, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if avatar is not url", async () => {
    team.avatar = "invalid url";

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
