const request = require("supertest");
const mongoose = require("mongoose");
const { Coach } = require("../../../models/coach");
const { User } = require("../../../models/user");

describe("/api/coachs", () => {
  let server, coach, coachId, token;

  beforeEach(async () => {
    coachId = mongoose.Types.ObjectId();
    server = require("../../../index");
    coach = await Coach.create({
      _id: coachId,
      name: "coachName",
      lname: "coachLname",
      age: 43,
      avatar:
        "https://i.guim.co.uk/img/media/939511832ce304130da85e4210638add046a5c04/0_219_4938_2963/master/4938.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=c1f390057cf2b8f6741f8bfa86798b92",
      team: { name: "teamName" },
    });

    const userB = await User.create({
      email: "userB@gmail.com",
      username: "userB",
      password: "userB1password",
      type: "B",
    });

    token = userB.generateJWT();
  });

  afterEach(async () => {
    await Coach.deleteMany();
    await User.deleteMany();
    server.close();
  });

  describe("GET /", () => {
    it("should return all of coachs", async () => {
      const res = await request(server)
        .get("/api/coachs")
        .set("x-auth-token", token);

      expect(res.body).not.toBeNull();
      expect(res.body[0]._id).toBe(coachId.toHexString());
    });
  });

  describe("GET /:id", () => {
    it("should return 404 if coach not found", async () => {
      const randomId = mongoose.Types.ObjectId();

      const res = await request(server)
        .get("/api/coachs/" + randomId)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });

    it("should return 400 if given id is invalid", async () => {
      const invalidId = "invalidId";

      const res = await request(server)
        .get("/api/coachs/" + invalidId)
        .set("x-auth-token", token);

      expect(res.status).toBe(400);
    });

    it("should return exact coach by the given id", async () => {
      const res = await request(server)
        .get("/api/coachs/" + coachId)
        .set("x-auth-token", token);

      expect(res.body._id).toBe(coachId.toHexString());
    });
  });

  describe("POST /", () => {
    it("should return coach in response", async () => {
      const newCoach = {
        name: "newCoachName",
        lname: "newCoachLname",
        age: 50,
        avatar: "https:/bla.bla",
        team: {
          name: "newTeamName",
        },
      };

      const res = await request(server)
        .post("/api/coachs")
        .set("x-auth-token", token)
        .send(newCoach);

      expect(res.body).toMatchObject(newCoach);
    });

    it("should save coach in database", async () => {
      const newCoach = {
        name: "newCoachName",
        lname: "newCoachLname",
        age: 50,
        avatar: "https:/bla.bla",
        team: {
          name: "newTeamName",
        },
      };

      await request(server)
        .post("/api/coachs")
        .set("x-auth-token", token)
        .send(newCoach);

      const coachInDb = await Coach.findOne({ name: "newCoachName" });

      expect(coachInDb).toMatchObject(newCoach);
    });
  });

  describe("PUT /:id", () => {
    let updatedCoach = {
      name: "newCoachName",
      lname: "newCoachLname",
      age: 70,
      avatar: "https:/new.new",
      team: {
        name: "newTeamName",
      },
    };

    function exec() {
      return request(server)
        .put("/api/coachs/" + coachId)
        .set("x-auth-token", token)
        .send(updatedCoach);
    }

    it("should return 400 if the given id is invalid", async () => {
      coachId = "invalidId";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if the given id not found", async () => {
      coachId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.text).toContain("coach");
    });

    it("should return new coach object in response if sent data is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(updatedCoach);
    });
  });

  describe("DELETE /:id", () => {
    function exec() {
      return request(server)
        .delete("/api/coachs/" + coachId)
        .set("x-auth-token", token);
    }

    it("should return 400 if given id is invalid ObjectId", async () => {
      coachId = "invalidId";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if no coach found for the given id", async () => {
      coachId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the coach from database", async () => {
      await exec();

      const coachInDb = await Coach.findById(coachId);

      expect(coachInDb).toBeNull();
    });

    it("should return deleted coach", async () => {
      const res = await exec();

      expect(res.body._id).toBe(coachId.toHexString());
    });
  });
});
