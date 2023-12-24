const endpoint = 'https://resources.foschingsball.de/2024/team';
const customTeamSelector = document.getElementById('custom-team-selector');
const teamSelector = document.getElementById('team-selector');
const memberGrid = document.getElementById('member-grid');

const team = (async () => {
    let response;

    try {
        response = await fetch(endpoint + '/team.json', {mode: 'cors'});
    } catch (error) {
        throwError(`Der Endpunkt mit den Team Daten konnte nicht erreicht werden:\n${error}`);
        return null;
    }

    if (!response.ok) {
        throwError(`Die Informationen über das Team konnten nicht geladen werden:\n${response.statusText}`);
        return null;
    }

    let json;
    try {
        json = await response.json();
    } catch (error) {
        throwError(`Die JSON Datei mit den Team Daten konnte nicht verarbeitet werden:\n${error}`);
        return null;

    }

    return json;
})();

team.then(groups => {
    const select = document.getElementById('team-selector');

    for (const groupName in groups) {
        const option = document.createElement('option');
        select.appendChild(option);

        option.setAttribute('value', groupName);
        if (groups[groupName].selected === true) 
            option.setAttribute('selected', 'selected');
        option.innerText = groupName;
    }

    customTeamSelector.classList.remove('hidden');
    
    selectTeam();
})

function throwError(message) {
    customTeamSelector.classList.add('hidden');

    const loadingError = document.getElementById('team-loading-error');
    loadingError.innerText = message;
    loadingError.classList.remove('hidden');
}

async function selectTeam() {
    const groups = await team;
    if (groups === null) {
        throwError('Beim Auswählen des Teams ist ein Fehler aufgetreten.')
        return;
    }
    
    const members = groups[teamSelector.value].members;

    const elements = members.map(member => {
        const name = member.name;

        const img = document.createElement('img');
        if (!isEmpty(member.picture)) 
            img.src = `${endpoint}/${teamSelector.value.toLowerCase()}/${member.picture}`;
        
        img.alt = `Bild von ${name}`;

        const p = document.createElement('p');
        p.textContent = name;

        const a = document.createElement('a');
        a.appendChild(img);
        a.appendChild(p);

        if (isEmpty(member.link)) a.href = 'https://foschingsball.de/#team';
        else {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.href = member.link.trim();
        }

        return a;
    });

    memberGrid.replaceChildren(...elements);
}

function isEmpty(s) {
    return s === null || s === undefined || s.trim().length === 0;
}
