import { Router } from "express";
const router = Router();

import {
    getReposNumber,
    getRepos,
    numberCache,
    repoCache,
} from "../controllers/githubController.js";

router.get("/number", getReposNumber); // numberCache

router.get("/repos", getRepos); // repoCache

// export default router;
export { router as githubRouter };
