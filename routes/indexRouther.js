const { Router } = require("express");
const leagueRouter = require("./leagues");
const coachRouter = require("./coachs");
const teamRouter = require("./teams");
const playerRouter = require("./players");
const userRouter = require("./users");
const loginRouter = require("./login");
const errorMiddleware = require("../middlewares/errors");
const notfound = require("../middlewares/404");
const router = Router();

router.use("/api/leagues", leagueRouter);
router.use("/api/coachs", coachRouter);
router.use("/api/teams", teamRouter);
router.use("/api/players", playerRouter);
router.use("/api/users", userRouter);
router.use("/api/login", loginRouter);
router.use("/not-found", notfound);

router.use(errorMiddleware);

router.use(function (req, res, next) {
  return res.redirect("/not-found");
});

module.exports = router;
