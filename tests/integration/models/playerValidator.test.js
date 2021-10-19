const mongoose = require("mongoose");
const request = require("supertest");
const { Player } = require("../../../models/player");

let server;

describe("data validation on /api/players", () => {
  let playerId, player;

  beforeEach(() => {
    server = require("../../../index");

    player = {
      name: "playerName",
      lname: "playerLname",
      country: "country",
      team: mongoose.Types.ObjectId(),
      previousTeam: mongoose.Types.ObjectId(),
      birthdate: new Date("2000"),
      avatar: "http://www.avatar.avatar",
      height: 180,
      weight: 80,
      cost: 20000000,
    };
  });

  afterEach(async () => {
    server.close();
    await Player.deleteMany();
  });

  function exec() {
    return request(server).post("/api/players").send(player);
  }

  it("should return 400 status if name is not set", async () => {
    player.name = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname is not set", async () => {
    player.lname = undefined;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if name is more than 100 characters", async () => {
    player.name = player.name.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if name does not follow this pattern [a-zA-Z]", async () => {
    player.name = "#(@*&$*(#&(2342";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname is more than 100 characters", async () => {
    player.lname = player.lname.padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 status if lname does not follow this pattern [a-zA-Z]", async () => {
    player.lname = "#(@*&$*(#&(2342";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if team is not objectId type", async () => {
    player.team = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if previousTeam is not objectId type", async () => {
    player.previousTeam = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if birthdate is not date", async () => {
    player.birthdate = "string";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if birthdate is more than 1-1-2015", async () => {
    player.birthdate = new Date("2-1-2015");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if birthdate is less than 1-1-1940", async () => {
    player.birthdate = new Date("12-12-1939");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if coach is not objectId type", async () => {
    player.coach = "invalidId";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if height is not a number", async () => {
    player.height = "string";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if height is more than 230", async () => {
    player.height = 231;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if height is less than 140", async () => {
    player.height = 139;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if weight is not a number", async () => {
    player.weight = "string";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if weight is more than 160", async () => {
    player.weight = 161;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if weight is less than 40", async () => {
    player.weight = 39;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if avatar url is more than 1000 character", async () => {
    player.avatar = player.avatar.padEnd(1001, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if avatar is not url", async () => {
    player.avatar = "invalid url";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if country dose not follow this pattern [a-zA-Z]", async () => {
    player.country = "123)(*&%*#&";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if country is more than 100 characters", async () => {
    player.country = "a".padEnd(101, "a");

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if cost is not a number", async () => {
    player.cost = "string";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if cost is negative", async () => {
    player.cost = -12;

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if cost is more than 1000000000", async () => {
    player.cost = 1000000001;

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
