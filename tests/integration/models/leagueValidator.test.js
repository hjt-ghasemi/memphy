const { League } = require('../../../models/league');
const request = require('supertest');


describe("data validation on /api/leagues", () => {
  let server, title;

  beforeEach(() => {
    server = require('../../../index');
    title = "league1";
  })

  afterEach(()=> {
    server.close();
  })

  function exec(){
    return request(server).post('/api/leagues').send({title});
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
    title = "?//league"

    const res = await exec();
    
    expect(res.status).toBe(400);
  });
});
