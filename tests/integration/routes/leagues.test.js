const request = require("supertest");
const { League } = require("../../../models/league");
const mongoose = require("mongoose");

describe("/api/leagues", () => {
  let server;
  let leagueId;
  beforeEach(async () => {
    leagueId = mongoose.Types.ObjectId();
    server = require("../../../index");
    await League.insertMany([
      { _id: leagueId, title: "league1" },
      { title: "league2" },
    ]);
  });

  afterEach(async () => {
    await server.close();
    await League.remove({});
  });

  describe("GET /", () => {
    it("should return array of leagues", async () => {
      const res = await request(server).get("/api/leagues");

      expect(res.body[0].title).toBe("league1");
      expect(res.body[1].title).toBe("league2");
    });
  });

  describe("POST /", () => {
    it("should return saved league", async () => {
      const league = { title: "newLeague" };
      const res = await request(server).post("/api/leagues").send(league);

      expect(res.body.title).toBe("newLeague");
    });

    it("should save league in db", async () => {
      const league = { title: "newLeague" };
      const res = await request(server).post("/api/leagues").send(league);

      const result = await League.findOne({ title: "newLeague" });

      expect(result).not.toBeNull();
    });

    it("should return 400 status if title is less than 5 characters", async () => {
      const league = { title: "1234" };
      const res = await request(server).post("/api/leagues").send(league);

      expect(res.status).toBe(400);
    });

    it("should return 400 if league title already exists", async () => {
      const res = await request(server)
        .post("/api/leagues")
        .send({ title: "league1" });

      expect(res.status).toBe(400);
      expect(res.text).toContain("already");
    });
  });

  describe("DELETE /:id", () => {
    it("should return deleted league", async () => {
      const res = await request(server).delete("/api/leagues/" + leagueId);

      expect(res.body._id).toBe(leagueId.toHexString());
    });

    it("should return 404 if league not found", async () => {
      const leagueId = mongoose.Types.ObjectId();
      const res = await request(server).delete("/api/leagues/" + leagueId);

      expect(res.status).toBe(404);
    });

    it("should return 400 if given id is invalid", async () => {
      leagueId = "invalidId";
      const res = await request(server).delete("/api/leagues/" + leagueId);

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /:id", () => {
    it("should return 404 if league not found", async () => {
      leagueId = mongoose.Types.ObjectId();
      const res = await request(server)
        .put("/api/leagues/" + leagueId)
        .send({ title: "updatedLeague" });

      expect(res.status).toBe(404);
    });

    it("should return 400 if given id is invalid", async () => {
      leagueId = "invalidId";
      const res = await request(server).put("/api/leagues/" + leagueId);

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is less than 5 characters", async () => {
      const res = await request(server)
        .put("/api/leagues/" + leagueId)
        .send({ title: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if title is more than 50 characters", async () => {
      const res = await request(server)
        .put("/api/leagues/" + leagueId)
        .send({ title: "a".padEnd(51, "a") });

      expect(res.status).toBe(400);
    });

    it("should return updated league with 200 status", async () => {
      const res = await request(server)
        .put("/api/leagues/" + leagueId)
        .send({ title: "updatedLeague" });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("updatedLeague");
    });
  });
});
