var express = require('express');
var router = express.Router();
require("dotenv").config();

router.post('/matches', async function (req, res, next) {
    const accessId = req.body.accessId;
    const matchIds = (await fetch(`https://api.nexon.co.kr/fifaonline4/v1.0/users/${accessId}/matches?matchtype=50&limit=10`,
        {headers: {'Authorization': process.env.API_KEY}}
    ).then(i => i.json()));
    console.log(matchIds);
    res.send(matchIds);
});

router.post('/match-infos', async function (req, res, next) {
    const matchIds = req.body.matchIds;
    const matchInfos = await Promise.all(matchIds.map(async matchId => {
        const res = await fetch(`https://api.nexon.co.kr/fifaonline4/v1.0/matches/${matchId}`,
            {headers: {'Authorization': process.env.API_KEY}})
        return res.json();
    }));
    console.log(matchInfos);
    res.send(matchInfos);
});

module.exports = router;
