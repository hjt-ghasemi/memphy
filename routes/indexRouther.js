const { Router } = require("express");
const leagueRouter = require("./leagues");
const coachRouter = require("./coachs");
const teamRouter = require("./teams");
const router = Router();

router.use("/api/leagues", leagueRouter);
router.use("/api/coachs", coachRouter);
router.use("/api/teams", teamRouter);

module.exports = router;
