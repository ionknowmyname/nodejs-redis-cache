const express = require("express");
const router = express.Router();

const git = require("../controllers/githubController");

router.get("/number", git.getReposNumber);

router.get("/repos", git.getRepos);

module.exports = router;
