const criteriaUser = document.querySelector('#criteria-user');
const targetUser = document.querySelector('#target-user');
const searchForm = document.querySelector('#search-form');
const matchInfoTableBody = document.querySelector('#match-info-table tbody');
const viewMoreBtn = document.querySelector('#view-more-btn');
const summaryValues = document.querySelectorAll('#summary-values td')

let offset = 0;
const summary = {
    totalMatches:0,
    totalWinsOfUserA:0,
    totalWinsOfUserB:0,
    totalGoalsOfUserA:0,
    totalGoalsOfUserB:0,
}

const getMatches = async () => {
    const accessId = await fetch('rest/user',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname: criteriaUser.value,
            })
        }
    ).then(i => i.json());

    const matchIds = await fetch('rest/matches',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accessId: accessId.accessId,
                offset,
            })
        }
    ).then(i => i.json());

    const searchedMatches = await fetch('rest/match-infos',
        {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({matchIds: matchIds})
        })
        .then(i => i.json());
    viewMoreBtn.style.visibility = 'initial';
    const filteredMatches = searchedMatches.filter(searchedMatch => searchedMatch['matchInfo'].some(match => match.nickname === targetUser.value));
    summary.totalMatches += filteredMatches.length;
    return filteredMatches;
}
const appendMatches = (filteredMatches) => {
    filteredMatches.length === 0 && alert('검색결과 없음');
    filteredMatches.forEach(match => {
        let [userA, userB] = match['matchInfo'];
        let trColor;
        if (userA.nickname !== criteriaUser.value) [userA, userB] = [userB, userA];

        if (userA['shoot']['goalTotalDisplay'] > userB['shoot']['goalTotalDisplay']) {
            trColor = 'skyblue';
            summary.totalWinsOfUserA += 1;
        } else if(userA['shoot']['goalTotalDisplay'] < userB['shoot']['goalTotalDisplay']) {
            trColor = 'pink';
            summary.totalWinsOfUserB += 1;
        } else trColor = 'gray'

        summary.totalGoalsOfUserA += userA['shoot']['goalTotalDisplay'];
        summary.totalGoalsOfUserB += userB['shoot']['goalTotalDisplay'];

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
        summaryValues[0].innerHTML = summary.totalMatches;
        summaryValues[1].innerHTML = `${Math.round(summary.totalWinsOfUserA / summary.totalMatches * 100)}% <br> ${Math.round(summary.totalWinsOfUserB / summary.totalMatches * 100)}%`
        summaryValues[2].innerHTML = `${summary.totalGoalsOfUserA} <br> ${summary.totalGoalsOfUserB}`;
    })
}

viewMoreBtn.addEventListener('click',async () => {
    offset += 100;
    const filteredMatches = await getMatches();
    appendMatches(filteredMatches);

})
searchForm.addEventListener('submit',async (e) => {
        e.preventDefault();
        offset = 0;
        const oldResults = matchInfoTableBody.querySelectorAll("tr:not([id='table-title'])");
        oldResults.forEach(tr => tr.remove());
        const filteredMatches = await getMatches();
        appendMatches(filteredMatches);
    }
)