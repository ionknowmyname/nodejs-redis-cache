const request = require("superagent");

const respond = (username, numberOfRepos) => {
    return `User "${username}" has ${numberOfRepos} public repositories.`;
};

const getReposNumber = async (req, res) => {
    const { username } = req.query;

    request
        .get(`https://api.github.com/users/${username}/repos`)
        .set("User-Agent", "PostmanRuntime/7.31.3")
        .end((err, response) => {
            if (err) throw err;

            // response.body contains an array of public repositories
            var repoNumber = response.body.length;

            res.send(respond(username, repoNumber));
        });
};

const getRepos = async (req, res) => {
    const { username } = req.query;
    if (username === null) return;

    request
        .get(`https://api.github.com/users/${username}/repos`)
        .set("User-Agent", "PostmanRuntime/7.31.3")
        .end((err, response) => {
            if (err) throw err;

            res.send({
                message: "Successfully retrieved",
                data: response.body,
            });
        });
};

module.exports = { getReposNumber, getRepos };
