countDown('2024', '02', '09', '19', '00');
blinking(
  2000, 4000,
  1, 3,
  75, 25,
  'counter-frame');
loadMaps();

function countDown(year, month, day, hour, minute) {
  const days = document.getElementById('days');
  const hours = document.getElementById('hours');
  const minutes = document.getElementById('minutes');
  const seconds = document.getElementById('seconds');

  const date = Date.parse(`${year}-${month}-${day}T${hour}:${minute}:00.000+01:00`);

  /* When too much time is left, the day count has three digits.
     This causes the day counter to overflow out of its border.
     When no time is left, the counter is useless.
  */
  let timeLeft = date - Date.now();
  const hundredDaysInMS = 100 * 24 * 60 * 60 * 1000;
  if (timeLeft > hundredDaysInMS || timeLeft <= 0) return;

  document.getElementById('counter').classList.remove('hidden');
  
  function updateCounter() {
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
  }
  
  updateCounter()
  const countdownTimer = setInterval(() => {
    timeLeft = date - Date.now();

    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      return;
    }
    
    updateCounter();
  }, 1000, { });
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

function loadMaps() {
  const observer = new IntersectionObserver(
    (entries, observer) =>
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = document.createElement('iframe');
          iframe.src = entry.target.dataset.src;
          iframe.allowFullscreen = true;
          iframe.referrerPolicy = 'no-referrer-when-downgrade';
          iframe.title = entry.target.dataset.title;

          entry.target.appendChild(iframe);
          observer.unobserve(entry.target);
        }
      }));

  Array.from(document.getElementsByClassName('lazy-map')).forEach(element => observer.observe(element));
} 