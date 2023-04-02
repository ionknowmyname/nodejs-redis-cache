const superagent = require("superagent");
const redis = require("redis");

const client = redis.createClient(); //  { url: "redis://localhost:6379" }   //process.env.REDIS_PORT  // 6379, 127.0.0.1

/* (async () => {
    await client.connect();
})();

client.on("error", (error) => console.error(`Ups : ${error}`));
client.on("connect", () => console.log("client status --> ", client.isOpen));
client.on("ready", () => console.log("Redis Connected!")); */

(async () => {
    client.on("error", (err) => {
        console.log("Redis Client Error", err);
    });
    client.on("ready", () => console.log("Redis is ready"));

    await client.connect();

    await client.ping();
})();

const respond = (username, numberOfRepos) => {
    return `User "${username}" has ${numberOfRepos} public repositories.`;
};

const getReposNumber = async (req, res, next) => {
    const { username } = req.query;
    if (username === null) return;

    // await superagent
    //     .get(`https://api.github.com/users/${username}/repos`)
    //     .set("User-Agent", "PostmanRuntime/7.31.3")
    //     .end((err, response) => {
    //         if (err) throw err;

    //         // response.body contains an array of public repositories
    //         var repoNumber = response.body.length;

    //         //client.setEx(username, 60, JSON.stringify(repoNumber)); // set repoNumber for username in redis cache for 60 secs for testing
    //         client.set(username, JSON.stringify(repoNumber), "ex", 60);
    //         // client.set(username, repoNumber); // working, setEx/setex not working

    //         res.status(200).json({ message: respond(username, repoNumber) });
    //     });

    superagent
        .get(`https://api.github.com/users/${username}/repos`)
        .set("User-Agent", "PostmanRuntime/7.31.3")
        .then((err, response) => {
            if (err) throw err;

            // response.body contains an array of public repositories
            var repoNumber = response.body.length;

            //client.setEx(username, 60, JSON.stringify(repoNumber)); // set repoNumber for username in redis cache for 60 secs for testing
            client.set(username, JSON.stringify(repoNumber), "ex", 60);
            // client.set(username, repoNumber); // working, setEx/setex not working

            res.status(200).json({ message: respond(username, repoNumber) });
        })
        .catch((err) => {
            console.log(err);
        });
    // .end();
};

const getRepos = async (req, res, next) => {
    const { username } = req.query;
    if (username === null) return;

    await superagent
        .get(`https://api.github.com/users/${username}/repos`)
        .set("User-Agent", "PostmanRuntime/7.31.3")
        .end((err, response) => {
            if (err) throw err;

            client.setEx(username, 60, JSON.stringify(response.body)); // set repos for username in redis cache for 60 secs for testing

            res.status(200).json({
                message: "Successfully retrieved",
                data: response.body,
            });
        });
};

const numberCache = (req, res, next) => {
    const { username } = req.query;
    if (username === null) return;

    client.get(username, (err, data) => {
        if (err) throw err;

        if (data !== null) {
            // data already in cache
            res.status(200).json({ message: respond(username, data) });
        } else {
            next(); // if not. move to the next middleware/next whatever
        }
    });
};

const repoCache = (req, res, next) => {
    const { username } = req.query;
    if (username === null) return;

    client.get(username, (err, data) => {
        if (err) throw err;

        if (data !== null) {
            // data exists, send data
            res.status(200).json({
                message: "Successfully retrieved",
                data: JSON.parse(data),
            });
        } else {
            next(); // on to the next middleware/next whatever
        }
    });
};

module.exports = { getReposNumber, getRepos, numberCache, repoCache };
