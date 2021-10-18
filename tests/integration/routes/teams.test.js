const request = require("supertest");
const { Team } = require("../../../models/team");
const mongoose = require("mongoose");
const _ = require("lodash");

describe("/api/teams", () => {
  let server, team, teamId;

  beforeEach(async () => {
    server = require("../../../index");
    teamId = mongoose.Types.ObjectId();
    team = {
      _id: teamId,
      title: "teamTitle",
      league: mongoose.Types.ObjectId(),
      country: "country",
      coach: mongoose.Types.ObjectId(),
      players: [mongoose.Types.ObjectId()],
      avatar: "http://www.avatar.avatar",
    };

    await Team.create(team);
  });

  afterEach(async () => {
    await Team.deleteMany();
    server.close();
  });

  describe("GET /", () => {
    it("should return all of teams in db", async () => {
      const res = await request(server).get("/api/teams");

      expect(_.omit(res.body[0], ["league", "coach", "players"])).toMatchObject(
        _.omit(team, ["league", "players", "coach"])
      );
    });
  });

  describe("GET /:id", () => {
    it("should return specific team by id", async () => {
      const res = await request(server).get("/api/teams/" + teamId);

      expect(_.omit(res.body, ["league", "coach", "players"])).toMatchObject(
        _.omit(team, ["league", "players", "coach"])
      );
    });

    it("should return 404 if team not found", async () => {
      teamId = mongoose.Types.ObjectId();

      const res = await request(server).get("/api/teams/" + teamId);

      expect(res.status).toBe(404);
      expect(res.text).toContain("team");
    });

    it("should return 400 if given id is invalid", async () => {
      teamId = "invalid Id";

      const res = await request(server).get("/api/teams/" + teamId);

      expect(res.status).toBe(400);
      expect(res.text).toContain("invalid");
    });
  });

  describe("POST /", () => {
    it("should return 400 status if the title already exists", async () => {
      delete team._id;

      const res = await request(server).post("/api/teams").send(team);

      expect(res.status).toBe(400);
      expect(res.text).toContain("already");
    });

    it("should return team in body of response", async () => {
      delete team._id;
      team.title = "new team title";

      const res = await request(server).post("/api/teams").send(team);

      expect(_.omit(res.body, ["league", "coach", "players"])).toMatchObject(
        _.omit(team, ["league", "players", "coach"])
      );
    });

    it("should save the team in database", async () => {
      delete team._id;
      team.title = "new team title";

      const res = await request(server).post("/api/teams").send(team);

      const teamInDb = await Team.findById(res.body._id);

      expect(teamInDb).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    it("should return 404 status if no team found for the given id", async () => {
      delete team._id;
      teamId = mongoose.Types.ObjectId();

      const res = await request(server)
        .put("/api/teams/" + teamId)
        .send(team);

      expect(res.status).toBe(404);
      expect(res.text).toContain("team");
    });

    it("should return 400 status if given id is not valid", async () => {
      delete team._id;
      teamId = "invalidId";

      const res = await request(server)
        .put("/api/teams/" + teamId)
        .send(team);

      expect(res.status).toBe(400);
    });

    it("should return updated team in response", async () => {
      delete team._id;
      team.title = "new team title";

      const res = await request(server)
        .put("/api/teams/" + teamId)
        .send(team);

      expect(res.body.title).toBe("new team title");
    });

    it("should save the new team in database", async () => {
      delete team._id;
      team.title = "new team title";

      await request(server)
        .put("/api/teams/" + teamId)
        .send(team);

      const teamInDb = await Team.findById(teamId);

      expect(teamInDb.title).toBe(team.title);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 400 status if given id is invalid", async () => {
      teamId = "invalid id";

      const res = await request(server).delete("/api/teams/" + teamId);

      expect(res.status).toBe(400);
      expect(res.text).toContain("invalid");
    });

    it("should return 404 status if no team found", async () => {
      teamId = mongoose.Types.ObjectId();

      const res = await request(server).delete("/api/teams/" + teamId);

      expect(res.status).toBe(404);
      expect(res.text).toContain("team");
    });

    it("should return deleted team in response", async () => {
      const res = await request(server).delete("/api/teams/" + teamId);

      expect(_.omit(res.body, ["league", "coach", "players"])).toMatchObject(
        _.omit(team, ["league", "players", "coach"])
      );
    });

    it("should delete the team from data base", async () => {
      const res = await request(server).delete("/api/teams/" + teamId);

      const teamInDb = await Team.findById(teamId);

      expect(teamInDb).toBeNull();
    });
  });
});
