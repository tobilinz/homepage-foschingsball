import {getMediaFromEndpoint} from "../scripts/getMediaFromEndpoint.js";
import {fetchJson} from "../scripts/fetchJson.js";

const endpoint = 'https://resources.foschingsball.de';
loadGallery(2023, 2024, 2);

const years = document.getElementById('years');
const backButton = document.getElementById('to-overview');
const moreButton = document.getElementById('more');

let current = null;

// Big view
const nav = document.getElementsByTagName('nav')[0];
const previousFullImage = document.getElementById('previous-big-image');
const fullImage = document.getElementById('big-image');
const nextFullImage = document.getElementById('next-big-image');
const fullImageView = document.getElementById('big-view');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const closeButton = document.getElementById('close');
const fullImages = document.getElementById('images');
let currentShownImage = 0;
let scrollPosition = 0;

function updateButtons(i) {
  previousButton.disabled = i <= 0;
  nextButton.disabled = i >= current.images.length - 1;
  closeButton.disabled = false;
}

function showFullImages(i) {
  fullImageView.classList.remove('hidden');
  nav.classList.add('hidden');
  updateFullImages(i)
}

function updateFullImages(i) {
  previousFullImage.src = `${endpoint}/${current.year}/pictures/${current.images[i - 1 < 0 ? 0 : i - 1]}`;
  fullImage.src = `${endpoint}/${current.year}/pictures/${current.images[i]}`;
  nextFullImage.src = `${endpoint}/${current.year}/pictures/${current.images[i + 1 >= current.images.length ? 0 : i + 1]}`;
  
  currentShownImage = i;
}

function setButtonsDisabled(value) {
  nextButton.disabled = value;
  previousButton.disabled = value;
  closeButton.disabled = value;
}

function nextImage() {
  setButtonsDisabled(true);
  const newImage = currentShownImage + 1;
  fullImages.classList.add('slideRight');
  setTimeout(() => {
    fullImages.classList.remove('slideRight')
    updateFullImages(newImage);
    fullImages.style.transform = 'translateZ(0px) translateX(100vw)';
    updateButtons(newImage);
  }, 250);
}
document.getElementById('next').addEventListener('click', nextImage);

function previousImage() {
  setButtonsDisabled(true);
  const newImage = currentShownImage - 1;
  fullImages.classList.add('slideLeft');
  setTimeout(() => {
    fullImages.classList.remove('slideLeft')
    updateFullImages(newImage);
    fullImages.style.transform = 'translateZ(0px) translateX(100vw)';
    updateButtons(newImage);
  }, 250)
}
document.getElementById('previous').addEventListener('click', previousImage);

function closeImage() {
  document.body.classList.remove('stop-scrolling');
  window.scrollTo({
    top: scrollPosition,
    left: 0,
    behavior: 'instant',
  });
  fullImageView.classList.add('hidden');
  nav.classList.remove('hidden');
  currentShownImage = 0;
}
document.getElementById('close').addEventListener('click', closeImage);

// Gallery Loading
function loadGallery(from, to, previewCount) {
  const sectionsToLoad = Array.from({length: to - from + 1}, (_, index) => (async () => {
    const currentYear = from + index;
    const currentEndpoint = `${endpoint}/${currentYear}/pictures`;

    let imageList;
    try {
      imageList = await fetchJson(currentEndpoint + '/content.json', 'die Bilder der Galerie');
    } catch (error) {
      return [currentYear, undefined];
    }

    const fullGallerySection = createGallerySection(currentYear, currentYear.toString() + '-full');
    fullGallerySection.classList.add('hidden');
    const allImages = getMediaFromEndpoint(currentEndpoint, imageList, 0, imageList.length);
    Array.from(allImages).forEach((image, index) => image.onclick = () => {
      scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.classList.add('stop-scrolling');
      fullImageView.classList.remove('hidden');
      nav.classList.add('hidden');
      showFullImages(index);
      updateButtons(index);
    });
    fullGallerySection.lastChild.append(...allImages);
    years.append(fullGallerySection);

    const start = Math.floor(Math.random() * (imageList.length - previewCount))
    const previewElements = getMediaFromEndpoint(currentEndpoint, imageList, start, previewCount);

    const button = createMoreButton(imageList, currentYear);

    const gallerySection = createGallerySection(currentYear, currentYear, ...previewElements, button);

    return [currentYear - from, gallerySection];
  })());

  function createMoreButton(images, year) {
    const button = document.createElement('button');

    button.classList.add('more-images');

    button.onclick = () => {
      let currentDiv = null;
      for (const child of years.children) {
        if (child.id !== `${year}-full`) {
          child.classList.add('hidden');
          continue;
        }

        currentDiv = child.lastChild;
        child.classList.remove('hidden');
      }

      current = {
        div: currentDiv,
        year: year,
        images: images
      };

      backButton.classList.remove('hidden');
    };

    button.innerText = '···';

    return button;
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

  Promise.all(sectionsToLoad).then(result => {
    const length = to - from;
    const sorted = Array.from({length: length + 1});

    for (const element of result) sorted[length - element[0]] = element[1];

    years.append(...sorted.filter((value) => value !== undefined));
  });
}

// Other Events
function back() {
  current = null;

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
document.getElementById('to-overview').addEventListener('click', back);
