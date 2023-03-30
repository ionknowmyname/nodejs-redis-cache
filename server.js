import express, { urlencoded, json } from "express";
import { config } from "dotenv";

import { githubRouter } from "./routes/github.js";

const app = express();

config();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api", githubRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
