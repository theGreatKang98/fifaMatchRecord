
const criteriaUser = document.querySelector('#criteria-user');
const targetUser = document.querySelector('#target-user');
const searchForm = document.querySelector('#search-form');
const matchInfoTableBody = document.querySelector('#match-info-table tbody');


searchForm.addEventListener('submit',async (e) => {
        e.preventDefault();
        const oldResults = matchInfoTableBody.querySelectorAll("tr:not([id='table-title'])");
        oldResults.forEach(tr => tr.remove());
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
        filteredMatches.length === 0 && alert('검색결과 없음');
        filteredMatches.forEach(match => {
            let [userA, userB] = match['matchInfo'];
            if (userA.nickname !== criteriaUser.value) [userA, userB] = [userB, userA];
            const trColor = userA['shoot']['goalTotalDisplay'] > userB['shoot']['goalTotalDisplay'] ? 'skyblue' : userA['shoot']['goalTotalDisplay'] < userB['shoot']['goalTotalDisplay'] ? 'pink' : 'gray';
            const html = `<tr class=${trColor}>
                        <td>${userA['matchDetail']['matchResult']}<br>${userB['matchDetail']['matchResult']}</td>
                        <td>${userA['shoot']['shootTotal']}<br>${userB['shoot']['shootTotal']}</td>
                        <td>${userA['shoot']['effectiveShootTotal']}<br>${userB['shoot']['effectiveShootTotal']}</td>
                        <td>${userA['shoot']['goalTotalDisplay']}<br>${userB['shoot']['goalTotalDisplay']}</td>
                        <td>${userA['pass']['passTry']}<br>${userB['pass']['passTry']}</td>
                        <td>${Math.round(userA['pass']['passSuccess'] / userA['pass']['passTry']*100)}%<br>
                            ${Math.round(userB['pass']['passSuccess'] / userB['pass']['passTry']*100)}%</td>
                        <td>${userA['matchDetail']['offsideCount']}<br>${userB['matchDetail']['offsideCount']}</td>
                        <td>${match['matchDate']}</td>
                     </tr>`
            matchInfoTableBody.innerHTML += html;
        })
    }
)