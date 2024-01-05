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
        img.classList.add('img')

        return img;
    });

const dotsSVG = `<svg width="60%" viewBox="0 0 32.1 32.1" xmlns="http://www.w3.org/2000/svg" fill="#eceef9">
    <path d="m3.97 12.1c-2.19 0-3.97 1.77-3.97 3.97s1.77 3.97 3.97 3.97c2.19 0 3.97-1.77 3.97-3.97 0-2.19-1.78-3.97-3.97-3.97zm12.3 0c-2.19 0-3.97 1.77-3.97 3.96s1.78 3.97 3.97 3.97 3.97-1.77 3.97-3.97c-2e-3 -2.19-1.78-3.96-3.97-3.96zm11.9 0c-2.19 0-3.97 1.77-3.97 3.97 0 2.19 1.77 3.96 3.97 3.96 2.19 0 3.96-1.77 3.96-3.96s-1.78-3.97-3.96-3.97z"/>
</svg>`