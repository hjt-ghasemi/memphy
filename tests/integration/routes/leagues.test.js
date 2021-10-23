const request = require("supertest");
const { League } = require("../../../models/league");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("/api/leagues", () => {
  let server, league, leagueId, token;

  beforeEach(async () => {
    server = require("../../../index");
    leagueId = mongoose.Types.ObjectId();

    league = await League.create({ _id: leagueId, title: "league1" });

    const userB = await User.create({
      email: "userB@gmail.com",
      username: "userB",
      password: "userB1password",
      type: "B",
    });

    token = userB.generateJWT();
  });

  afterEach(async () => {
    await League.deleteMany();
    await User.deleteMany();
    await server.close();
  });

  describe("GET /", () => {
    it("should return array of leagues", async () => {
      const res = await request(server)
        .get("/api/leagues")
        .set("x-auth-token", token);

      expect(res.body[0]._id).toBe(league._id.toHexString());
    });
  });

  describe("POST /", () => {
    const newLeague = { title: "newLeagueTitle" };

    it("should return saved league", async () => {
      const res = await request(server)
        .post("/api/leagues")
        .set("x-auth-token", token)
        .send(newLeague);

      expect(res.body).toMatchObject(newLeague);
    });

    it("should save league in db", async () => {
      const res = await request(server)
        .post("/api/leagues")
        .set("x-auth-token", token)
        .send(newLeague);

      const result = await League.findById(res.body._id);

      expect(result).not.toBeNull();
    });
  });

  describe("DELETE /:id", () => {
    it("should return 404 if league not found", async () => {
      const leagueId = mongoose.Types.ObjectId();
      const res = await request(server)
        .delete("/api/leagues/" + leagueId)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("should return 400 if given id is invalid", async () => {
      leagueId = "invalidId";
      const res = await request(server)
        .delete("/api/leagues/" + leagueId)
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
    });

    it("should return deleted league", async () => {
      const res = await request(server)
        .delete("/api/leagues/" + leagueId)
        .set("x-auth-token", token);

      expect(res.body._id).toBe(leagueId.toHexString());
    });

    it("should delete league from database", async () => {
      const res = await request(server)
        .delete("/api/leagues/" + leagueId)
        .set("x-auth-token", token);

      const leagueInDb = await League.findById(leagueId);

      expect(leagueInDb).toBeNull();
    });
  });

  describe("PUT /:id", () => {
    const updatedLeague = { title: "updatedTitle" };

    it("should return 404 if league not found", async () => {
      leagueId = mongoose.Types.ObjectId();

      const res = await request(server)
        .put("/api/leagues/" + leagueId)
        .set("x-auth-token", token)
        .send(updatedLeague);

      expect(res.status).toBe(404);
    });

    it("should return 400 if given id is invalid", async () => {
      leagueId = "invalidId";
      const res = await request(server)
        .put("/api/leagues/" + leagueId)
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
    });

    it("should return updated league", async () => {
      const res = await request(server)
        .put("/api/leagues/" + leagueId)
        .set("x-auth-token", token)
        .send(updatedLeague);

      expect(res.body.title).toBe("updatedTitle");
    });
  });
});
