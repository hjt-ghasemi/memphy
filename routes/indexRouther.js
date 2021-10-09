const { Router } = require("express");
const leagueRouter = require("./leagues");
const router = Router();

router.use("/api/leagues", leagueRouter);
module.exports = router;
