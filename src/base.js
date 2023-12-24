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

const getImagesFromEndpoint = (endpoint, images, start, range) =>
    Array.from({ length: range }, (_, index) => {
        const img = document.createElement('img');

        const imgName = images[start + index];
        img.src = `${endpoint}/${imgName}`;
        img.alt = `Preview Bild: ${imgName}`;

        return img;
    });
