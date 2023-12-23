const endpoint = 'https://resources.foschingsball.de/2024/team';
let team = null;

const customTeamSelector = document.getElementById('custom-team-selector');

fetch(endpoint + '/team.json', {mode: 'cors'})
    .then(response => {
        if (!response.ok) {
            throwError`Die Informationen über das Team konnten nicht geladen werden:\n${response.statusText}`;
            return;
        }

        response.json()
            .then(json => {
                team = json;

                const select = document.getElementById('team-selector');

                for (const name in team) {
                    const option = document.createElement('option');
                    select.appendChild(option);

                    option.setAttribute('value', name);
                    if (team[name].selected === true) option.setAttribute('selected', 'selected');
                    option.innerText = name;
                }

                customTeamSelector.classList.remove('hidden');
                
                selectTeam();
            })
            .catch(error => throwError(`Die JSON Datei mit den Team Daten konnte nicht verarbeitet werden:\n${error}`));
    })
    .catch(error => throwError(`Der Endpunkt mit den Team Daten konnte nicht erreicht werden:\n${error}`));

function throwError(message) {
    customTeamSelector.classList.add('hidden');

    const loadingError = document.getElementById('team-loading-error');
    loadingError.innerText = message;
    loadingError.classList.remove('hidden');
}

const teamSelector = document.getElementById('team-selector');
const memberGrid = document.getElementById('member-grid');

function selectTeam() {
    if (team === null) {
        throwError('Beim Auswählen des Teams ist ein Fehler aufgetreten.')
        return;
    }
    
    const members = team[teamSelector.value].members;
    
    const elements = members.map(member => {
        const name = member.name;
        
        const img = document.createElement('img');
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
