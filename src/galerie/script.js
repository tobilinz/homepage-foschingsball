const endpoint = 'https://resources.foschingsball.de';
const previewCount = 2;
const from = 2020
const to = 2030;
const batchSize = 32;

const years = document.getElementById('years');
const backButton = document.getElementById('to-overview');
const moreButton = document.getElementById('more');

let currentDiv = null;
let currentYear = 0;
let currentImages = [];

const sectionsToLoad = Array.from({length: to - from + 1}, (_, index) => (async () => {
  const year = from + index;

  let images;
  try {
    images = await fetchJson(`${endpoint}/${year}/pictures/content.json`, `die Bilder der Galerie`);
  } catch (error) {
    return [year, undefined];
  }

  const start = Math.floor(Math.random() * (images.length - previewCount))
  const previewElements = getMediaFromEndpoint(`${endpoint}/${year}/pictures`, images, start, previewCount);

  const button = document.createElement('button');

  button.classList.add('more-images',);
  button.onclick = () => {
    let found = false;
    for (const child of years.children) {
      if (child.id !== `${year}-full`) {
        child.classList.add('hidden');
        continue;
      }

      found = true;
      currentDiv = child.lastChild;
      child.classList.remove('hidden');
    }

    if (found === false) {
      const fullSection = document.createElement('section');
      years.appendChild(fullSection);

      fullSection.id = year.toString() + '-full';
      currentDiv = createGallerySection(fullSection, year, `https://foschingsball.de/galerie/#${year}`);
    }

    currentImages = images;
    currentYear = year;
    backButton.classList.remove('hidden');

    if (images.length > currentDiv.children.length) moreButton.classList.remove('hidden');

    if (currentDiv.children.length === 0) loadImages();
  };

  button.innerHTML = dotsSVG;

  const gallerySection = document.createElement('section');
  gallerySection.id = year.toString();

  const div = createGallerySection(gallerySection, year, `https://foschingsball.de/galerie/#${year}`);
  div.append(...previewElements, button);

  return [year - from, gallerySection];
})());

Promise.all(sectionsToLoad).then(result => {
  const length = to - from;
  const sorted = Array.from({length: length + 1});

  for (const element of result) sorted[length - element[0]] = element[1];

  years.append(...sorted.filter((value) => value !== undefined));
});

function loadImages() {
  const images = getMediaFromEndpoint(`${endpoint}/${currentYear}/pictures`, currentImages, currentDiv.children.length, Math.min(batchSize, currentImages.length - currentDiv.children.length));
  currentDiv.append(...images);

  if (currentDiv.children.length >= currentImages.length) moreButton.classList.add('hidden');
}

function back() {
  currentDiv = null;

  for (const child of years.children) {
    if (child.id.endsWith('-full')) {
      child.classList.add('hidden');
      continue;
    }

    child.classList.remove('hidden');
  }

  backButton.classList.add('hidden');
  moreButton.classList.add('hidden');
}

function createGallerySection(section, header, link) {
  const headerContainer = document.createElement('div');
  section.appendChild(headerContainer);

  headerContainer.classList.add('center');

  const headerAnchor = document.createElement('a');
  headerContainer.appendChild(headerAnchor);

  headerAnchor.classList.add('section-link');
  headerAnchor.href = link.toString();
  headerAnchor.ariaLabel = 'Mehr Bilder anschauen'

  const headerLinkIcon = document.createElement('img');
  headerAnchor.appendChild(headerLinkIcon);
  headerLinkIcon.src = '../link.svg';
  headerLinkIcon.alt = 'Link Icon';

  const headerText = document.createElement('h2');
  headerAnchor.appendChild(headerText);

  headerText.textContent = header.toString();

  const div = document.createElement('div');
  section.appendChild(div);

  div.classList.add('galerie-grid');

  return div;
}
