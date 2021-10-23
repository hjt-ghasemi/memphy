const request = require("supertest");
const { Player } = require("../../../models/player");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const _ = require("lodash");

describe("/api/players", () => {
  let server, player, playerId, token;

  beforeEach(async () => {
    server = require("../../../index");
    playerId = mongoose.Types.ObjectId();
    player = {
      _id: playerId,
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
    await Player.create(player);

    const userB = await User.create({
      email: "userB@gmail.com",
      username: "userB",
      password: "userB1password",
      type: "B",
    });

    token = userB.generateJWT();
  });

  afterEach(async () => {
    await Player.deleteMany();
    await User.deleteMany();
    server.close();
  });

  describe("GET /", () => {
    it("should return all of players in db", async () => {
      const res = await request(server)
        .get("/api/players")
        .set("x-auth-token", token);

      expect(_.omit(res.body[0], "birthdate")).toMatchObject(
        _.omit(player, "birthdate")
      );
    });
  });

  describe("GET /:id", () => {
    it("should return specific player by id", async () => {
      const res = await request(server)
        .get("/api/players/" + playerId)
        .set("x-auth-token", token);

      expect(_.omit(res.body, "birthdate")).toMatchObject(
        _.omit(player, "birthdate")
      );
    });

    it("should return 404 if player not found", async () => {
      playerId = mongoose.Types.ObjectId();

      const res = await request(server)
        .get("/api/players/" + playerId)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.text).toContain("not found");
    });

    it("should return 400 if given id is invalid", async () => {
      playerId = "invalid Id";

      const res = await request(server)
        .get("/api/players/" + playerId)
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
      expect(res.text).toContain("invalid");
    });
  });

  describe("POST /", () => {
    it("should return player in body of response", async () => {
      delete player._id;
      player.name = "new player name";
      player.lname = "new player lname";

      const res = await request(server)
        .post("/api/players")
        .set("x-auth-token", token)
        .send(player);

      expect(_.omit(res.body, "birthdate")).toMatchObject(
        _.omit(player, "birthdate")
      );
    });

    it("should save the player in database", async () => {
      delete player._id;
      player.name = "new player name";
      player.lname = "new player lname";

      const res = await request(server)
        .post("/api/players")
        .set("x-auth-token", token)
        .send(player);

      const playerInDb = await Player.findById(res.body._id);

      expect(playerInDb).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    it("should return 404 status if no player found for the given id", async () => {
      delete player._id;
      playerId = mongoose.Types.ObjectId();

      const res = await request(server)
        .put("/api/players/" + playerId)
        .set("x-auth-token", token)
        .send(player);

      expect(res.status).toBe(404);
      expect(res.text).toContain("not found");
    });

    it("should return 400 status if given id is not valid", async () => {
      delete player._id;
      playerId = "invalidId";

      const res = await request(server)
        .put("/api/players/" + playerId)
        .set("x-auth-token", token)
        .send(player);

      expect(res.status).toBe(400);
    });

    it("should return updated player in response", async () => {
      delete player._id;
      player.name = "new player name";
      player.lname = "new player lname";

      const res = await request(server)
        .put("/api/players/" + playerId)
        .set("x-auth-token", token)
        .send(player);

      expect(_.omit(res.body, "birthdate")).toMatchObject(
        _.omit(player, "birthdate")
      );
    });

    it("should save the new player in database", async () => {
      delete player._id;
      player.name = "new player name";
      player.lname = "new player lname";

      await request(server)
        .put("/api/players/" + playerId)
        .set("x-auth-token", token)
        .send(player);

      const playerInDb = await Player.findById(playerId);

      expect(playerInDb.name).toBe(player.name);
      expect(playerInDb.lname).toBe(player.lname);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 400 status if given id is invalid", async () => {
      playerId = "invalid id";

      const res = await request(server)
        .delete("/api/players/" + playerId)
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
      expect(res.text).toContain("invalid");
    });

    it("should return 404 status if no player found", async () => {
      playerId = mongoose.Types.ObjectId();

      const res = await request(server)
        .delete("/api/players/" + playerId)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.text).toContain("not found");
    });

    it("should return deleted player in response", async () => {
      const res = await request(server)
        .delete("/api/players/" + playerId)
        .set("x-auth-token", token);

      expect(_.omit(res.body, "birthdate")).toMatchObject(
        _.omit(player, "birthdate")
      );
    });

    it("should delete the player from data base", async () => {
      await request(server)
        .delete("/api/players/" + playerId)
        .set("x-auth-token", token);

      const playerInDb = await Player.findById(playerId);

      expect(playerInDb).toBeNull();
    });
  });
});
