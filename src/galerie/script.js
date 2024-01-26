const endpoint = 'https://resources.foschingsball.de';
const previewCount = 2;
const from = 2023;
const to = 2024;
const batchSize = 32;

const years = document.getElementById('years');
const backButton = document.getElementById('to-overview');
const moreButton = document.getElementById('more');

let currentDiv = null;
let currentYear = 0;
let currentImages = [];

const nav = document.getElementsByTagName('nav')[0];
const body = document.getElementById('body');
const fullImage = document.getElementById('big-image');
const fullImageView = document.getElementById('big-view');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
let currentShownImage = undefined;

function updateButtons(i) {
  previousButton.disabled = i <= 0;
  nextButton.disabled = i >= currentImages.length - 1
}

function showImage(i) {
  fullImage.src = `${endpoint}/${currentYear}/pictures/${currentImages[i]}`;
  currentShownImage = i;
}

const imageClickAction = (img, i) => {
  img.addEventListener('click', () => {
    body.style.overflow = 'hidden';
    fullImageView.classList.remove('hidden');
    nav.classList.add('hidden');
    showImage(i);
    updateButtons(i);
  });
}

nextButton.addEventListener('click', () => {
  const newImage = currentShownImage + 1;

  if (newImage >= currentImages.length) return;
  updateButtons(newImage);
  showImage(newImage);
});

previousButton.addEventListener('click', () => {
  const newImage = currentShownImage - 1;

  if (newImage < 0) return;
  updateButtons(newImage);
  showImage(newImage);
});

document.getElementById('close').addEventListener('click', () => {
  fullImageView.classList.add('hidden');
  nav.classList.remove('hidden');
  body.style.overflow = '';
  currentShownImage = undefined;
});

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

  button.classList.add('more-images');
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
      const fullSection = createGallerySection(year, year.toString() + '-full');
      years.appendChild(fullSection);
      currentDiv = fullSection.lastChild;
    }

    currentImages = images;
    currentYear = year;
    backButton.classList.remove('hidden');

    if (images.length > currentDiv.children.length) moreButton.classList.remove('hidden');

    if (currentDiv.children.length === 0) loadImages();
  };

  button.innerHTML = dotsSVG;

  const gallerySection = createGallerySection(year, year, ...previewElements, button);
  return [year - from, gallerySection];
})());

Promise.all(sectionsToLoad).then(result => {
  const length = to - from;
  const sorted = Array.from({length: length + 1});

  for (const element of result) sorted[length - element[0]] = element[1];

  years.append(...sorted.filter((value) => value !== undefined));
});

function loadImages() {
  const images = getMediaFromEndpoint(`${endpoint}/${currentYear}/pictures`, currentImages, currentDiv.children.length, Math.min(batchSize, currentImages.length - currentDiv.children.length), imageClickAction);
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

function createGallerySection(header, id, ...children) {
  const section = document.createElement('section');
  section.id = id;
  
  const headerText = document.createElement('h2');
  section.appendChild(headerText);

  headerText.textContent = header;

  const div = document.createElement('div');
  section.appendChild(div);

  div.classList.add('galerie-grid');
  
  div.append(...children);

  return section;
}