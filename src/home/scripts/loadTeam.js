import {fetchJson} from "../../scripts/fetchJson.js";

const endpoint = 'https://resources.foschingsball.de/2024/team';
const teamSelectorWrapper = document.getElementById('team-selector-wrapper');
const teamSelector = document.getElementById('team-selector');
const memberGrid = document.getElementById('member-grid');

const loadTeam = fetchJson(endpoint + '/team.json', 'das Team').catch(error => throwError(error));
loadTeam.then(groups => {
  if (!groups) {
    throwError('Beim Laden der Teams ist ein Fehler aufgetreten.')
    return;
  }

  const select = document.getElementById('team-selector');

  for (const groupName in groups) {
    const option = document.createElement('option');
    select.appendChild(option);

    option.setAttribute('value', groupName);
    if (groups[groupName].selected === true)
      option.setAttribute('selected', 'selected');
    option.innerText = groupName;
  }

  teamSelectorWrapper.classList.remove('hidden');

  selectTeam().then(_ => null);
})

function throwError(message) {
  console.trace(message);
  const loadingError = document.getElementById('team-loading-error');
  loadingError.innerText = message;
  loadingError.classList.remove('hidden');
}


teamSelector.addEventListener('change', selectTeam);
async function selectTeam() {
  const groups = await loadTeam;

  if (groups === null) {
    throwError('Beim Auswählen des Teams ist ein Fehler aufgetreten.');
    teamSelectorWrapper.classList.add('hidden');
    return;
  }

  const members = groups[teamSelector.value].members;

  const elements = members.map(member => {
    const name = member.name;

    const a = document.createElement('a');
    a.ariaLabel = `Link zur von ${name} verlinkten webseite`;

    if (isEmpty(member.link)) a.href = '#loadTeam';
    else {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.href = member.link.trim();
    }

    const img = document.createElement('img');
    a.appendChild(img);

    img.src = isEmpty(member.picture) ? 'home/generic-avatar.svg' : `${endpoint}/${teamSelector.value.toLowerCase()}/${member.picture}`;

    img.alt = `Bild von ${name}`;

    const p = document.createElement('p');
    a.appendChild(p);

    p.textContent = name;

    return a;
  });

  memberGrid.replaceChildren(...elements);
}

function isEmpty(s) {
  return s === null || s === undefined || s.trim().length === 0;
}
