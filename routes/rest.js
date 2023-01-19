const fetch = require('cross-fetch');
const express = require('express');

const router = express.Router();
require("dotenv").config();

router.post('/user', async (req, res) => {
    const nickname = req.body.nickname;
    const accessId = await fetch(`https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname=${nickname}`,
        {headers: {'Authorization': process.env.API_KEY}})
        .then(i => i.json());
    res.send(accessId);
})

router.post('/matches', async  (req, res, _) => {
    const accessId = req.body.accessId;
    const offset = req.body.offset;
    const matchIds = await fetch(`https://api.nexon.co.kr/fifaonline4/v1.0/users/${accessId}/matches?matchtype=40&offset=${offset}&limit=100`,
        {headers: {'Authorization': process.env.API_KEY}})
        .then(i => i.json());
    res.send(matchIds);
});

router.post('/match-infos', async (req, res, _) => {
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
