const { leagueValidator } = require("../../../models/league");

describe("league validation function", () => {
  it("should return an error object if league is less than 5 characters", () => {
    const req = {
      title: "1234",
    };
    const result = leagueValidator(req);
    expect(result.error).toBeDefined();
  });

  it("should return an error object if league is more than 50 characters", () => {
    const req = {
      title: "a".padEnd(51, "a"),
    };
    const result = leagueValidator(req);
    expect(result.error).toBeDefined();
  });

  it("should return an error object if league is not defined", () => {
    const req = {};

    const result = leagueValidator(req);
    expect(result.error).toBeDefined();
  });

  it("should return req object if req is valid", () => {
    const req = {
      title: "premier league",
    };

    const result = leagueValidator(req);
    expect(result.value).toEqual(req);
  });
});
