countDown('2024', '02', '09', '19', '00');
blinking(
  2000, 4000,
  1, 3,
  75, 25,
  'counter-frame', 'party');
blurAnimation(0.5);
videoAutoplay(600);
loadGalleryPreview('https://resources.foschingsball.de/2023/pictures', 2).then(_ => null);
loadIFrames([
  {
    id: 'main-map',
    src: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4832.9351070544835!2d11.447261!3d49.27884!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479f6f8e884c5485%3A0x20da06e2e28e49a3!2sKleine%20Jurahalle!5e1!3m2!1sde!2sde!4v1702989223575!5m2!1sde!2sde'
  },/*
  {
    id: 'ticket-map-1',
    src: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4832.9351070544835!2d11.447261!3d49.27884!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479f6f8e884c5485%3A0x20da06e2e28e49a3!2sKleine%20Jurahalle!5e1!3m2!1sde!2sde!4v1702989223575!5m2!1sde!2sde'
  },
  {
    id: 'ticket-map-2',
    src: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4832.9351070544835!2d11.447261!3d49.27884!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479f6f8e884c5485%3A0x20da06e2e28e49a3!2sKleine%20Jurahalle!5e1!3m2!1sde!2sde!4v1702989223575!5m2!1sde!2sde'
  }*/
])

function countDown(year, month, day, hour, minute) {
  const days = document.getElementById('days');
  const hours = document.getElementById('hours');
  const minutes = document.getElementById('minutes');
  const seconds = document.getElementById('seconds');

  const date = Date.parse(`${year}-${month}-${day}T${hour}:${minute}:00.000+01:00`);

  const diff = date - Date.now();

  /* When too much time is left, the day count has three digits.
     This causes the day counter to overflow out of its border.
     When no time is left, the counter is useless.
  */
  const hundredDaysInMS = 100 * 24 * 60 * 60 * 1000;
  if (diff < 0 || diff > hundredDaysInMS) {
    const over = document.getElementById('counter-over');
    over.innerText = `Der FOSchingsball ${year - 1} ist vorbei.
Komm ein anderes Mal wieder.`;
    over.classList.remove('hidden');
    return;
  }

  document.getElementById('counter').classList.remove('hidden');

  function updateCounter() {
    const timeLeft = date - Date.now();

    if (timeLeft <= 0) return false;

    const daysLeft = timeLeft / (1000 * 60 * 60 * 24);
    days.textContent = Math.floor(daysLeft).toString();
    const daysRest = daysLeft % 1;
    const hoursLeft = daysRest * 24;
    hours.textContent = Math.floor(hoursLeft).toString();
    const hoursRest = hoursLeft % 1;
    const minutesLeft = hoursRest * 60;
    minutes.textContent = Math.floor(minutesLeft).toString();
    const minutesRest = minutesLeft % 1;
    const secondsLeft = minutesRest * 60;
    seconds.textContent = Math.floor(secondsLeft).toString();

    return true;
  }

  if (!updateCounter()) return;

  const countdownTimer = setInterval(() => {
    if (updateCounter()) return;

    clearInterval(countdownTimer);
    days.textContent = "0";
    hours.textContent = "0";
    minutes.textContent = "0";
    seconds.textContent = "0";
  }, 1000);
}

function blinking(minInterval, intervalRange, minBlinkTimes, blinkTimesRange, minOnOffDelay, onOffDelayRange, ...classNames) {
  const elements = []
  for (const className of classNames) {
    const classElements = document.getElementsByClassName(className);
    for (const classElement of classElements) elements.push(classElement);
  }

  const filter = getComputedStyle(document.documentElement).getPropertyValue('--glow');
  const shadow = getComputedStyle(document.documentElement).getPropertyValue('--shadow');

  function blink() {
    const element = elements[Math.floor(Math.random() * elements.length)];
    const amount = Math.floor(Math.random() * blinkTimesRange + minBlinkTimes);

    let totalDelay = 0;
    for (let i = 0; i < amount; i++) {
      setTimeout(() => element.style.setProperty('filter', shadow), totalDelay);

      totalDelay += Math.random() * onOffDelayRange + minOnOffDelay;
      setTimeout(() => element.style.setProperty('filter', filter), totalDelay);

      totalDelay += Math.random() * onOffDelayRange + minOnOffDelay;
    }

    setTimeout(blink, Math.random() * intervalRange + minInterval)
  }

  blink();
}

function blurAnimation(blurEntryMultiplier) {
  let hasBlurred = false;
  const background = document.getElementsByClassName('background')[0];

  function blur() {
    if (window.scrollY > window.innerHeight * blurEntryMultiplier) {
      background.classList.remove('blur-out');
      background.classList.add('blur-in');
      hasBlurred = true;
    } else if (hasBlurred) {
      background.classList.remove('blur-in');
      background.classList.add('blur-out');
    }
  }

  blur();

  window.addEventListener('scroll', blur, {passive: true});
}

function videoAutoplay(minWidth) {
  const videoPlayer = document.getElementById('video-player');
  if (window.innerWidth > minWidth) videoPlayer.autoplay = true;
}

async function loadGalleryPreview(endpoint, pictureCount) {
  const grid = document.getElementById('galerie-grid');

  let images;
  try {
    images = await fetchJson(endpoint + '/content.json', 'die Bilder des Galerie-Previews');
  } catch (error) {
    const galerieError = document.getElementById('galerie-error');
    galerieError.innerText = error;
    galerieError.classList.remove('hidden');
  }

  const start = Math.floor(Math.random() * (images.length - pictureCount))
  const elements = getMediaFromEndpoint(endpoint, images, start, pictureCount);

  const a = document.createElement('a');
  a.ariaLabel = 'Mehr Bilder anschauen';
  a.href = 'galerie';
  a.classList.add('more-images');

  a.innerHTML = dotsSVG;

  grid.append(...elements, a);
}

function loadIFrames(data) {
  data.forEach(iFrame => document.getElementById(iFrame.id).src = iFrame.src)
}