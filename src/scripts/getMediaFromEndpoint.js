export function getMediaFromEndpoint(endpoint, images, start, range, action) {
  const imageHeight = getComputedStyle(document.documentElement).getPropertyValue('--galerie-grid-height').slice(0, -2);

  return Array.from({length: range}, (_, index) => {
    const img = document.createElement('img');

    const i = start + index;
    const imgName = images[i];
    img.loading = "lazy";
    img.src = `${endpoint}/${imgName}`;
    img.alt = `Preview Bild: ${imgName}`;
    img.classList.add('img')
    img.height = +imageHeight;

    if (action) action(img, i);

    return img;
  });
}
