loadGallery('https://resources.foschingsball.de', 3, 2020, 2030);

async function loadGallery(endpoint, previewCount, from, to) {
    const sectionsToLoad = Array.from({ length: to - from + 1 }, (_, index) => (async () => {
        const year = from + index;
        
        let elements;
        try {
            elements = await getGalleryPreviewElements(`${endpoint}/${year}/pictures`, 3, year, 'der Galerie');
        } catch (error) {
            return [year, undefined];
        }

        if (elements.length === 1) return;

        const section = document.createElement('section');

        const headerContainer = document.createElement('div');
        section.appendChild(headerContainer);

        headerContainer.classList.add('center');

        const headerAnchor = document.createElement('a');
        headerContainer.appendChild(headerAnchor);

        headerAnchor.classList.add('section-link');
        headerAnchor.href = `https://foschingsball.de/galerie/#${year}`;

        const headerLinkIcon = document.createElement('i');
        headerAnchor.appendChild(headerLinkIcon);

        headerLinkIcon.classList.add('bx', 'bx-link');

        const headerText = document.createElement('h2');
        headerAnchor.appendChild(headerText);

        headerText.textContent = year.toString();

        const div = document.createElement('div');
        section.appendChild(div);

        div.classList.add('galerie-grid');
        div.append(...elements);

        return [year - from, section];
    })());

    const result = await Promise.all(sectionsToLoad);

    const length = to - from;
    const sorted = Array.from({ length: length + 1 });

    for (const element of result) sorted[length - element[0]] = element[1];

    document.getElementById('years').append(...sorted.filter((value) => value !== undefined));
}