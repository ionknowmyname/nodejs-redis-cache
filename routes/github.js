const express = require("express");
const router = express.Router();

const github = require("../controllers/githubController");

router.get("/number", github.numberCache, github.getReposNumber); // numberCache

router.get("/repos", github.repoCache, github.getRepos); // repoCache

module.exports = router;
