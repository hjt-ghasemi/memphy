const { Router } = require("express");
const leagueRouter = require("./leagues");
const coachRouter = require("./coachs");
const router = Router();

router.use("/api/leagues", leagueRouter);
router.use("/api/coachs", coachRouter);

module.exports = router;
