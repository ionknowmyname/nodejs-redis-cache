import { Router } from "express";
const router = Router();

import { getReposNumber, getRepos } from "../controllers/githubController.js";

router.get("/number", getReposNumber);

router.get("/repos", getRepos);

// export default router;
export { router as githubRouter };
