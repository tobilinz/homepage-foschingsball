const fetchJson = async (url, name) => {
    let response;
    try {
        response = await fetch(url, {mode: 'cors'});
    } catch (error) {
        throw new Error(`Die URL für ${name} konnte nicht erreicht werden:\n${error}`);
    }

    if (!response.ok) throw new Error(`Die Informationen über ${name} konnten nicht geladen werden:\n${response.statusText}`);

    let json;
    try {
        json = await response.json();
    } catch (error) {
        throw new Error(`Die JSON Datei für ${name} konnte nicht verarbeitet werden:\n${error}`);
    }

    return json;
}

const getGalleryPreviewElements = async (url, previewCount, href, name) => {
    const elements = [];
    
    const galleryContent = await fetchJson(`${url}/content.json`, `die Bilder ${name} `);

    for (let i = 0; i < previewCount; i++) {
        const img = document.createElement('img');
        elements.push(img);

        const imgName = galleryContent[Math.floor(Math.random() * galleryContent.length)];
        img.src = `${url}/${imgName}`;
        img.alt = `Preview Bild: ${imgName}`;
    }

    const a = document.createElement('a');
    elements.push(a)

    a.href = href;
    a.classList.add('more-images');

    const i = document.createElement('i');
    a.appendChild(i);
    i.classList.add('bx', 'bx-dots-horizontal');
    
    return elements;
}