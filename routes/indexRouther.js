const { Router } = require("express");
const leagueRouter = require("./leagues");
const coachRouter = require("./coachs");
const teamRouter = require("./teams");
const playerRouter = require("./players");
const userRouter = require("./users");
const loginRouter = require("./login");

const router = Router();

router.use("/api/leagues", leagueRouter);
router.use("/api/coachs", coachRouter);
router.use("/api/teams", teamRouter);
router.use("/api/players", playerRouter);
router.use("/api/users", userRouter);
router.use("/api/login", loginRouter);

module.exports = router;
