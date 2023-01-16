
const criteriaUser = document.querySelector('#criteria-user');
const targetUser = document.querySelector('#target-user');
const searchBtn = document.querySelector('#search-btn');
const resultList = document.querySelector('#result-list');


searchBtn.addEventListener('click',async () => {

        const accessId = await fetch('rest/user',
            {
                method: 'post',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({nickname: criteriaUser.value})
            }
        ).then(i => i.json());

        const matchIds = await fetch('rest/matches',
            {
                method: 'post',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({accessId: accessId.accessId})
            }
        ).then(i => i.json());

        const searchedMatches = await fetch('rest/match-infos',
            {
                method:'post',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({matchIds: matchIds})})
            .then(i => i.json());

        const filteredMatches = searchedMatches.filter(searchedMatch => searchedMatch['matchInfo'].some(match => match.nickname === targetUser.value));
    console.log(filteredMatches);
    }
)