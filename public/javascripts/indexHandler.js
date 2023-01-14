const criteriaUser = document.querySelector('#criteria-user');
const targetUser = document.querySelector('#target-user');
const searchBtn = document.querySelector('#search-btn');
const resultList = document.querySelector('#result-list');


searchBtn.addEventListener('click',async () => {
        const matchIds = await fetch('rest/matches',
            {
                method: 'post',
                body: JSON.stringify({'accessId': criteriaUser.value})
            }
        ).then(i => i.json());

        const matchInfos = await fetch('rest/match-infos',
            {
                method:'post',
                body: JSON.stringify({'matchIds': matchIds})}).then(i => i.json());
    }
)